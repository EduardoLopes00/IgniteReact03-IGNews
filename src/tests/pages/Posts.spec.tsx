import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Posts, { Post, getStaticProps } from '../../pages/posts'

import { getPrismicClient } from '../../services/prismic'

const posts: Post[] = [
  {
    slug: 'slug-mock',
    title: 'my post',
    excerpt: 'excerpt-mock',
    updatedAt: 'july, 30',
  },
]

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('render correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('my post')).toBeInTheDocument()
  })

  it('Loads the posts', async () => {
    const getPrismicClientMock = mocked(getPrismicClient)

    getPrismicClientMock.mockReturnValue({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'test-uid',
            data: {
              title: [
                {
                  type: 'heading',
                  text: 'My new post',
                },
              ],
              content: [
                {
                  type: 'paragraph',
                  text: 'My new post excerpt',
                },
              ],
            },

            last_publication_date: '2022-04-05',
          },
        ],
      }),
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'test-uid',
              title: 'My new post',
              excerpt: 'My new post excerpt',
              updatedAt: '04 de abril de 2022',
            },
          ],
        },
      }),
    )
  })
})
