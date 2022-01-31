import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

const post = {
  slug: 'test-post',
  title: 'Test Post',
  content: '<p>Test post content</p>',
  updatedAt: '25 de abril de 2021',
}

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test post content')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: 'test-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    })

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'Test Post' }],
          content: [{ type: 'paragraph', text: 'Test post content' }],
        },
        last_publication_date: '04-25-2021',
      }),
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'test-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'test-post',
            title: 'Test Post',
            content: '<p>Test post content</p>',
            updatedAt: '25 de abril de 2021',
          },
        },
      })
    )
  })
})
