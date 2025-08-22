import ContentRenderer from '@/Components/ContentRenderer';
import ImageZoomBox from '@/Components/ImageZoom/ImageZoomBox';
import StarRating from '@/Components/StarRating';
import { addtoCart, getCart, removeFormCart, toggelWishList } from '@/utils/cartUtils';
import { Head, Link, usePage } from '@inertiajs/react';
import { notification, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { IoIosHeartEmpty } from 'react-icons/io';
import { IoHomeSharp } from 'react-icons/io5';

export interface ProductOption {
    id: number;
    title: string;
    price: number;
}
export interface ProductType {
    id: number;
    title: string;
    content: string;
    product_code: string;
    avilable: boolean;
    state: string;
    rate: number;
    main_image: string;
    images: string[];
    product_option: ProductOption[];
    slug: string;
    category_title: string;
    category_slug: string;
    subcategory_title?: string;
    subcategory_slug?: string;
}
interface props {
    product: ProductType;
}
const Index = ({ product }: props) => {
    const { t, i18n } = useTranslation();

    const [review, setReview] = useState(false)
    // filter option price
    const [selectedOptions, setSelectedOptions] = useState<{ [productId: number]: number }>({});

    // handel selected option price
    const handelOptionPrice = (productId: number, optionId: number) => {
        setSelectedOptions(prev => ({
            ...prev,
            [productId]: optionId
        }))
    }

    const SelectedOptionId = selectedOptions[product.id] || product.product_option[0].id;
    const filterOptionPrice = product.product_option.find(opt => opt.id === SelectedOptionId);

    const [api, contextHolder] = notification.useNotification();

    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    const getkey = (productId: number, optionId: number) => `${productId}-${optionId}`;

    const [Loading, setLoadin] = useState<boolean>(false)
    // state of cart item ui
    type CartItem = {
        productId: number;
        optionId: number;
        image: string;
        title: string;
        price: number;
        quantity: number;
    };

    const [CartItems, setCarItems] = useState<CartItem[]>([]);
    const fetchCartItems = async () => {
        const cart = await getCart();
        setCarItems(cart);
    }


    useEffect(() => {
        const newQuantities: { [key: string]: number } = {};
        CartItems.forEach((item) => {
            const key = getkey(item.productId, item.optionId);
            newQuantities[key] = item.quantity
        })
    }, [CartItems])

    useEffect(() => {
        fetchCartItems()
    }, [])

    const handelAddToCart = (productId: number, optionId: number, title: string, image: string, price: number) => {
        const key = getkey(productId, optionId);
        setQuantities((prev) => ({
            ...prev,
            [key]: (prev[key] || 0) + 1

        }))

        addtoCart(productId, optionId, title, image, price, 1);
        fetchCartItems();

        api['success']({
            message: '',
            description: `${t('notify.add_cart')}`

        })


    }

    const handelIncressCart = (productId: number, optionId: number, title: string, image: string, price: number) => {

        const key = getkey(productId, optionId);
        setQuantities((prev) => ({
            ...prev,
            [key]: (prev[key] || 0) + 1

        }))

        addtoCart(productId, optionId, title, image, price, 1);
        fetchCartItems();

        api['success']({
            message: '',
            description: `${t('notify.add_cart')}`

        })

    }

    const handelDecressCart = (productId: number, optionId: number) => {

        const key = getkey(productId, optionId);
        setQuantities((prev) => ({
            ...prev,
            [key]: Math.max((prev[key] || 1) - 1, 0)

        }))

        removeFormCart(productId, optionId, 1);
        fetchCartItems();

        api['success']({
            message: '',
            description: `${t('notify.remove_cart')}`

        })


    }

    const handelToggelWishList = (productId: number, title: string, image: string, optionId: number , state:string , slug:string) => {
        toggelWishList(productId, title, image, optionId , state , slug);

        api['success']({
            message: '',
            description: `${t('notify.wish_list')}`

        })
    }

    const getQuantity = useCallback(

        (productId: number, optionId: number) => {
            const key = getkey(productId , optionId);
            return quantities[key] || 0
        }, [quantities]
    )


    const [rating, setRating] = useState<number>(0);

    const [formdata, setFormData] = useState({
        username: '',
        reviews: '',
        rate: 0
    });

    const handelInputChange = (field: string, value: string | number) => {
        setFormData((prev) => (
            {
                ...prev,
                [field]: value
            }
        ))
    }

    const handleRatingClick = (value: number) => {
        setRating(value);
        handelInputChange('rate', value)
    };
    const HandelSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }
    return (
        <>
            <Head title={product.title} />
            {contextHolder}
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
                    <Link
                        href={route('category', { lang: i18n.language, slug: product.category_slug })}

                    >
                        {product.category_title}
                    </Link>
                    {
                        product.subcategory_title &&
                        <Link
                            href={route('subcategory', { lang: i18n.language, category: product.category_slug, subcategory: product.subcategory_slug })}

                        >
                            {product.subcategory_title}
                        </Link>

                    }

                    <a
                        href={`${usePage().url}`}
                        className='text-primary-color'
                    >
                        {product.title}
                    </a>



                </div>
                {/* section of header title */}
                <section
                    className='grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-4 my-4 '
                >
                    <div>
                        <ImageZoomBox image={product.main_image} images={product.images} />
                    </div>


                        <div
                            className='mx-4 lg:mx-0'
                        >
                            <h2
                                className='lg:text-3xl text-xl pb-4 font-bold border-b-2'
                            >{product.title}</h2>

                            <div
                                className='my-4 flex gap-12 items-center border-b-2 pb-4'
                            >
                                <div
                                    className='flex '
                                >
                                    <StarRating rating={product.rate} />
                                </div>

                                <div
                                    className='border-r-2 border-l-2 px-8 hover:text-primary-color cursor-pointer'
                                    onClick={() => {
                                        setReview(true)
                                        const element = document.getElementById('reviews-comment');
                                        if (element) {

                                            element.scrollIntoView({ behavior: 'smooth' })
                                        }
                                    }}
                                >
                                    {t('products.review')}
                                </div>

                                <p
                                    className='hover:text-primary-color cursor-pointer'
                                    onClick={() => {
                                        setReview(true)
                                        const element = document.getElementById('reviews-comment');
                                        if (element) {

                                            element.scrollIntoView({ behavior: 'smooth' })
                                        }
                                    }}
                                >
                                    {t('products.comment')}
                                </p>
                            </div>

                            {/* price */}
                            <div
                                className='font-medium text-4xl my-4 pb-4 border-b-2'
                            >
                                {filterOptionPrice?.price} {t('home.pound')}
                            </div>

                            {/* code and available */}
                            <div
                                className='my-4 pb-4 border-b-2 flex flex-col'
                            >
                                <div
                                    className='flex gap-4 items-center my-2'
                                >
                                    <p>{t('products.product_code')}</p>
                                    :
                                    <p>{product.product_code}</p>
                                </div>
                                <div
                                    className='flex gap-4 items-center my-2'
                                >
                                    <p>{t('products.available')}</p>
                                    :
                                    <div>{product.avilable ?
                                        <p
                                            className='bg-primary-color p-2 rounded-lg text-white'
                                        > {t('products.no_stock')} </p>
                                        :
                                        <p
                                            className='bg-green-400 p-2 rounded-lg text-white'
                                        >
                                            {t('products.stock')}
                                        </p>
                                    }
                                    </div>
                                </div>

                            </div>

                            {/* selecet */}
                            <div
                                className=' rounded-lg p-4 bg-slate-200 flex flex-col gap-6'
                            >
                                <p
                                    className='lg:text-2xl font-bold text-xl'
                                >{t('products.select_price')}</p>

                                <div
                                    className='w-full'
                                >
                                    <select

                                        name='price'
                                        className={`rounded-xl focus:border-primary-color focus:ring-primary-color ${i18n.language == 'ar' ? '!pl-10 pr-2' : '!pr-10 pl-2'} w-full`}
                                        style={{
                                            backgroundPosition: `${i18n.language == 'ar' ? 'left' : 'right'}`
                                        }}
                                        defaultValue={product.product_option[0].title}
                                        onChange={(e) => handelOptionPrice(product.id, Number(e.target.value))}
                                    >
                                        {product.product_option.map((option, index) =>
                                            <option
                                                key={index}
                                                value={option.id}

                                            >
                                                {option.title} - ({option.price} {t('home.pound')})
                                            </option>
                                        )}
                                    </select>
                                </div>

                                {/* add to cart and wish list */}
                                <div
                                    className='flex w-full gap-4 flex-col lg:flex-row'
                                >
                                    {product.avilable ?


                                        (
                                            <button
                                                type='button'
                                                disabled={true}
                                                // onClick={() => handelAddToCart(product.id, SelectedOptionId, product.title, product.main_image, filterOptionPrice?.price ?? 0)}
                                                className='rounded-lg border-[1px] hover:bg-primary-color hover:text-white transition-all duration-300 border-primary-color px-4 py-2 cursor-not-allowed'
                                            >
                                                {t('exhibition.add_to_cart')}
                                            </button>
                                        )
                                        :

                                        getQuantity(product.id, SelectedOptionId) > 0 ?

                                            (
                                                <div
                                                    className='flex justify-between items-center gap-4'
                                                >
                                                    <button
                                                        type='button'
                                                        disabled={Loading}
                                                        onClick={() => handelIncressCart(product.id, SelectedOptionId, product.title, product.main_image, filterOptionPrice?.price ?? 0)}
                                                        className='rounded-lg  bg-primary-color text-white text-center px-4 py-2'
                                                    >
                                                        +
                                                    </button>

                                                    <span className="font-medium">
                                                        {getQuantity(product.id, SelectedOptionId)}
                                                    </span>

                                                    <button
                                                        type='button'
                                                        disabled={Loading}
                                                        onClick={() => handelDecressCart(product.id, SelectedOptionId)}
                                                        className='rounded-lg bg-primary-color text-white text-center px-4 py-2'
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            )

                                            :
                                            (
                                                <button
                                                    type='button'
                                                    disabled={Loading}
                                                    onClick={() => handelAddToCart(product.id, SelectedOptionId, product.title, product.main_image, filterOptionPrice?.price ?? 0)}
                                                    className='rounded-lg border-[1px] hover:bg-primary-color hover:text-white transition-all duration-300 border-primary-color px-4 py-2'
                                                >
                                                    {t('exhibition.add_to_cart')}
                                                </button>
                                            )

                                    }

                                    <button
                                        type='button'
                                        onClick={() => handelToggelWishList(product.id, product.title, product.main_image, SelectedOptionId , product.state, product.slug)}
                                        className='rounded-lg border-[1px] hover:bg-primary-color hover:text-white transition-all duration-300 border-primary-color px-4 py-2 text-lg'
                                    >
                                        <Tooltip title={t('exhibition.wich_list')} >
                                            <IoIosHeartEmpty />
                                        </Tooltip>
                                    </button>
                                </div>
                            </div>
                        </div>


                </section>

                {/* section of subcateogry and products */}
                <section
                    className='grid grid-cols-1 lg:grid-cols-1 gap-4 my-4'
                >


                    <div
                        className='border-[1px] rounded-lg'
                    >

                        <div
                            className='border-b-2 px-4 py-2 flex gap-6 items-center'
                        >
                            <button
                                className={`capitalize lg:text-xl text-lg ${review ? 'text-black' : 'text-primary-color'}`}
                                onClick={() => setReview(false)}
                            >{t('products.description')}</button>
                            <button
                                className={`capitalize lg:text-xl text-lg ${review ? 'text-primary-color' : 'text-black'}`}
                                onClick={() => setReview(true)}
                            >
                                {t('products.reviews')}
                            </button>
                        </div>

                        <div
                            id='reviews-comment'
                            className='px-4 py-4'
                        >
                            {review ?
                                <div

                                >
                                    <div
                                        className='text-xl py-4'
                                    >{t('products.form.title')}</div>
                                    <form
                                        onSubmit={HandelSubmitForm}
                                        noValidate={false}

                                        className='flex flex-col gap-4'
                                    >
                                        <div
                                            className='flex flex-col w-full gap-2'
                                        >
                                            <label htmlFor="username">
                                                {t('products.form.name')}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name='username'
                                                required
                                                id='username'
                                                value={formdata.username}
                                                onChange={(e) => handelInputChange('username', e.target.value)}
                                                className='rounded-xl'
                                            />
                                        </div>
                                        <div
                                            className='flex flex-col w-full gap-2'
                                        >
                                            <label htmlFor="reviews">
                                                {t('products.form.reviews')}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="reviews"
                                                id="reviews"
                                                required
                                                rows={4}
                                                value={formdata.reviews}
                                                onChange={(e) => handelInputChange('reviews', e.target.value)}
                                                className='rounded-xl'
                                            ></textarea>
                                        </div>

                                        <div className="flex flex-col w-full gap-2">
                                            <label>
                                                {t('products.form.rate')}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((value) => (
                                                    <span
                                                        key={value}
                                                        className={`text-2xl cursor-pointer ${value <= rating ? 'text-yellow-400' : 'text-gray-300'
                                                            }`}
                                                        onClick={() => handleRatingClick(value)}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <button
                                                type='submit'
                                                className='bg-primary-color px-4 py-2 rounded-lg text-white'
                                            >
                                                {t('products.form.submit')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                :
                                <ContentRenderer content={product.content} />
                            }
                        </div>

                    </div>

                </section>
            </section>
        </>
    )
}

export default Index