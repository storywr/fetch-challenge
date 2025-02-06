import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Fieldset,
  Image,
  InputBase,
  MultiSelect,
  NumberInput,
  Pill,
  PillGroup,
  Select,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconBone, IconCirclePlus, IconPaw } from '@tabler/icons-react'
import { useState } from 'react'
import { useGetBreeds, useGetDogs, useSearch } from './api/hooks'

const Legend = (
  <div className='flex flex-row gap-2 items-center'>
    Dog Filters <IconBone size={20} />
  </div>
)

const Home = () => {
  const { data: breeds } = useGetBreeds()
  const [selectedBreeds, setSelectedBreeds] = useState([])
  const [zip, setZip] = useState('')
  const [ageMin, setMin] = useState('1')
  const [ageMax, setMax] = useState('14')
  const [zipGroup, setZipGroup] = useState<string[] | []>([])
  const [sort, setSort] = useState('breed')
  const [direction, SetDirection] = useState<'asc' | 'desc'>('asc')
  const {
    data: searchResults,
    isLoading,
    refetch,
  } = useSearch({
    breeds: selectedBreeds,
    zipCodes: zipGroup,
    ageMin,
    ageMax,
    sort,
    order: direction,
  })
  const { data: dogs } = useGetDogs(searchResults)

  const handleChangeZip = (e: React.ChangeEvent<HTMLInputElement>) =>
    setZip(e.target.value)

  const handleAddZip = () => {
    setZipGroup((prev) => [...prev, zip])
    setZip('')
  }

  const handleRemoveZip = (zip: string) => {
    setZipGroup((prev) => prev.filter((selectedZip) => selectedZip !== zip))
  }

  return (
    <div className='flex flex-row w-full justify-between p-8 overflow-auto'>
      <Fieldset
        legend={Legend}
        radius='md'
        className='flex flex-col gap-4 h-fit w-[500px]'
      >
        <MultiSelect
          label='Breeds'
          placeholder='Select Breeds'
          data={breeds}
          value={selectedBreeds}
          onChange={(value) => setSelectedBreeds(value)}
          searchable
        />
        <div className='flex flex-row gap-4'>
          <TextInput
            className='w-full'
            label='Add Zip'
            value={zip}
            onChange={handleChangeZip}
            rightSection={
              <Tooltip label='Add Zip' title='Add Zip'>
                <ActionIcon
                  disabled={zip.length < 5}
                  color='cyan'
                  onClick={handleAddZip}
                >
                  <IconCirclePlus />
                </ActionIcon>
              </Tooltip>
            }
          />
          <InputBase
            component='div'
            multiline
            label='Zip Codes'
            className='w-full'
          >
            <PillGroup>
              {zipGroup.map((selectedZip) => (
                <Pill
                  key={selectedZip}
                  onRemove={() => handleRemoveZip(selectedZip)}
                  withRemoveButton
                >
                  {selectedZip}
                </Pill>
              ))}
            </PillGroup>
          </InputBase>
        </div>
        <div className='flex flex-row gap-4'>
          <NumberInput
            className='w-full'
            label='Min Age'
            placeholder='Min Age'
            onChange={(value) => setMin(value)}
            value={ageMin}
          />
          <NumberInput
            className='w-full'
            label='Max Age'
            placeholder='Max Age'
            onChange={(value) => setMax(value)}
            value={ageMax}
          />
        </div>
        <div className='flex flex-row gap-4'>
          <Select
            className='w-full'
            data={['breed', 'name', 'age']}
            value={sort}
            onChange={(value) => setSort(value as string)}
            label='Sort By'
          />
          <Select
            className='w-full'
            data={['asc', 'desc']}
            value={direction}
            onChange={(value) => SetDirection(value)}
            label='Sort Order'
          />
        </div>
        <Button
          disabled={isLoading}
          onClick={() => refetch()}
          rightSection={<IconPaw size={20} />}
        >
          Search
        </Button>
      </Fieldset>
      {dogs?.length > 0 && (
        <div>
          <div className='grid grid-cols-3 gap-6 pb-8'>
            {dogs?.map((dog) => (
              <div key={dog.id}>
                <Card
                  className='h-full'
                  shadow='sm'
                  padding='md'
                  radius='md'
                  withBorder
                >
                  <Card.Section>
                    <Image w={300} h={300} src={dog.img} alt='Norway' />
                  </Card.Section>
                  <div className='flex flex-row justify-between items-center pt-3'>
                    <Title order={3} className='text-cyan-500'>
                      {dog.name}
                    </Title>
                    <Badge>{dog.breed}</Badge>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <div>{dog.zip_code}</div>|<div>{dog.age} Years Old</div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
