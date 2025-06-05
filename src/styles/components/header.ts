import { styled } from "..";

export const Container = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '2rem 0',
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
})

export const CartButtonContainer = styled('button', {
  position: 'relative', // Necessário para posicionar o contador de itens
  width: '3rem',
  height: '3rem',
  borderRadius: '6px',
  border: 'none',
  color: '$gray600',
  backgroundColor: '$gray800',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '&:not(:disabled):hover': {
    backgroundColor: '$gray700',
  },

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
})

export const CartCountBadge = styled('span', {
  position: 'absolute',
  top: '-10px',
  right: '-10px',
  backgroundColor: '$green500',
  color: '#fff',
  border: '2px solid $gray900',
  borderRadius: '50%',
  width: '1.5rem',
  height: '1.5rem',
  fontSize: '12px',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'content-box'
})
