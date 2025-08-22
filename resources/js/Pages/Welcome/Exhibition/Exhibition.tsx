import { t } from 'i18next'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import product from '@/../../public/aboutus/product.png'
import { ConfigProvider, notification, Rate, Tooltip } from 'antd'
import StarRating from '@/Components/StarRating'
import { IoIosHeartEmpty } from 'react-icons/io'
import { addtoCart, getCart, removeFormCart, toggelWishList } from '@/utils/cartUtils'
import { Link } from '@inertiajs/react'
import axios from 'axios'
interface ProductOption {
    id: number;
    title: string;
    price: number;
}
interface Products {
    id: number;
    title: string;
    image: string;
    state: string;
    rate: string;
    avilable: boolean;
    slug: string;
    product_option: ProductOption[];
}
interface props {
    products: Products[];
}
const Exhibition = ({ products }: props) => {
    const { t, i18n } = useTranslation();
    const [Products, setProducts] = useState<Products[]>(products);
    const exhibitionButtons = [
        {
            title: "exhibition.special_promtion",
            payload: "special"
        },
        {
            title: "exhibition.new_products",
            payload: "new"
        },
        {
            title: "exhibition.top_seller",
            payload: "top"
        },
        {
            title: "exhibition.kid_range",
            payload: "kids"
        },
    ];

    const [activeBtn, setActiveBtn] = useState('special');

    const [Loading, setLoadin] = useState<boolean>(false)


    // filter product by state

    const FilterProductState = async (state: string) => {
        try {
            setLoadin(true)
            setActiveBtn(state)
            const response = await axios.get(route('filter-products', { lang: i18n.language }), {
                params: {
                    statefilter: state
                }
            });
            setProducts(response.data.products);
        } finally {
            setLoadin(false)
        }

    }

    // filter option price
    const [selectedOptions, setSelectedOptions] = useState<{ [productId: number]: number }>({});

    // handel selected option price
    const handelOptionPrice = (productId: number, optionId: number) => {
        setSelectedOptions(prev => ({
            ...prev,
            [productId]: optionId
        }))
    }


    const [api, contextHolder] = notification.useNotification();

    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    const getkey = (productId: number, optionId: number) => `${productId}-${optionId}`;

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
    const fetchCartItems = () => {
        getCart()
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

        }));

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

        }));

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
        toggelWishList(productId, title, image, optionId , state, slug);

        api['success']({
            message: '',
            description: `${t('notify.wish_list')}`

        })
    }

    const getQuantity = useCallback(

        (productId: number, optionId: number) => {
            const key = getkey(productId, optionId);
            return quantities[key] || 0

        }, [quantities]
    )



    return (
        <section
            className='w-full max-w-6xl mx-auto relative min-h-screen'
        >

            {contextHolder}

            <h2
                className='text-center my-4 font-bold text-3xl'
            >
                {t('home.exhibition')}
            </h2>

            <div
                className='flex justify-center items-center gap-8 my-8 lg:flex-row lg:flex-nowrap flex-wrap'
            >
                {exhibitionButtons.map((item, index) =>
                    <button
                        key={index}
                        type='button'
                        onClick={() => FilterProductState(item.payload)}
                        className={`border-primary-color hover:border-dashed border-opacity-0 hover:border-opacity-100 border-2 px-4 py-2 rounded-lg
                            ${activeBtn === item.payload ? 'border-opacity-100 border-dashed' : ''}
                            `}
                    >
                        {t(item.title)}
                    </button>
                )}
            </div>
            {Loading ? (
                <div>loading ...</div>
            ) :
                (

                    <div
                        className='grid grid-cols-1 lg:grid-cols-4 my-8 gap-6 mx-12 lg:mx-0 '
                    >
                        {Products.map((item, index) => {
                            // fetch select option
                            const SelectedOptionId = selectedOptions[item.id] || item.product_option[0].id;
                            const filterOptionPrice = item.product_option.find(opt => opt.id === SelectedOptionId);
                            return (
                                <div
                                    key={index}
                                    className='border-2 p-4 rounded-lg flex flex-col justify-center items-center gap-4 relative'
                                >
                                    {(item.state == "special" || item.state == "new") && (
                                        <div
                                            className={`absolute top-4 ${i18n.language == 'ar' ? 'left-0 rounded-s-full' : 'right-0 rounded-s-full'}  bg-primary-color text-white py-1 px-2`}
                                        >
                                            {item.state == 'special' ? t('exhibition.special') : t('exhibition.new')}
                                        </div>
                                    )}
                                    <Link
                                        href={route('product-show', { lang: i18n.language, state: item.state, product: item.slug })}>
                                        <div>
                                            <img src={item.image} alt="" className='h-52' />
                                        </div>
                                        <p
                                            className='self-start font-medium text-lg hover:text-primary-color'
                                        >{item.title}</p>
                                    </Link>
                                    {/* price and rating */}
                                    <div
                                        className='flex justify-between items-center w-full'
                                    >
                                        <p
                                            className='font-semibold text-lg text-primary-color'
                                        >
                                            {filterOptionPrice?.price} {t('home.pound')}
                                        </p>
                                        <div
                                            className='flex'
                                        >
                                            <StarRating rating={Number(item.rate)} />
                                        </div>
                                    </div>
                                    {/* select category of product */}
                                    <div
                                        className='w-full'
                                    >
                                        <select

                                            name='price'
                                            className={`rounded-xl focus:border-primary-color focus:ring-primary-color ${i18n.language == 'ar' ? '!pl-10 pr-2' : '!pr-10 pl-2'}`}
                                            style={{
                                                backgroundPosition: `${i18n.language == 'ar' ? 'left' : 'right'}`
                                            }}
                                            defaultValue={item.product_option[0].title}
                                            onChange={(e) => handelOptionPrice(item.id, Number(e.target.value))}
                                        >
                                            {item.product_option.map((option, index) =>
                                                <option
                                                    key={index}
                                                    value={option.id}

                                                >
                                                    {option.title} - ({option.price} {t('home.pound')})
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    {/* wish list and add cart */}
                                    <div
                                        className='flex w-full gap-4 flex-col lg:flex-row'
                                    >
                                        {item.avilable ?
                                            <button
                                                type='button'
                                                disabled={true}
                                                // onClick={() => handelAddToCart(item.id, SelectedOptionId, item.title, item.image, filterOptionPrice?.price ?? 0)}
                                                className='rounded-lg border-[1px] hover:bg-primary-color hover:text-white transition-all duration-300 border-primary-color px-4 py-2'
                                            >
                                                {t('exhibition.add_to_cart')}
                                            </button>
                                            :
                                            getQuantity(item.id, SelectedOptionId) > 0 ?

                                            (
                                                <div
                                                    className='flex justify-between items-center gap-4'
                                                >
                                                    <button
                                                        type='button'

                                                        onClick={() => handelIncressCart(item.id, SelectedOptionId, item.title, item.image, filterOptionPrice?.price ?? 0)}
                                                        className='rounded-lg  bg-primary-color text-white text-center px-4 py-2 '
                                                    >
                                                        +
                                                    </button>

                                                    <span className="font-medium">
                                                        {getQuantity(item.id, SelectedOptionId)}
                                                    </span>

                                                    <button
                                                        type='button'

                                                        onClick={() => handelDecressCart(item.id, SelectedOptionId)}
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

                                                    onClick={() => handelAddToCart(item.id, SelectedOptionId, item.title, item.image, filterOptionPrice?.price ?? 0)}
                                                    className='rounded-lg border-[1px] hover:bg-primary-color hover:text-white transition-all duration-300 border-primary-color px-4 py-2'
                                                >
                                                    {t('exhibition.add_to_cart')}
                                                </button>
                                            )

                                        }

                                        <button
                                            type='button'
                                            onClick={() => handelToggelWishList(item.id, item.title, item.image, SelectedOptionId , item.state , item.slug)}
                                            className='rounded-lg border-[1px] hover:bg-primary-color hover:text-white transition-all duration-300 border-primary-color px-4 py-2 text-lg flex items-center justify-center'
                                        >
                                            <Tooltip title={t('exhibition.wich_list')} >
                                                <span>
                                                <IoIosHeartEmpty />
                                                </span>
                                            </Tooltip>
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </div>
                )}


        </section>
    )
}

export default Exhibition