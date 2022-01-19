import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { stripe } from '../../services/stripe'
import { saveSubscription } from './_lib/manageSubscription'

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)

    // verificar se o secret que o stripe me manda é o mesmo da minha env var
    // pra validar que quem ta me mandando a req é o Stripe e não outra máquina
    // que pode ter más intenções
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`)
    }

    const eventType = event.type

    if (relevantEvents.has(eventType)) {
      try {
        switch (eventType) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            )

            break
          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            )

            break
          default:
            throw new Error('Unhandled event')
        }
      } catch (err) {
        return res.json({ error: 'Webhook handled failed' })
      }
    }

    res.status(200).json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}