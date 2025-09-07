import React from 'react';

function Navbar() {
    return (
        <nav className="bg-gray-50 border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="/" className="text-xl font-bold text-blue-700 hover:text-blue-800 transition-colors">
                        Company Name 'XYZ'
                    </a>
                    <ul className="flex space-x-8">
                        {['Panel główny', 'Logowanie'].map((item) => (
                            <li key={item}>
                                <a
                                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className="text-slate-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 font-medium px-4 py-2 rounded-md border border-transparent transition-all duration-200"
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

