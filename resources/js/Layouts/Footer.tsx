import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import mobawon from '@/../../public/logo-mobdwon.png'
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

import { PageProps } from '@/types';


import { FaPhoneAlt } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { Button, Modal } from 'antd';

interface SocialLink {
    id: number;
    link: string;
    icon_path: string;
}
interface OfficeRegional {
    id: number;
    state: string;
    address: string;
    phone: string;
    phone_free: string;
    fax: string;
    email: string
}
interface CustomBrand extends PageProps {


    socialicons: SocialLink[];
    office_reginal: OfficeRegional[]
}


const Footer = () => {
    const { t, i18n } = useTranslation();
    const currentYear = new Date().getFullYear();
    const { socialicons } = usePage<CustomBrand>().props;
    const { office_reginal } = usePage<CustomBrand>().props;
    const { site_setting }: string | any = usePage().props;



    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <footer className="bg-wheat  w-full">
            <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[30%_1fr] gap-8">

                {/* Logo & Description & Social */}
                <div className={`flex flex-col items-center md:items-start gap-4 border-b pb-6 lg:pb-0 lg:border-b-0
                    border-gray-300
                    ${i18n.language === 'ar' ? 'lg:border-l' : 'lg:border-r'}`}
                >
                    <div className="flex flex-col md:flex-row justify-between gap-8 ">
                        {/* المكتب الرئيسي */}
                        <div className="flex flex-col gap-4 md:w-1/2 text-gray-400">
                            <h2 className="text-xl font-bold text-black text-nowrap">{t('footer.contact_us')}</h2>

                            {office_reginal.length > 0 && (
                                <>
                                    <h3 className="text-lg font-semibold text-nowrap">
                                        {office_reginal[0].state}
                                    </h3>

                                    <ul className="space-y-4">

                                        <li className="flex items-center gap-3">
                                            <FaPhoneAlt className="text-primary-color text-xl flex-shrink-0" />
                                            <p className="text-gray-700 text-nowrap">{office_reginal[0].phone}</p>
                                        </li>
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* المكاتب الأخرى */}
                        <div className="flex flex-col gap-4 md:w-1/2 text-gray-400">
                            <h2 className="text-xl font-bold text-black text-nowrap">{t('footer.other_office')}</h2>

                            <ul className="space-y-3">
                                {office_reginal.length > 1 &&
                                    office_reginal
                                        .slice(1) // استبعاد أول مكتب
                                        .map((office, idx) => (
                                            <li key={idx} className="pb-3">
                                                <h4
                                                    onClick={showModal}
                                                    className="font-semibold underline cursor-pointer">{office.state}</h4>

                                                <Modal
                                                    // title="Basic Modal"
                                                    // closable={{ 'aria-label': 'Custom Close Button' }}
                                                    open={isModalOpen}
                                                    onOk={handleOk}
                                                    // closable={false}
                                                    // closeIcon={false}
                                                    // onCancel={handleCancel}
                                                    footer={[
                                                        <Button key="ok" type="primary" onClick={handleOk}>
                                                            OK
                                                        </Button>,
                                                    ]}

                                                >
                                                    <div
                                                        className='flex flex-col justify-center items-center gap-4'
                                                    >
                                                        <p>
                                                            {office.state}
                                                        </p>
                                                        <p
                                                            className='text-center'
                                                        >
                                                            {office.address}
                                                        </p>
                                                        <p>
                                                            {office.phone}
                                                        </p>
                                                        <p>
                                                            {office.fax}
                                                        </p>
                                                        {office.phone_free && (
                                                            <p>{office.phone_free}</p>
                                                        )}
                                                        <p>
                                                            {office.email}
                                                        </p>
                                                    </div>

                                                </Modal>
                                            </li>
                                        ))}
                            </ul>
                        </div>
                    </div>


                    <div className="flex gap-4 flex-wrap justify-center md:justify-start">

                        {socialicons.length > 0 && socialicons.map((social) => (
                            <a
                                key={social.id}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full  bg-primary-color p-2 "
                            >
                                <div className='w-5' dangerouslySetInnerHTML={{ __html: social.icon_path }} />
                            </a>
                        ))}

                    </div>


                </div>



                {/* Links Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Section: About */}



                    {/* Section: Products */}
                    <div className="flex flex-col gap-4">
                        <p

                            className="text-xl text-black font-bold">{t('footer.information')}</p>
                        <ul className="space-y-1 whitespace-nowrap text-gray-400 ">

                            <li>
                                <Link
                                    href={route('delivery', { lang: i18n.language })}
                                >
                                    {t('footer.delivery')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('privacy', { lang: i18n.language })}
                                >
                                    {t('footer.policy')}
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Section: Build */}
                    <div className="flex flex-col gap-4">
                        <p

                            className="text-xl text-black font-bold">{t('footer.my_account')}</p>
                        <ul className="space-y-1 whitespace-nowrap text-gray-400">
                            <li><Link href={route('my-cart', { lang: i18n.language })}
                                className="hover:text-primary-color">
                                {t('footer.mycart')}
                            </Link>
                            </li>

                            <li><Link href={route('wish-list', { lang: i18n.language })} className="hover:text-primary-color ">
                                {t('footer.wichlist')}
                            </Link>
                            </li>


                        </ul>
                    </div>

                </div>
            </div>

        </footer>
    )
}

export default Footer;
