import { useQuery } from '@tanstack/react-query'

const baseUrl = 'https://frontend-take-home-service.fetch.com'

type LoginParams = {
  name: string
  email: string
}

export const login = async (params: LoginParams) => {
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`)
    }

    return response
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export const useGetBreeds = () => {
  return useQuery({
    queryKey: ['breeds'],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/dogs/breeds`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      return result
    },
  })
}
