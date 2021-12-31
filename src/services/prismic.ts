import Prismic from '@prismicio/client'


//According to the oficial Prismic docs, is necessary export a function instead of a const.
export function getPrismicClient(req?: unknown) {
    const prismic = Prismic.client(
        process.env.PRISMIC_ENDPOINT,
        {
            req,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        }
    )

    return prismic
}