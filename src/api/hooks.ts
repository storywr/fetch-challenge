const baseUrl = 'https://frontend-take-home-service.fetch.com'

type LoginParams = {
  name: string
  email: string
}

export const login = async (params: LoginParams) => {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
  if (!response.ok) {
    throw new Error('Something went wrong. Login failed.')
  }
  const data = await response.json()
  return data
}
