import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import { SignInButton } from '.'

// Nosso useSession precisa retornar diferentes valores dependendo do teste

jest.mock('next-auth/client')

// O botão tem 2 funcionamentos dependendo de se o usuário está autenticado ou não
// Iremos testar esses 2 casos

describe('SignInButton component', () => {
  it('renders correctly when user is not logged in', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SignInButton />)

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })

  it('renders correctly when user is logged in', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'johndoe@gmail.com',
        },
        expires: 'fake-expires',
      },
      false,
    ])

    render(<SignInButton />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
