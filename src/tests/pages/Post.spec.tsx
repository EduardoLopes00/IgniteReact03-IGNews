import { render, screen } from '@testing-library/react'
import { Post as PostType } from '../../pages/posts'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'

import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'slug-mock',
  title: 'my post',
  content: '<p>post-content</p>',
  updatedAt: 'july, 30',
}

jest.mock('../../services/prismic')

describe('Post page', () => {
  it('render correctly', () => {
    render(<Post key={''} post={post} />)

    expect(screen.getByText('my post')).toBeInTheDocument()
    expect(screen.getByText('post-content')).toBeInTheDocument()
  })
})
