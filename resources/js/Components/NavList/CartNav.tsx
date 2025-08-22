import { User } from '@/types';
import { getCart, mergeCartIfUserLogin, removeCompletlyCart } from '@/utils/cartUtils';
import { Link } from '@inertiajs/react';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose } from 'react-icons/io5';

type CartItem = {
  productId: number;
  optionId: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
};

const CartNav = ({ user }: { user: User }) => {
  const { t, i18n } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCartItems = async () => {
    const cart = await getCart();
    setCartItems(cart);
  };

  useEffect(() => {
    const initCart = async () => {
      if (user) {
        await mergeCartIfUserLogin();
      }
      await fetchCartItems();
    };

    initCart();
  }, [user]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleRemoveFromCart = useCallback((productId: number, optionId: number) => {
    removeCompletlyCart(productId, optionId);
    setCartItems(prev => prev.filter(item => !(item.productId === productId && item.optionId === optionId)));
  }, []);

  if (totalQuantity === 0) {
    return (
      <div className="px-4 w-full flex justify-center items-center text-center">
        {t('navbarlist.cartnav.no_product')}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-2">
      {cartItems.map((item, index) => (
        <div key={index} className="border-b-[1px] pb-2">
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <div className="border-[1px] rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-14 w-14 object-cover rounded-md"
                  onError={(e) => ((e.target as HTMLImageElement).src = '/fallback.png')}
                />
              </div>
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="flex items-center gap-1 text-sm">
                  <span>{item.price} {t('home.pound')}</span>
                  <IoClose />
                  <span>{item.quantity}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveFromCart(item.productId, item.optionId)}
              className="text-red-500 hover:text-red-700"
            >
              <IoClose />
            </button>
          </div>
        </div>
      ))}

      <table className="w-full text-sm border">
        <tbody>
          <tr>
            <td className="border p-1">{t('navbarlist.cartnav.sub_total')}</td>
            <td className="border p-1">{totalPrice.toFixed(2)} {t('home.pound')}</td>
          </tr>
          <tr>
            <td className="border p-1 font-bold">{t('navbarlist.cartnav.total')}</td>
            <td className="border p-1 font-bold">{totalPrice.toFixed(2)} {t('home.pound')}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-center items-center gap-4">
        <Link
          href={route('my-cart', { lang: i18n.language })}
          className="bg-primary-color rounded-lg px-4 py-2 text-white"
        >
          {t('navbarlist.cartnav.view_cart')}
        </Link>
        <Link
          href={route('check-out', { lang: i18n.language })}
          className="bg-primary-color rounded-lg px-4 py-2 text-white"
        >
          {t('navbarlist.cartnav.check_out')}
        </Link>
      </div>
    </div>
  );
};

export default CartNav;
