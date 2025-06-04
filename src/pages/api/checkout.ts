import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  // if(req.method !== 'POST') {
    //   return res.status(405).json({ error: 'Method not allowed.'})
    // }
  return res.status(200).json({ error: 'deu tudo certo'})
  
  const  {priceId} = req.body;
  if(!priceId) {
    return res.status(400).json({ error: 'Price not found.'})
  }

  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${process.env.NEXT_URL}/`

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ]
  })  
  return res.status(201).json({
    checkoutUrl: checkoutSession.url,
  })
}