import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.init'; // Make sure this path is correct
import { toast } from 'react-hot-toast';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(''); // Success message state
    const navigate = useNavigate();

    const handleRegister = e => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess('');

        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const gender = e.target.gender.value;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        // Validation
        if (!emailRegex.test(email)) {
            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters.' }));
            setLoading(false);
            return;
        }

        // Create Firebase user
        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                console.log(result);
                
                // Update user profile with first name, last name, and gender
                updateProfile(result.user, {
                    displayName: `${firstName} ${lastName}`,
                    photoURL: gender, // Storing gender as photoURL (You can store it elsewhere too)
                }).then(() => {
                    console.log('User profile updated');
                }).catch(error => {
                    console.error('Error updating profile:', error);
                    toast.error('Error updating profile information.');
                });

                // Send email verification
                sendEmailVerification(result.user)
                    .then(() => {
                        toast.success('Registration successful! Please verify your email and login.');
                        setSuccess('Registration successful! Please verify your email.');
                        setLoading(false);
                        
                        setTimeout(() => {
                            navigate('/login'); // Redirect to login page after 2 seconds
                        }, 2000);
                    })
                    .catch(error => {
                        console.error('Error sending verification email: ', error);
                        setLoading(false);
                        setErrors(prev => ({ ...prev, email: 'Error sending verification email. Please try again.' }));
                        toast.error('Error sending verification email. Please try again.');
                    });
            })
            .catch(error => {
                console.error(error);
                setLoading(false);

                const errorCode = error.code;
                let errorMessage = 'Registration failed. Please try again.';

                // Handle different error codes
                if (errorCode === 'auth/email-already-in-use') {
                    errorMessage = 'This email is already registered. Please login.';
                } else if (errorCode === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address.';
                } else if (errorCode === 'auth/weak-password') {
                    errorMessage = 'Password should be stronger (at least 8 characters).';
                }

                setErrors(prev => ({ ...prev, email: errorMessage }));
                toast.error(errorMessage);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an Account</h1>

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* First Name Field */}
                    <div>
                        <label htmlFor="firstName" className="block mb-2 text-sm font-semibold text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="John"
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Last Name Field */}
                    <div>
                        <label htmlFor="lastName" className="block mb-2 text-sm font-semibold text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Doe"
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="your@email.com"
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Gender Field */}
                    <div>
                        <label htmlFor="gender" className="block mb-2 text-sm font-semibold text-gray-700">Gender</label>
                        <select
                            name="gender"
                            id="gender"
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            minLength="8"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                            placeholder="********"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Must be at least 8 characters, include a number, a lowercase and an uppercase letter.
                        </p>
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    {/* Success Message */}
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    {/* Loading Spinner */}
                    {loading && <div className="flex justify-center items-center my-4"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}

                    {/* Submit Button */}
                    <div>
                        <button 
                            type="submit" 
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-600 mt-6">
                    Already have an account? 
                    <Link to="/login" className="text-blue-500 hover:underline ml-1">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
