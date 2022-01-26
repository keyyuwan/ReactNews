import { render, screen, fireEvent } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import { SubscribeButton } from '.'

jest.mock('next-auth/client')

jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    // espero que a função de sign in seja chamada
    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user has a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)

    const pushMock = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'johndoe@gmail.com',
        },
        expires: 'fake-expires',
        activeSubscription: 'fake-subscription',
      },
      false,
    ])

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    // espero que a função push do useRouter tenha sido chamada com o argumento '/posts'
    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})
