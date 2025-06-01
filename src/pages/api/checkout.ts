import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";

interface BodyRequest {
  items: {
    id: string;
    quantity: number;
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { items } = req.body as BodyRequest;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (items?.length <= 0) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  // Mapear os itens para a estrutura de line_items que a Stripe espera
  const lineItems = await Promise.all(
    items.map(async (item) => {
      // Busca o produto com base no ID fornecido
      const product = await stripe.products.retrieve(item.id, {
        expand: ['default_price']
      });

      // Assumindo que você tem a estrutura correta para acessar o priceId
      const price = product.default_price as Stripe.Price;

      return {
        price: price.id, // Aqui é o priceId, necessário para o checkout
        quantity: item.quantity,
      };
    })
  );

  const successUrl = `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_URL}/`;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: lineItems, // Usando o array mapeado de items
    });

    return res.status(201).json({
      checkoutUrl: checkoutSession.url,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error creating checkout session' });
  }
}
