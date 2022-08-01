import { getByText, render, screen, waitFor } from '@testing-library/react'
import { Async } from '.'

it('renders correctly', async () => {
  render(<Async />)

  expect(screen.getByText('Hello World')).toBeInTheDocument()
  expect(await screen.findByText('Button')).toBeInTheDocument()

  waitFor(() => {
    expect(screen.queryByText('My name is P tag!')).toBeInTheDocument()
  })
})
