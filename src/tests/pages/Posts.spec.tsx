import { render, screen } from '@testing-library/react'

import Posts, { Post } from '../../pages/posts'

const posts: Post[] = [
  {
    slug: 'slug-mock',
    title: 'my post',
    excerpt: 'excerpt-mock',
    updatedAt: 'july, 30',
  },
]

jest.mock('../../services/stripe')

describe('Posts page', () => {
  it('render correctly', () => {
    const { debug } = render(<Posts posts={posts} />)

    debug()

    expect(screen.getByText('my post')).toBeInTheDocument()
  })

  //   it('loads initial data', async () => {
  //     const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)

  //     retrieveStripePricesMocked.mockResolvedValueOnce({
  //       id: 'fake-price-id',
  //       unit_amount: 1000,
  //     } as any)

  //     const response = await getStaticProps({})

  //     expect(response).toEqual(
  //       expect.objectContaining({
  //         props: {
  //           product: {
  //             priceId: 'fake-price-id',
  //             amount: '$10.00',
  //           },
  //         },
  //       }),
  //     )
  //   })
})
