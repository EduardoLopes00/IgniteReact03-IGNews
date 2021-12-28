import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { fauna } from '../../services/fauna';
import { query as q } from 'faunadb'
import { stripe } from '../../services/stripe'

type User = {
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        
        //Get the informations of the session through the token stored on the cookie. By passing only the 'req' as param, the method can find the token in its header.
        const session = await getSession({req})

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id

        if (!customerId) {

            //Make the request to stripe to create a new customer
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                // metadata: 
            })

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId, //The ID will be generated through the create method on Stripe
            payment_method_types: ['card'],
            billing_address_collection: 'required', //Define wheter the address will be necessary
            line_items: [
                {  price: 'price_1KBKtHHo6AJ2XxTtcVXXOwgI', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true, //Define wheter be possible to the user use descount cupoms or similar
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else {
        res.setHeader('Allow', 'POST') //I'm returning the response that says that the only method avaiable is POST
        res.status(405).end('Method not allowed') //Returning error message 405
    }
}