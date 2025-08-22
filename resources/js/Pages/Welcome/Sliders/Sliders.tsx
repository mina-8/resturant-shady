import { Button, Carousel, ConfigProvider } from 'antd'
import React, { useState } from 'react'

import slideone from '../../../../../public/sliders/slide (1).webp'

import { useTranslation } from 'react-i18next'
import { Link } from '@inertiajs/react'

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

import ContentRenderer from '@/Components/ContentRenderer'

interface Slides {
    id: number;
    title: string;
    content: string;
    image: string;
    active_btn:string;
    str_btn: string;
    link: string;
}

interface Props {
    slides: Slides[]
}
export default function Sliders({ slides }: Props) {


    const { t, i18n } = useTranslation();

    const [AcitveIndex, setActiveIndex] = useState(0);

    const HandelActiveIndex = (current: number, next: number) => {
        setActiveIndex(next)
    }


    const CustomArrow = ({ direction, onClick }: any) => {
        const ArrowIcon = direction === 'prev' ? FaArrowLeft : FaArrowRight;
        return (
            <div
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white shadow-lg cursor-pointer transition hover:bg-custom-dark-blue group"
                style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    [direction === 'prev' ? 'left' : 'right']: '10px',
                }}
                onClick={onClick}
            >
                <ArrowIcon className="text-custom-dark-blue group-hover:text-white text-2xl text-yellow-original" />
            </div>
        );
    };

    const images = [
        slideone
    ];

    return (
        <div className='flex justify-center items-center flex-col '>

            <div className='w-full'>
                {slides?.length > 0 && (
                    <ConfigProvider
                        theme={{
                            components: {
                                Carousel: {
                                    dotHeight: 10,
                                    dotWidth: 10,
                                    dotActiveWidth: 10,
                                    dotOffset: 100,

                                },
                            },
                        }}
                    >
                        <Carousel
                            arrows
                            // autoplay
                            infinite
                            className="custom-carousel-dots"
                            beforeChange={HandelActiveIndex}
                            prevArrow={<CustomArrow direction="prev" />}
                            nextArrow={<CustomArrow direction="next" />}
                        >

                            {slides.map((item, index) =>
                                <div key={item.id}
                                    className='relative'
                                >

                                    <div

                                        style={{
                                            // height: '550px',
                                            backgroundImage: `url('${item.image}')`,

                                        }}
                                        className='relative bg-no-repeat lg:bg-contain lg:bg-center bg-contain   w-full lg:h-[550px] h-[400px] flex justify-center items-center'
                                    >
                                        <img src={item.image} alt="" className='h-auto object-contain w-full absolute' />
                                        <div
                                            className={`flex flex-col ${i18n.language === 'ar' ? 'items-end' : 'items-start'} px-24 justify-center gap-2 h-full overflow-hidden`}
                                        >

                                            {/* <div className='absolute w-full h-full bg-black top-0 right-0 opacity-50'></div> */}

                                            <p
                                                className={`pt-20 lg:text-4xl text-white drop-shadow-3xl xs:text-xl
                                                ${AcitveIndex === index ? i18n.language == 'ar' ? 'animate-faderight' : 'animate-fadeleft' : ''}`}
                                            >{item.title}</p>

                                            <div
                                            className={`py-5 text-3xl  font-bold text-black drop-shadow-3xl xs:text-base xs:text-center hidden lg:block
                                             ${AcitveIndex === index ? i18n.language == 'ar' ? 'animate-faderight' : 'animate-fadeleft' : ''}`}
                                                style={{
                                                    animationDuration: "1s",
                                                    animationDelay: "0.75s"
                                                }}
                                            >
                                                <ContentRenderer content={item.content} />
                                            </div>

                                            {
                                                AcitveIndex === index &&

                                                <div className='flex justify-between items-center gap-4 lg:mt-12 lg:flex-col'>
                                                    {item.active_btn && (


                                                    <a
                                                        href={item.link}
                                                        className={`${AcitveIndex === index ? i18n.language == 'ar' ? 'animate-faderight' : 'animate-fadeleft' : ''} bg-primary-color text-white px-4 py-2 rounded-lg hover:bg-black hover:text-white`}
                                                        style={{
                                                            animationDuration: "1s",
                                                            animationDelay: "1.5s"
                                                        }}
                                                    >
                                                        <div className='lg:text-xl'>{item.str_btn}</div>
                                                    </a>
                                                    )}

                                                </div>

                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Carousel>
                    </ConfigProvider>
    )
                }
            </div>

        </div>
    )
}