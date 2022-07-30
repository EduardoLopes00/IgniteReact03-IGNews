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

jest.mock('../../services/prismic')
jest.mock('next-auth/react')

describe('Post page', () => {
  it('render correctly', () => {
    render(<Post key={''} post={post} />)

    expect(screen.getByText('my post')).toBeInTheDocument()
    expect(screen.getByText('post-content')).toBeInTheDocument()
  })

  it('redirects the user in case of unsubscribed', async () => {
    const req = null
    const params = {
      slug: '',
    }

    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any)

    const response = await getServerSideProps({ req, params } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: `/posts/preview/`,
        }),
      }),
    )
  })
})
