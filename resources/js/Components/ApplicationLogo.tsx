import { ImgHTMLAttributes } from 'react';
import logo from '@/../../public/logo.png';

interface ApplicationLogoProps extends ImgHTMLAttributes<HTMLImageElement> {

  className?: string; // لو عايز تضيف أي كلاس إضافي
}

export default function ApplicationLogo({
  height = 'h-16 md:h-24', // قيمة افتراضية لو ما بعتهاش
  className = '',
  ...props
}: ApplicationLogoProps) {
  return (
    <img
      src={logo}
      alt="resturant"
      className={`bg-cover bg-center rounded-lg  ${className}`}
      {...props}
    />
  );
}
