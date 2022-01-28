import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismic'
import Posts, { getStaticProps } from '../../pages/posts'

jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'test-post',
    title: 'Test Post',
    excerpt: 'Test post excerpt',
    updatedAt: '25 de abril de 2021',
  },
]

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'test-post',
            data: {
              title: [{ type: 'heading', text: 'Test Post' }],
              content: [{ type: 'paragraph', text: 'Test post excerpt' }],
            },
            last_publication_date: '04-25-2021',
          },
        ],
      }),
    } as any)

    const response = await getStaticProps({})

    // Espero que minha resposta seja igual a um objeto que contém pelo menos
    // as propriedades que eu passei
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'test-post',
              title: 'Test Post',
              excerpt: 'Test post excerpt',
              updatedAt: '25 de abril de 2021',
            },
          ],
        },
      })
    )
  })
})
