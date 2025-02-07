import {
  ActionIcon,
  Button,
  Fieldset,
  InputBase,
  MultiSelect,
  NumberInput,
  Pill,
  PillGroup,
  Select,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { IconBone, IconCirclePlus, IconPaw } from '@tabler/icons-react'

const Legend = (
  <div className='flex flex-row gap-2 items-center text-lg'>
    Dog Filters <IconBone size={20} />
  </div>
)

type Order = 'asc' | 'desc'
type Sort = 'breed' | 'age' | 'name'

type Props = {
  breeds: string[]
  selectedBreeds: string[]
  setSelectedBreeds: React.Dispatch<React.SetStateAction<string[] | []>>
  zip: string
  handleChangeZip: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAddZip: () => void
  zipGroup: string[] | undefined
  handleRemoveZip: (zip: string) => void
  sort: string
  ageMin: string | number
  ageMax: string | number
  direction: 'asc' | 'desc'
  setMin: React.Dispatch<React.SetStateAction<string | number>>
  setMax: React.Dispatch<React.SetStateAction<string | number>>
  setSort: React.Dispatch<React.SetStateAction<string>>
  setDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>
  isSearching: boolean
  handleSearch: () => void
}

const Filters = ({
  breeds,
  selectedBreeds,
  setSelectedBreeds,
  zip,
  handleChangeZip,
  handleAddZip,
  zipGroup,
  handleRemoveZip,
  sort,
  ageMin,
  ageMax,
  direction,
  setMin,
  setMax,
  setSort,
  setDirection,
  isSearching,
  handleSearch,
}: Props) => {
  return (
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
            {zipGroup?.map((selectedZip) => (
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
          onChange={(value) => setSort(value as Sort)}
          label='Sort By'
        />
        <Select
          className='w-full'
          data={['asc', 'desc']}
          value={direction}
          onChange={(value) => setDirection(value as Order)}
          label='Sort Order'
        />
      </div>
      <Button
        loading={isSearching}
        disabled={isSearching}
        onClick={handleSearch}
        rightSection={<IconPaw size={20} />}
      >
        Search
      </Button>
    </Fieldset>
  )
}

export default Filters
