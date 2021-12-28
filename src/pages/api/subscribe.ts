import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { stripe } from '../../services/stripe'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        
        //Get the informations of the session through the token stored on the cookie. By passing only the 'req' as param, the method can find the token in its header.
        const session = await getSession({req})

        //Make the request to stripe to create a new customer
        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
            // metadata: 
        })


        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id, //The ID will be generated through the create method on Stripe
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