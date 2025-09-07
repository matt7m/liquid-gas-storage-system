import React, { useState } from 'react';

function Sidebar() {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const menuItems = [
        { name: 'Panel główny', icon: '📊', link: '/dashboard' },
        { name: 'Lista dokumentów', icon: '📋', link: '/docs' },
        { name: 'Cysterny', icon: '🚚', link: '/tanks' },
        { name: 'Administracja dokumentów', icon: '📒', link: '/docsAdmin' },
        { name: 'Login', icon: '🔐', link: '/login' },
    ];

    return (
        <aside className="w-64 h-screen bg-gradient-to-b from-blue-500 to-blue-900 shadow-xl left-0 top-0 z-40">
            <div className="p-5 border-b border-blue-600 border-opacity-30">
                <h2 className="text-white text-lg font-bold">Panel administratora</h2>
                <p className="text-blue-200 text-xs mt-1">System zarządzania magazynem LPG</p>
            </div>

            <ul className="mt-5">
                {menuItems.map((item) => (
                    <li key={item.name} className="mb-1">
                        <a
                            href={item.link}
                            className={`flex items-center px-5 py-3 text-sm font-medium transition-all duration-200 border-l-3 ${activeItem === item.name
                                ? 'bg-white bg-opacity-15 text-white border-blue-300'
                                : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white hover:border-blue-400 border-transparent'
                                }`}
                            onClick={() => setActiveItem(item.name)}
                        >
                            <span className="mr-3 text-base">{item.icon}</span>
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;