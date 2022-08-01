import { render, screen } from '@testing-library/react'
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { useSession } from 'next-auth/react'

import { getPrismicClient } from '../../services/prismic'
import { mocked } from 'ts-jest/utils'
import { useRouter } from 'next/router'

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
jest.mock('next/router')

describe('PostPreview page', () => {
  it('render correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      activeSubscription: null,
    } as any)

    render(<PostPreview key={''} post={post} />)

    expect(screen.getByText('my post')).toBeInTheDocument()
    expect(screen.getByText('post-content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects the user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription',
      },
    } as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<PostPreview key={''} post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/slug-mock')
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

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

    const response = await getStaticProps({ req, params } as any)

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
