import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase.init';
import { toast } from 'react-hot-toast'; // Import toast for better notifications
import { Eye, EyeOff } from 'lucide-react'; // Using lucide-react icons (or you can use Heroicons, FontAwesome, etc.)

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
    const [isForgotPassword, setIsForgotPassword] = useState(false); // New state for handling forgot password toggle
    const navigate = useNavigate();

    const handleLogin = e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log(email, password);

        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                console.log(result.user);
                setSuccess('Login successful!');
                toast.success('Login successful!');
                setLoading(false);
                navigate('/'); // Ensure this is your desired page after login
            })
            .catch(error => {
                console.error(error.message);
                setError('Login Failed: ' + error.message);
                setLoading(false);
            });
    };

    const handleForgotPassword = e => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const email = e.target.email.value;
        if (!email) {
            setError('Please enter your email address to reset the password.');
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setSuccess('Password reset link sent to your email!');
                toast.success('Password reset link sent!');
                setIsForgotPassword(false); // Close the forgot password form after successful request
            })
            .catch(error => {
                console.error(error.message);
                setError('Error resetting password: ' + error.message);
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const toggleForgotPasswordForm = () => {
        setIsForgotPassword(prev => !prev);
        setError('');
        setSuccess('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {isForgotPassword ? 'Reset Your Password' : 'Login to Your Account'}
                </h1>

                {/* Forgot Password Form */}
                {isForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="space-y-5">
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
                        </div>

                        {/* Error or Success Message */}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center items-center my-4">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                                disabled={loading}
                            >
                                {loading ? 'Sending email...' : 'Send Password Reset Email'}
                            </button>
                        </div>

                        {/* Back to Login Link */}
                        <p 
                            className="text-sm text-center text-blue-500 mt-6 cursor-pointer"
                            onClick={toggleForgotPasswordForm}
                        >
                            Back to Login
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-5">
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
                        </div>

                        {/* Password Field with Eye Icon */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                required
                                placeholder="********"
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <div
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>

                        {/* Error or Success Message */}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center items-center my-4">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Don't have an account with Link to Register */}
                {!isForgotPassword && (
                    <p className="text-sm text-center text-gray-600 mt-6">
                        Don't have an account? 
                        <Link to="/register" className="text-blue-500 hover:underline ml-1">
                            Register
                        </Link>
                    </p>
                )}

                {/* Forgot Password Link */}
                {!isForgotPassword && (
                    <div className="text-right text-sm text-blue-500 mt-4 cursor-pointer">
                        <p onClick={toggleForgotPasswordForm} className="hover:underline">Forgot Password?</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
