import { Handbag } from "@phosphor-icons/react"
import { ShoppingCart } from "./ShoppingCart"
import logoImg from '../assets/logo.svg'
import Image from 'next/future/image'
import { useShoppingCart } from "use-shopping-cart"
import { Container, CartButtonContainer, CartCountBadge } from '../styles/components/header'

export function Header() {
  const { handleCartClick, cartCount } = useShoppingCart();
  
  return (
    <Container>
      <Image src={logoImg} width="130" height="52" alt="Logo" />
      <CartButtonContainer disabled={!cartCount} onClick={handleCartClick}>
        <Handbag size="1.5rem" weight="bold" />
        {cartCount > 0 && <CartCountBadge>{cartCount}</CartCountBadge>} {/* Exibe o número de itens */}
      </CartButtonContainer>
      <ShoppingCart />
    </Container>
  )
}
