import { ImageContainer, ProductContainer, ProductDetails } from '../../styles/pages/product'
import { GetStaticPaths, GetStaticProps } from 'next'
import { stripe } from '../../lib/stripe'
import Stripe from 'stripe'
import Image from 'next/future/image'
import Head from 'next/head'
import { useShoppingCart } from "use-shopping-cart"

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    description: string
    defaultPriceId: string
    price: number
    currency: string
  }
}

export default function Product({product}: ProductProps) {
  const { addItem } = useShoppingCart()

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.name}</h1>
          <span>
          {
            new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
              }).format(product.price / 100)
          }
          </span>
          <p>
            {product.description}
          </p>
          <button onClick={() => addItem(product)}>
            Colocar na sacola
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {params: {id: 'prod_S0C6SDYxScDdme'}}
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<any, {id: string}> = async ({params}) => {
  const productId = params.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })
  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        description :product.description,
        defaultPriceId: price.id,
        price: price.unit_amount,
        currency: price.currency,
      }
    },
    revalidate: 60 * 60 * 1 // 1hour
  }
}