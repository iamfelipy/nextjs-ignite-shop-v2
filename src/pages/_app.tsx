import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"

import { Container } from "../styles/pages/app"

import { CartProvider } from "use-shopping-cart"
import { Header } from "../components/Header"

globalStyles()

export default function App({ Component, pageProps }: AppProps) {


  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      // Connects to our Stripe account (stored in an .env.local file)
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}
      // Redirected here after successful payments (url stored in .env.local file)
      successUrl={`${process.env.NEXT_PUBLIC_URL}/success`}
      // Redirected here when you click back on Stripe Checkout (url stored in .env.local file)
      cancelUrl={`${process.env.NEXT_PUBLIC_URL}/`}
      currency="BRL"
      // Only customers from UK will be able to purchase
      // Having this setting means that we will capture shipping address
      allowedCountries={['BR']}
      // Enables local storage
      shouldPersist={true}
  >
    <Container>
      <Header />
      <Component {...pageProps} />
    </Container>
  </CartProvider>
  )
}

