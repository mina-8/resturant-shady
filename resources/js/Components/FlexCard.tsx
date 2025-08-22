import { notification, Tooltip } from "antd";
import StarRating from "./StarRating";
import { IoIosHeartEmpty } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addtoCart, getCart, removeFormCart, toggelWishList } from "@/utils/cartUtils";
import { Link } from "@inertiajs/react";

interface ProductOption {
    id: number;
    title: string;
    price: number;
}
interface Products {
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
}

interface props {
    products: Products[];
    page: string;
    category_slug: string;
    subcategory_slug?: string | null;
}

const FlexCard = ({ products, page, category_slug, subcategory_slug = null }: props) => {
    const { t, i18n } = useTranslation();
    type CartItem = {
        productId: number;
        optionId: number;
        image: string;
        title: string;
        price: number;
        quantity: number;
    };

    // filter option price
    const [selectedOptions, setSelectedOptions] = useState<{ [productId: number]: number }>({});
    const [Loading, setLoadin] = useState<boolean>(false);
    // handel selected option price
    const handelOptionPrice = (productId: number, optionId: number) => {
        setSelectedOptions(prev => ({
            ...prev,
            [productId]: optionId
        }))
    }
    const [cartState, setCartState] = useState<CartItem[]>([]);


    const [api, contextHolder] = notification.useNotification();

    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    const getkey = (productId: number, optionId: number) => `${productId}-${optionId}`;

    const refreshCart = async () => {
        const cart = await getCart();
        setCartState(cart);
    }


    useEffect(() => {
        const newQuantities: { [key: string]: number } = {};
        cartState.forEach((item) => {
            const key = getkey(item.productId, item.optionId);
            newQuantities[key] = item.quantity
        })
    }, [cartState])

    useEffect(() => {
        refreshCart();
    }, []);

    const handelAddToCart = (productId: number, optionId: number, title: string, image: string, price: number) => {

        const key = getkey(productId, optionId);
        setQuantities((prev) => ({
            ...prev,
            [key]: (prev[key] || 0) + 1

        }))

        addtoCart(productId, optionId, title, image, price, 1);

        refreshCart();

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

        refreshCart();

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

        }));

        removeFormCart(productId, optionId, 1);

        refreshCart();

        api['success']({
            message: '',
            description: `${t('notify.remove_cart')}`

        })


}

const handelToggelWishList = (productId: number, title: string, image: string, optionId: number , state:string, slug:string) => {
    toggelWishList(productId, title, image, optionId , state , slug);

    api['success']({
        message: '',
        description: `${t('notify.wish_list')}`

    })
}

const getQuantity = useCallback((productId: number, optionId: number) => {
    const key = getkey(productId , optionId);
            return quantities[key] || 0
}, [quantities])


return (
    <>
        {contextHolder}
        {
            products.map((item, index) => {
                // fetch select option
                const SelectedOptionId = selectedOptions[item.id] || item.product_option[0].id;
                const filterOptionPrice = item.product_option.find(opt => opt.id === SelectedOptionId);
                return (
                    <div
                        key={index}
                        className='border-2 p-4 rounded-lg flex  items-center gap-4 relative'
                    >
                        {(item.state == "special" || item.state == "new") && (
                            <div
                                className={`absolute top-4 ${i18n.language == 'ar' ? 'left-0 rounded-s-full' : 'right-0 rounded-s-full'}  bg-primary-color text-white py-1 px-2`}
                            >
                                {item.state == 'special' ? t('exhibition.special') : t('exhibition.new')}
                            </div>
                        )}
                        <Link
                            href={
                                page === 'category' ?
                                    route('product-category', { lang: i18n.language, category: category_slug, product: item.slug })
                                    :
                                    route('product-subcategory', { lang: i18n.language, category: category_slug, subcategory: subcategory_slug, product: item.slug })
                            }
                        >
                            <div>
                                <img src={item.main_image} alt="" className='h-52' />
                            </div>

                        </Link>
                        {/* price and rating */}
                        <div
                            className='flex flex-col justify-between gap-4'
                        >
                            <p
                                className=' font-semibold text-lg hover:text-primary-color'
                            >{item.title}
                            </p>
                            <p
                                className='font-semibold text-lg text-primary-color'
                            >
                                {filterOptionPrice?.price} {t('home.pound')}
                            </p>
                            <div
                                className='flex'
                            >
                                <StarRating rating={item.rate} />
                            </div>
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
                            <div
                                className='flex w-full gap-4 flex-col lg:flex-row'
                            >
                                {item.avilable ?
                                    <button
                                        type='button'
                                        disabled={true}
                                        // onClick={() => handelAddToCart(item.id, SelectedOptionId, item.title, item.main_image, filterOptionPrice?.price ?? 0)}
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
                                                    disabled={Loading}
                                                    onClick={() => handelIncressCart(item.id, SelectedOptionId, item.title, item.main_image, filterOptionPrice?.price ?? 0)}
                                                    className='rounded-lg  bg-primary-color text-white text-center px-4 py-2'
                                                >
                                                    +
                                                </button>

                                                <span className="font-medium">
                                                    {getQuantity(item.id, SelectedOptionId)}
                                                </span>

                                                <button
                                                    type='button'
                                                    disabled={Loading}
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
                                                disabled={Loading}
                                                onClick={() => handelAddToCart(item.id, SelectedOptionId, item.title, item.main_image, filterOptionPrice?.price ?? 0)}
                                                className='rounded-lg border-[1px] hover:bg-primary-color hover:text-white transition-all duration-300 border-primary-color px-4 py-2'
                                            >
                                                {t('exhibition.add_to_cart')}
                                            </button>
                                        )


                                }


                                <button
                                    type='button'
                                    onClick={() => handelToggelWishList(item.id, item.title, item.main_image, SelectedOptionId , item.state, item.slug)}
                                    className='rounded-lg border-[1px] hover:bg-primary-color hover:text-white transition-all duration-300 border-primary-color px-4 py-2 text-lg flex justify-center items-center'
                                >
                                    <Tooltip title={t('exhibition.wich_list')} >
                                        <span>
                                            <IoIosHeartEmpty />
                                        </span>
                                    </Tooltip>
                                </button>
                            </div>
                        </div>
                        {/* select category of product */}
                        {/* <div
                                className='w-full'
                            >

                            </div> */}
                        {/* wish list and add cart */}

                    </div>
                )
            }
            )
        }
    </>
)
}

export default FlexCard