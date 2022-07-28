import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { mocked } from 'ts-jest/utils'

import { SignInButton } from '.'

jest.mock('next-auth/react')

describe('SignInButton component', () => {
  it('renders correctly when user is authenticaded', () => {
    const useSessionMock = mocked(useSession)

    useSessionMock.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
        },
        expires: '',
      },
      status: 'authenticated',
    })

    render(<SignInButton />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders correctly when user is not authenticaded', () => {
    const useSessionMock = mocked(useSession)

    useSessionMock.mockReturnValueOnce({ data: null, status: 'authenticated' })

    render(<SignInButton />)

    expect(screen.getByText('Sign in with github')).toBeInTheDocument()
  })
})
