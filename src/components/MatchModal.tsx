import { Modal } from '@mantine/core'
import { Dog } from '../api/hooks'
import DogCard from './DogCard'

type Props = {
  match: Dog
  handleClose: () => void
}

const MatchModal = ({ match, handleClose }: Props) => {
  return (
    <Modal
      size='sm'
      opened={true}
      onClose={handleClose}
      title={<div className='text-2xl font-bold'>Your Match</div>}
    >
      <div className='flex h-full w-full items-center justify-center'>
        <DogCard dog={match} />
      </div>
    </Modal>
  )
}

export default MatchModal
