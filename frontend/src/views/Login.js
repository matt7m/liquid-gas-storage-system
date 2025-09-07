import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login:', { email, password });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white flex items-center justify-center p-5">
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Logowanie</h2>
                    <p className="text-gray-600 text-sm">Konto pracownicze do możliwości administrowania danymi</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adres e-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                            placeholder="E-mail"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hasło
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                            placeholder="Haslo"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Zaloguj
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        Odnowić hasło do konta?
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;