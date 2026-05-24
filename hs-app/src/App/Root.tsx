import mainFon from "../assets/mainFon.jpg";
import logo from "../assets/logo.png";
import insta from "../assets/insta.png";
import git from "../assets/git.png";
import {NavLink, Outlet} from "react-router-dom";
import tg from "../assets/tg.png";
import { useState } from "react";


export default function Root() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div
            style={{ backgroundImage: `url(${mainFon})`}}
            className='fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat forward-layer'>

            <nav className="relative z-50">
                <div className={`container mx-auto px-4 py-4 flex items-center justify-between gap-8 text-white bg-gray-900/20 backdrop-blur-md border-b border-white/5 md:border-x md:border-white/5 md:rounded-b-2xl `}>
                    <div className="flex items-center gap-8">
                        <img
                            src={logo}
                            className="w-24 h-auto transition-all duration-800 ease-in-out transform hover:scale-110 hover:rotate-[360deg]"
                            alt="logo"
                        />
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink to="/news" className={({ isActive }) =>
                            `transition-colors hover:text-yellow-500 ${isActive ? 'text-yellow-500' : 'text-white'}`
                        }>
                            Главная
                        </NavLink>
                        <NavLink to="/cards" className={({ isActive }) =>
                            `transition-colors hover:text-yellow-500 ${isActive ? 'text-yellow-500' : 'text-white'}`
                        }>
                            Карты
                        </NavLink>
                        <NavLink to="/decks" className={({ isActive }) =>
                            `transition-colors hover:text-yellow-500 ${isActive ? 'text-yellow-500' : 'text-white'}`
                        }>
                            Колоды
                        </NavLink>
                        <NavLink to="/guides" className={({ isActive }) =>
                            `transition-colors hover:text-yellow-500 ${isActive ? 'text-yellow-500' : 'text-white'}`
                        }>
                            Гайды
                        </NavLink>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleMenu}
                            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-10 relative"
                            aria-label="Меню"
                        >
                            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className={`
        md:hidden absolute top-full left-0 right-0 transition-all duration-300 z-40
        ${isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
    `}>
                    <div className="bg-gray-900/30 backdrop-blur-md border-b border-white/5">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col py-2 space-y-1">
                                <NavLink
                                    to="/news"
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `px-4 py-3 transition-all duration-200 hover:bg-white/10 hover:pl-6 hover:text-yellow-500 hover: rounded-sm ${
                                            isActive ? 'text-yellow-500 bg-white/5 rounded-sm' : 'text-white'
                                        }`
                                    }
                                >
                                    Главная
                                </NavLink>

                                <NavLink
                                    to="/cards"
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `px-4 py-3 transition-all duration-200 hover:bg-white/10 hover:pl-6 hover:text-yellow-500 hover: rounded-sm ${
                                            isActive ? 'text-yellow-500 bg-white/5 rounded-sm' : 'text-white'
                                        }`
                                    }
                                >
                                    Карты
                                </NavLink>

                                <NavLink
                                    to="/decks"
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `px-4 py-3 transition-all duration-200 hover:bg-white/10 hover:pl-6 hover:text-yellow-500 hover: rounded-sm ${
                                            isActive ? 'text-yellow-500 bg-white/5 rounded-sm' : 'text-white'
                                        }`
                                    }
                                >
                                    Колоды
                                </NavLink>

                                <NavLink
                                    to="/guides"
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `px-4 py-3 transition-all duration-200 hover:bg-white/10 hover:pl-6 hover:text-yellow-500 hover: rounded-sm ${
                                            isActive ? 'text-yellow-500 bg-white/5 rounded-sm' : 'text-white'
                                        }`
                                    }
                                >
                                    Гайды
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>



                <main>
                    <div className={'container mx-auto px-6 py-4 flex items-center gap-8 text-white'}>
                        <Outlet />
                    </div>

                </main>



            <footer className="mt-auto bg-gray-900/20 backdrop-blur-md border-t border-white/5 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                            <span>© 2026 CristalHS. Все права защищены.</span>
                        </div>

                        <div className="flex gap-6 items-center ">
                            <a
                                href="https://t.me/boost/CristalHearthstone"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-2 transition-all duration-300 hover:scale-110 hover:opacity-80 hover:text-yellow-500"
                                aria-label="Telegram канал"
                            >
                                <img
                                    src={tg}
                                    alt="Telegram"
                                    className="w-5 h-5"
                                />
                                Telegram
                            </a>
                            <a
                                href="https://www.instagram.com/shokoladcore/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-2 transition-all duration-300 hover:scale-110 hover:opacity-80 hover:text-yellow-500"
                                aria-label="Instagram владельца"
                            >
                                <img
                                    src={insta}
                                    alt="Instagram"
                                    className="w-5 h-5"
                                />
                                Instagram
                            </a>

                            <a
                                href="https://github.com/dashboard"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-2 transition-all duration-300 hover:scale-110 hover:opacity-80 hover:text-yellow-500"
                                aria-label="GitHub"
                            >
                                <img
                                    src={git}
                                    alt="GitHub"
                                    className="w-5 h-5"
                                />
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    )
}