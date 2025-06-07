
import React, { useState } from "react"
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart"
import { CartContainer, CartFooter, CartHeader, CartItem, CartItemList } from "../styles/components/shopping-cart"
import { X } from "phosphor-react"
import Image from "next/image"
import axios from "axios"

export function ShoppingCart() {
  const { 
    shouldDisplayCart, 
    cartCount, 
    cartDetails, 
    handleCloseCart, 
    totalPrice,
    removeItem,
  } = useShoppingCart()

  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
  
    async function handleBuyProducts() {
      try {
        setIsCreatingCheckoutSession(true)
        const response = await axios.post('/api/checkout', {
          items: Object.values(cartDetails),
        })
  
        const {checkoutUrl} = response.data
  
        window.location.href = checkoutUrl
      } catch (err) {
        // Conectar com um ferramenta de observabilidade (Datadog / Sentry)
        setIsCreatingCheckoutSession(false)
  
        alert('Falha ao redirecionar ao checkout!')
      }
    }

  return (
    <CartContainer isOpen={shouldDisplayCart}>
      <CartHeader>
        <div>
          <button onClick={handleCloseCart}>
            <X  size="1.5rem" weight="bold"  />
          </button>
        </div>
        <h2>Sacola de compras</h2>
      </CartHeader>
      <CartItemList>
          {Object.values(cartDetails ?? {}).map((item) => (
            <CartItem key={item.id}>
              <div>
                <Image src={item.imageUrl} width={102} height={94} alt="" />
              </div>
              <div>
                <strong>{item.name}</strong>
                {
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                    }).format(item.price / 100)
                }
                <button onClick={() => removeItem(item.id)}>Remover</button>
              </div>
            </CartItem>
          ))}
        </CartItemList>
      <CartFooter>
        <div>
            <span>Quantidade</span>
            <strong>{cartCount} itens</strong>
          </div>
          <div>
            <span>Valor total</span>
            <strong>
              {
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalPrice / 100)
              }
              </strong>
          </div>
          <button disabled={isCreatingCheckoutSession || Object.values(cartDetails)?.length <= 0} onClick={handleBuyProducts} >Finalizar compra</button>
      </CartFooter>
    </CartContainer>
  )
}