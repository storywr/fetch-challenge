import { Fieldset, Pagination } from '@mantine/core'
import { IconDogBowl } from '@tabler/icons-react'
import { Dog } from '../api/hooks'
import DogCard from '../components/DogCard'

const ResultsLegend = (
  <div className='flex flex-row gap-2 items-center text-lg'>
    Results <IconDogBowl size={20} />
  </div>
)

type Props = {
  paginatedDogs: Dog[] | undefined
  isSelected: (dog: Dog) => boolean
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  pages: number
  handleSelectDog: (dog: Dog) => void
}

const DogList = ({
  paginatedDogs,
  isSelected,
  currentPage,
  setCurrentPage,
  pages,
  handleSelectDog,
}: Props) => {
  return (
    <Fieldset
      legend={ResultsLegend}
      radius='md'
      className='flex flex-col gap-3 h-full'
    >
      <div className='grid grid-cols-3 gap-4 h-full'>
        {paginatedDogs?.map((dog) => (
          <DogCard
            isSelected={isSelected(dog)}
            key={dog.id}
            dog={dog}
            handleSelect={handleSelectDog}
          />
        ))}
      </div>
      <Pagination
        className='w-full items-center justify-center flex'
        value={currentPage}
        onChange={(newPage) => setCurrentPage(newPage)}
        total={pages}
      />
    </Fieldset>
  )
}

export default DogList
