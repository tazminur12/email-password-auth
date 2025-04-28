import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to Email Password Authentication</h2>
                <p className="text-lg text-gray-600 mb-6">
                    A simple authentication solution with email and password. Secure, fast, and easy to use.
                </p>

                <div className="space-x-4">
                    <a href="/login" className="inline-block px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300">
                        Login
                    </a>
                    <a href="/register" className="inline-block px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-300">
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;
