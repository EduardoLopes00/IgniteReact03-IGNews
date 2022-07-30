import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'

import { getSession } from 'next-auth/react'

import { getPrismicClient } from '../../services/prismic'
import { mocked } from 'ts-jest/utils'

const post = {
  slug: 'slug-mock',
  title: 'my post',
  content: '<p>post-content</p>',
  updatedAt: 'july, 30',
}

const req = null
const params = {
  slug: 'my-slug-mocked',
}

jest.mock('../../services/prismic')
jest.mock('next-auth/react')

describe('Post page', () => {
  it('render correctly', () => {
    render(<Post key={''} post={post} />)

    expect(screen.getByText('my post')).toBeInTheDocument()
    expect(screen.getByText('post-content')).toBeInTheDocument()
  })

  it('redirects the user in case of unsubscribed', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any)

    const response = await getServerSideProps({ req, params } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: `/posts/preview/${params.slug}`,
        }),
      }),
    )
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    const getSessionMocked = mocked(getSession)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
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
              text: 'My new post content',
            },
          ],
        },
        last_publication_date: '2022-04-05',
      }),
    } as any)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any)

    const response = await getServerSideProps({ req, params } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: expect.objectContaining({
            slug: 'my-slug-mocked',
            title: 'My new post',
            content: '<p>My new post content</p>',
            updatedAt: '04 de abril de 2022',
          }),
        },
      }),
    )
  })
})
