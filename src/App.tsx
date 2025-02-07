import { Button, TextInput } from '@mantine/core'
import { IconDog } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { login } from './api/hooks'
import Home from './Home'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => setAuthenticated(true),
  })

  const handleSubmit = () => {
    loginMutation.mutate({ name, email })
  }

  return (
    <div className='h-screen w-screen flex'>
      {authenticated ? (
        <Home />
      ) : (
        <div className='flex flex-col gap-4 w-sm m-auto'>
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
          <Button
            loading={loginMutation.isPending}
            onClick={handleSubmit}
            variant='filled'
            color='cyan'
          >
            Login
          </Button>
        </div>
      )}
    </div>
  )
}

export default App
