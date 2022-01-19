import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    },
  }
})

describe('Active Link component', () => {
  it('renders correctly', () => {
    const { debug } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )

    debug() // gera html virtual no terminal que esse componente gera

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('adds active class if the link is currently active', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )

    expect(screen.getByText('Home')).toHaveClass('active')
  })
})
