import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'
import React from 'react'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    },
  }
})

describe('Activelink component', () => {
  it('renders correctly', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('adds active class if the link page equals to active link', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    )

    expect(screen.getByText('Home')).toHaveClass('active')
  })
})
