
import { addtoCart, getCart,  removeFormCart, toggelWishList } from '@/utils/cartUtils';

import { Link, usePage } from '@inertiajs/react';
import { notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { FaList } from 'react-icons/fa';
import { IoHomeSharp } from 'react-icons/io5';
import { RiLayoutGrid2Fill } from 'react-icons/ri';

export interface CartItem {
    productId: number;

    title: string;
    image: string;
    price: number;
    optionId: number;
    quantity: number;

    product_code?:string;
    option_title?:string;

    option_price?:string;

}

const Index = () => {
    const { t, i18n } = useTranslation();

    const [cartitem, setCartItem] = useState<CartItem[]>([])

    const fetchCartItems = async ()=>{
        const cart = await getCart();
        setCartItem(cart);
    }

    useEffect(()=>{
        fetchCartItems()
    } , [])


    const [api, contextHolder] = notification.useNotification();

    const refreshCart = () => {
        fetchCartItems()
    }

    const handelAddToCart = async (productId: number, optionId: number, title: string, image: string, price: number) => {
        await addtoCart(productId, optionId, title, image, price, 1);
        refreshCart();

        api['success']({
            message: '',
            description: `${t('notify.add_cart')}`

        })

    }

    const handelIncressCart = async (productId: number, optionId: number, title: string, image: string, price: number) => {
        await addtoCart(productId, optionId, title, image, price, 1);
        refreshCart();

        api['success']({
            message: '',
            description: `${t('notify.add_cart')}`

        })
    }

    const handelDecressCart = async (productId: number, optionId: number) => {
        await removeFormCart(productId, optionId, 1);
        refreshCart();

        api['success']({
            message: '',
            description: `${t('notify.remove_cart')}`

        })

    }

    const handelToggelWishList = (productId: number, title: string, image: string, optionId: number ,state:string , slug:string) => {
        toggelWishList(productId, title, image, optionId , state, slug);

        api['success']({
            message: '',
            description: `${t('notify.wish_list')}`

        })
    }

    const totalPrice = ()=>{
        return cartitem.reduce((sum , item) => sum + item.price  * item.quantity , 0).toFixed(2)

    }

    // const getQuantity = (productId: number, optionId: number) => {
    //     const item = cartitem.find(pro => pro.productId === productId && pro.optionId === optionId);
    //     return item?.quantity ?? 0;
    // }


    return (
        <section
            className='min-h-screen max-w-7xl mx-auto'
        >
            <div
                className='h-48'
            ></div>
            <div className='bg-slate-300 p-2 rounded-lg flex items-center gap-6 px-6'>
                <Link
                    href={route('welcome', { lang: i18n.language })}
                >
                    <IoHomeSharp />
                </Link>


            </div>
            {/* section of header title */}
            <section
                className='grid grid-cols-1 gap-4'
            >
                {cartitem.map((item, index) =>
                    <div
                        key={index}
                        className='px-4 py-2 border-2 rounded-lg my-4 flex items-center gap-4'
                    >

                        <div>
                            <img src={item.image} alt="" className='h-28' />
                        </div>

                        <div
                            className='flex flex-col justify-between gap-4'
                        >
                            <p
                                className=' font-semibold text-lg hover:text-primary-color'
                            >{item.title}
                            </p>
                            <p

                            >
                                {item.product_code}
                            </p>
                            <p

                            >
                                {item.option_title}
                            </p>
                            <p

                            >
                                {item.price} {t('home.pound')}
                            </p>

                            <div
                                className='flex w-full gap-4 flex-col lg:flex-row'
                            >
                                <div
                                    className='flex justify-between items-center gap-4'
                                >
                                    <button
                                        type='button'
                                        onClick={() => handelIncressCart(item.productId, item.optionId, item.title, item.image, item.price)}
                                        className='rounded-lg  bg-primary-color text-white text-center px-4 py-2'
                                    >
                                        +
                                    </button>

                                    <span className="font-medium">
                                        {item.quantity}
                                        {/* {getQuantity(item.productId, item.optionId)} */}
                                    </span>

                                    <button
                                        type='button'
                                        onClick={() => handelDecressCart(item.productId, item.optionId)}
                                        className='rounded-lg bg-primary-color text-white text-center px-4 py-2'
                                    >
                                        -
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                )}
            </section>
            <section
            className={`flex ${i18n.language == 'ar' ? 'justify-end' : 'justify-end'} `}
            >
                <table

                >
                    <tbody
                        className='border'
                    >
                        <tr>
                            <td className='border p-1'>{t('navbarlist.cartnav.sub_total')}</td>
                            <td className='border p-1'>{totalPrice()} {t('home.pound')}</td>
                        </tr>
                        <tr>
                            <td className='border p-1'>{t('navbarlist.cartnav.total')}</td>
                            <td className='border p-1'>{totalPrice()} {t('home.pound')}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section
            className='flex justify-between items-center gap-4 my-4'
            >
                <Link
                href={route('welcome'  , {lang:i18n.language})}
                className='bg-primary-color px-4 py-2 rounded-lg text-white'
                >
                    {t('navbarlist.cartnav.continue')}
                </Link>
                <Link
                href={route('check-out' , {lang:i18n.language})}
                className='bg-primary-color px-4 py-2 rounded-lg text-white'
                >
                    {t('navbarlist.cartnav.check_out')}
                </Link>
            </section>
        </section>
    )
}

export default Index