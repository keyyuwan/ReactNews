import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages'

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false],
  }
})
jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-priceId', amount: '$7.00' }} />)

    expect(screen.getByText('for $7.00 month')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const stripePricesRetrieveMocked = mocked(stripe.prices.retrieve)

    stripePricesRetrieveMocked.mockResolvedValueOnce({
      id: 'fake-priceId',
      unit_amount: 700,
    } as any)

    const response = await getStaticProps({})

    // Espero que minha resposta seja igual a um objeto que contém pelo menos
    // as propriedades que eu passei
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: { priceId: 'fake-priceId', amount: '$7.00' },
        },
      })
    )
  })
})
