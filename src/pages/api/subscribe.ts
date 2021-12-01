import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { fauna } from '../../services/fauna'
import { stripe } from '../../services/stripe'

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // como essa API Route é de criação de uma inscrição, vai aceitar apenas POST
  if (req.method === 'POST') {
    const session = await getSession({ req })

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email)))
    )

    let customerId = user.data.stripe_customer_id

    if (!customerId) {
      // stripe cria um customer
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      })

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      )

      customerId = stripeCustomer.id
    }

    // stripe cria uma checkout session pra mim
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, // id do customer no stripe
      payment_method_types: ['card'],
      billing_address_collection: 'required', // endereço do comprador
      line_items: [
        // produtos a serem "comprados"
        { price: 'price_1IsqrFIHGfIIGHzkTyjzVwLe', quantity: 1 },
      ],
      mode: 'subscription', // subscription -> recorrente
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST') // dizendo pro front-end, que só é permitido POST
    res.status(405).end('Method not allowed')
  }
}
