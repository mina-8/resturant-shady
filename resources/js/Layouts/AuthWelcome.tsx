import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import LangWraper from './LangWraper';
import { User } from '@/types';
import { useTranslation } from 'react-i18next';

import { AiOutlineGlobal } from 'react-icons/ai';
import { FaArrowUp, FaHeart, FaRegUser, FaTruck, FaUserPlus, FaWhatsapp } from 'react-icons/fa';
import { IoLockClosed, IoMoon, IoSearch } from 'react-icons/io5';
import SearchForm from '@/Components/SearchWeb/SearchForm';
import Footer from './Footer';


import { MdOutlineWbSunny } from 'react-icons/md';
import ChangeLang from '@/Components/ChangeLang/ChangeLang';
import { FaCartShopping } from 'react-icons/fa6';
import { BsCart4 } from 'react-icons/bs';
// import { totalQuantity } from '@/utils/cartUtils';
import CartNav from '@/Components/NavList/CartNav';
import CategoryNav from '@/Components/NavList/CategoryNav';
import { setUser, totalQuantity } from '@/utils/cartUtils';


export default function AuthWelcome({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User, header?: ReactNode }>) {
    const { currentRoute }: string | any = usePage().props;
    const { site_setting }: string | any = usePage().props;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isnavbar, setIsnavbar] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const { t, i18n } = useTranslation();
    const [CartCount, setCartCount] = useState(0);
    setUser(user)

    const updateCountItems = async () => {
        const total = await totalQuantity()
        setCartCount(total);
    }

    useEffect(() => {

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 500);
        };

        const handlnav = () => {
            setIsnavbar(window.scrollY > 100);
        }



        updateCountItems();

        window.addEventListener('scroll', handleScroll);

        window.addEventListener('scroll', handlnav);

        window.addEventListener("cartUpdated", updateCountItems);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handlnav);
            window.removeEventListener("cartUpdated", updateCountItems);
        };
    }, []);

    return (
        <LangWraper>
            <div className="min-h-screen " dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                <nav
                    className={`${isnavbar ? 'fixed' : ''}  top-0 left-0 w-full z-50 transition-colors duration-300 ${isnavbar ? 'bg-black bg-opacity-50' : 'bg-transparent'} `}
                >
                    {!isnavbar && (

                        <div
                            className='bg-primary-color relative after:absolute after:w-full after:h-10 after:bg-primary-color after:-z-10'
                        >
                            {/* top bar */}
                            <div
                                className='flex items-center justify-between max-w-7xl mx-auto px-4 py-4'
                            >

                                <div
                                    className='text-white'
                                >
                                    {t('home.delivery')}
                                </div>
                                <ChangeLang />
                            </div>
                        </div>
                    )}
                    {/* navbar */}
                    <div
                        className={`bg-white ${isnavbar ? 'rounded-none' : 'rounded-full mx-5 shadow-lg'} `}
                    >
                        <div className={`mx-auto py-4 px-6 w-full max-w-screen-xl `}>
                            <div className="flex h-16 ">
                                <div className="flex relative">
                                    <div className="flex shrink-0 items-center">
                                        <Link href={user ? route('dashboard', { lang: i18n.language }) : route('welcome', { lang: i18n.language })}>
                                            <ApplicationLogo
                                                className="lg:h-20 lg:block hidden w-auto fill-current "

                                            />
                                        </Link>
                                    </div>
                                </div>

                                <div className={`hidden xl:ms-6 xl:flex xl:items-center relative justify-between w-full`}>
                                    <div className="hidden gap-1 sm:-my-px sm:ms-10 sm:flex items-center">


                                        <CategoryNav />


                                    </div>
                                    <div className="relative ms-3 flex items-center gap-4">
                                        <button
                                            name='search'
                                            type="button"
                                            className="inline-flex items-center rounded-full px-2 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out "
                                            onClick={() => setShowSearch(true)}
                                        >
                                            <IoSearch size={24} />
                                        </button>


                                        <Dropdown
                                            triggerType="click"
                                        >
                                            <div
                                                className='flex items-center gap-2 cursor-pointer group'
                                            >
                                                <FaRegUser size={24} className='group-hover:text-primary-color' />
                                                {user ?
                                                    <span>{user.name}</span>
                                                    :
                                                    <span>{t('home.login')}</span>
                                                }
                                            </div>
                                            <Dropdown.Content
                                                align='right'
                                                width='w-80'
                                            >
                                                {user ? (
                                                    <div
                                                        className='flex px-2 items-center flex-wrap justify-between gap-4 py-2'
                                                    >

                                                        <div
                                                            className='border-2 rounded-lg flex items-center px-4 '
                                                        >
                                                            <FaHeart />
                                                            <Dropdown.Link
                                                                href={route('wish-list', { lang: i18n.language })}
                                                                method="get"
                                                                as="button"
                                                                className='hover:bg-white focus:bg-white'
                                                            >
                                                                {t('home.wish_list')}
                                                            </Dropdown.Link>
                                                        </div>
                                                        <div
                                                            className='border-2 rounded-lg flex items-center px-4 '
                                                        >
                                                            <Dropdown.Link
                                                                href={route('logout', { lang: i18n.language })}
                                                                method="post"
                                                                as="button"
                                                                className='hover:bg-white focus:bg-white'
                                                            >
                                                                {t('home.logout')}
                                                            </Dropdown.Link>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className='flex px-2 items-center flex-wrap justify-between gap-4 py-2'
                                                    >

                                                        <div
                                                            className='border-2 rounded-lg flex items-center px-4 '
                                                        >
                                                            <FaUserPlus />
                                                            <Dropdown.Link
                                                                href={route('register', { lang: i18n.language })}
                                                                method="get"
                                                                as="button"
                                                                className='hover:bg-white focus:bg-white'
                                                            >
                                                                {t('home.regitser_page')}
                                                            </Dropdown.Link>
                                                        </div>

                                                        <div
                                                            className='border-2 rounded-lg flex items-center px-4 '
                                                        >
                                                            <IoLockClosed />
                                                            <Dropdown.Link
                                                                href={route('login', { lang: i18n.language })}
                                                                method="get"
                                                                as="button"
                                                                className='hover:bg-white focus:bg-white'
                                                            >
                                                                {t('home.login_page')}
                                                            </Dropdown.Link>
                                                        </div>

                                                        <div
                                                            className='border-2 rounded-lg flex items-center px-4 '
                                                        >
                                                            <FaHeart />
                                                            <Dropdown.Link
                                                                href={route('wish-list', { lang: i18n.language })}
                                                                method="get"
                                                                as="button"
                                                                className='hover:bg-white focus:bg-white'
                                                            >
                                                                {t('home.wish_list')}
                                                            </Dropdown.Link>
                                                        </div>
                                                    </div>
                                                )}

                                            </Dropdown.Content>
                                        </Dropdown>

                                        <Dropdown
                                            triggerType="click"
                                        >
                                            <div
                                                className='flex items-center gap-2 cursor-pointer group'
                                            >
                                                <BsCart4 size={24} className='group-hover:text-primary-color' />
                                                <span>{CartCount}</span>
                                                <span>{t('home.items')}</span>
                                            </div>
                                            <Dropdown.Content
                                                align='right'
                                                width='w-60'
                                            >
                                                <CartNav user={user} />

                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>

                                </div>

                                <div className="-me-2 flex items-center gap-4 lg:hidden relative">

                                    <Link href={user ? route('dashboard', { lang: i18n.language }) : route('welcome', { lang: i18n.language })}>
                                        <ApplicationLogo
                                            className="h-10 w-auto fill-current "

                                        />
                                    </Link>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <div
                                                className='flex items-center gap-2 cursor-pointer group'
                                            >
                                                <FaRegUser size={24} className='group-hover:text-primary-color' />
                                                {user ?
                                                    <span>{user.name}</span>
                                                    :
                                                    <span>{t('home.login')}</span>
                                                }
                                            </div>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            {user ? (
                                                <div
                                                    className='flex px-2 items-center flex-wrap justify-between gap-4 py-2'
                                                >

                                                    <div
                                                        className='border-2 rounded-lg flex items-center px-4 '
                                                    >
                                                        <FaHeart />
                                                        <Dropdown.Link
                                                            href={route('wish-list', { lang: i18n.language })}
                                                            method="get"
                                                            as="button"
                                                            className='hover:bg-white focus:bg-white'
                                                        >
                                                            {t('home.wish_list')}
                                                        </Dropdown.Link>
                                                    </div>
                                                    <div
                                                        className='border-2 rounded-lg flex items-center px-4 '
                                                    >
                                                        <Dropdown.Link
                                                            href={route('logout', { lang: i18n.language })}
                                                            method="post"
                                                            as="button"
                                                            className='hover:bg-white focus:bg-white'
                                                        >
                                                            {t('home.logout')}
                                                        </Dropdown.Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className='flex px-2 items-center flex-wrap justify-between gap-4 py-2'
                                                >

                                                    <div
                                                        className='border-2 rounded-lg flex items-center px-4 '
                                                    >
                                                        <FaUserPlus />
                                                        <Dropdown.Link
                                                            href={route('register', { lang: i18n.language })}
                                                            method="get"
                                                            as="button"
                                                            className='hover:bg-white focus:bg-white'
                                                        >
                                                            {t('home.regitser_page')}
                                                        </Dropdown.Link>
                                                    </div>

                                                    <div
                                                        className='border-2 rounded-lg flex items-center px-4 '
                                                    >
                                                        <IoLockClosed />
                                                        <Dropdown.Link
                                                            href={route('check-out', { lang: i18n.language })}
                                                            method="get"
                                                            as="button"
                                                            className='hover:bg-white focus:bg-white'
                                                        >
                                                            {t('home.login_page')}
                                                        </Dropdown.Link>
                                                    </div>

                                                    <div
                                                        className='border-2 rounded-lg flex items-center px-4 '
                                                    >
                                                        <FaHeart />
                                                        <Dropdown.Link
                                                            href={route('wish-list', { lang: i18n.language })}
                                                            method="get"
                                                            as="button"
                                                            className='hover:bg-white focus:bg-white'
                                                        >
                                                            {t('home.wish_list')}
                                                        </Dropdown.Link>
                                                    </div>
                                                </div>
                                            )}
                                        </Dropdown.Content>
                                    </Dropdown>


                                    <Dropdown
                                        triggerType="click"

                                    >
                                        <div
                                            className='flex items-center gap-2 cursor-pointer group'
                                        >
                                            <BsCart4 size={24} className='group-hover:text-primary-color' />
                                            <span>{CartCount}</span>
                                            <span>{t('home.items')}</span>
                                        </div>
                                        <Dropdown.Content
                                            align='right'
                                            width='w-60'
                                        >
                                            <CartNav user={user} />

                                        </Dropdown.Content>
                                    </Dropdown>

                                    <button
                                        onClick={() =>
                                            setShowingNavigationDropdown(
                                                (previousState) => !previousState,
                                            )
                                        }
                                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                className={
                                                    !showingNavigationDropdown
                                                        ? 'inline-flex'
                                                        : 'hidden'
                                                }
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                            <path
                                                className={
                                                    showingNavigationDropdown
                                                        ? 'inline-flex'
                                                        : 'hidden'
                                                }
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`xl:hidden ${showingNavigationDropdown ? 'block' : 'hidden'} bg-white text-black px-4 py-4 shadow-md z-50`}
                    >

                        <div className="space-y-1">
                            <ResponsiveNavLink
                                href={route('welcome', { lang: i18n.language })}
                                active={route().current('welcome')}
                            >
                                {t('home.home')}
                            </ResponsiveNavLink>

                            <CategoryNav />

                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-full bg-yellow-original hover:bg-yellow-700 border border-transparent text-white px-2 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out hover:text-white focus:outline-none"
                                    onClick={() => setShowSearch(true)}
                                >
                                    <IoSearch size={24} />
                                </button>
                            </span>
                        </div>
                    </div>

                </nav>
                {showSearch && <SearchForm onClose={() => setShowSearch(false)} />}
                {header && (
                    <header className="bg-white shadow mt-16">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="relative">{children}</main>
                {isScrolled && (
                    <div className='fixed bottom-4 right-4 z-50'>
                        <div
                            className='bg-primary-color text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-gray-700 transition duration-300 animate-bounce'
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <FaArrowUp />
                        </div>
                    </div>
                )}


                <a
                    className='fixed bottom-4 left-4 z-50 bg-primary-color text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-gray-700 '
                    target='_blank'
                    href={`https://wa.me/+966${site_setting?.whats_app || "#"}`}
                >
                    <FaWhatsapp />
                </a>

                <Footer />
            </div>
        </LangWraper>
    );
}
