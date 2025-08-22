
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

import React, { Suspense } from 'react';
import Sliders from './Welcome/Sliders/Sliders';
import Loading from '@/Components/Loading';
import NewsLetter from '@/Components/NewsLetter';
import Exhibition from './Welcome/Exhibition/Exhibition';



export default function Welcome({
    slides = [],
    products = []
}: PageProps<{  slides?: [] , products?:[]}>) {


    return (
        <>
            <Head title="Home" />

            <Sliders slides={slides} />

            <Exhibition products={products}/>
            {/* <NewsLetter /> */}
        </>
    );
}
