import { useQuery, UseQueryResult } from '@tanstack/react-query'

const baseUrl = 'https://frontend-take-home-service.fetch.com'

type LoginParams = {
  name: string
  email: string
}

export const login = async (params: LoginParams) => {
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

export type Dog = {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

export const useGetDogs = (body: string[]): UseQueryResult<Dog[]> => {
  return useQuery({
    enabled: body?.length > 0,
    queryKey: ['dogs', body],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/dogs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const result = await response.json()
      return result
    },
  })
}

type SearchParams = {
  breeds: string[]
  zipCodes: string[]
  ageMin: string | number
  ageMax: string | number
  sort: string
  order: 'asc' | 'desc'
}

const createQueryString = (queryKey: string, queryValue: string[]) => {
  if (queryValue.length === 0) return ''
  let queryString = `&${queryKey}=`
  queryValue.forEach((item, idx) => {
    if (idx === 0) {
      queryString = queryString + item
    } else {
      queryString = queryString + `&${queryKey}=${item}`
    }
  })
  return queryString
}

export const useSearch = (params: SearchParams) => {
  return useQuery({
    enabled: false,
    queryKey: ['search'],
    queryFn: async () => {
      const { breeds, zipCodes, ageMin, ageMax, sort, order } = params
      const breedsString = createQueryString('breeds', breeds)
      const zipsString = createQueryString('zipCodes', zipCodes)
      const sortParam = `sort=${sort}:${order}`

      const response = await fetch(
        `${baseUrl}/dogs/search?${sortParam}&ageMin=${ageMin}&ageMax=${ageMax}${breedsString}${zipsString}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const result = await response.json()
      return result?.resultIds ?? []
    },
  })
}
