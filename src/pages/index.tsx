import Image from 'next/future/image'

import {useKeenSlider} from 'keen-slider/react'

import { HomeContainer, Product } from '../styles/pages/home'
import { Handbag } from "phosphor-react"
import { useShoppingCart } from "use-shopping-cart"

import 'keen-slider/keen-slider.min.css'
import { stripe } from '../lib/stripe'
import { GetStaticProps } from 'next'
import Stripe from 'stripe'
import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: number
    currency: string
  }[]
}

export default function Home({products}: HomeProps) {
  const { addItem,  } = useShoppingCart()
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })
  const [quantity, setQuantity] = useState(1);

  const addToCart = (product: HomeProps['products'][number]) => {
    addItem(product, { count: quantity });
    setQuantity(1);
  };

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {
          products.map(product => {
            return (
              <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
                <Product className="keen-slider__slide">
                  <Image src={product.imageUrl} width={520} height={480} alt="" />
                  <footer>
                    <div>
                      <strong>{product.name}</strong>
                      <span>
                        {
                          new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                            }).format(product.price / 100)
                        }
                      </span>
                    </div>
                    <button onClick={(e) => { 
                      e.preventDefault(); 
                      addToCart(product); 
                    }}>
                      <Handbag size="2rem" weight="bold" />
                    </button>
                  </footer>
                </Product>
              </Link>
            )
          })
        }
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })
  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      url: product.url,
      // price: new Intl.NumberFormat('pt-BR', {
      //   style: 'currency',
      //   currency: 'BRL'
      // }).format(price.unit_amount / 100),
      price: price.unit_amount,
      currency: price.currency
    }
  })
  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2, // 2 hours
  }
}