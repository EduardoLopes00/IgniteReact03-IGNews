//File to handle the integration between Stripe and the Browser

import { loadStripe } from '@stripe/stripe-js'

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

    return stripeJs;
}