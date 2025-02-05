import { Button, TextInput } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { IconDog } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { login } from './api/hooks'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [auth, setAuth] = useLocalStorage('auth', null)

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => setAuth(res),
  })

  const handleSubmit = () => {
    loginMutation.mutate({ name, email })
  }

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      {auth ? (
        'You are logged in'
      ) : (
        <div className='flex flex-col gap-8 w-sm'>
          <IconDog size={80} className='mx-auto' />
          <TextInput
            label='Name'
            placeholder='Your Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label='Email'
            placeholder='Your Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSubmit} variant='filled' color='cyan'>
            Login
          </Button>
        </div>
      )}
    </div>
  )
}

export default App
