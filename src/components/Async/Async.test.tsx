import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { Async } from '.'

it('renders correctly', async () => {
  render(<Async />)

  expect(screen.getByText('Hello World')).toBeInTheDocument()

  // Formas de esperar que o elemento apareça em tela / seja adicionado
  //   expect(await screen.findByText('Button')).toBeInTheDocument()

  //   await waitFor(() => {
  //     expect(screen.queryByText('Button')).toBeInTheDocument()
  //   })

  // Formas de esperar que o elemento não apareça em tela / seja removido
  await waitForElementToBeRemoved(screen.queryByText('Button'))
})
