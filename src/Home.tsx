import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Fieldset,
  InputBase,
  Modal,
  MultiSelect,
  NumberInput,
  Pagination,
  Pill,
  PillGroup,
  Select,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import {
  IconBone,
  IconCircleMinus,
  IconCirclePlus,
  IconDogBowl,
  IconHeart,
  IconHearts,
  IconPaw,
} from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'
import {
  Dog,
  useGetBreeds,
  useGetDogs,
  useGetMatch,
  useGetMatchId,
  useSearch,
} from './api/hooks'
import DogCard from './components/DogCard'

const Legend = (
  <div className='flex flex-row gap-2 items-center text-lg'>
    Dog Filters <IconBone size={20} />
  </div>
)

const ResultsLegend = (
  <div className='flex flex-row gap-2 items-center text-lg'>
    Results <IconDogBowl size={20} />
  </div>
)

const FavoritesLegend = (
  <div className='flex flex-row gap-2 items-center text-lg'>
    Favorites <IconHeart size={20} />
  </div>
)

type Order = 'asc' | 'desc'
type Sort = 'breed' | 'age' | 'name'
type ModalProps = {
  dog: Dog
}

const Home = () => {
  const { data: breeds } = useGetBreeds()
  const [selectedBreeds, setSelectedBreeds] = useState<string[] | []>([])
  const [zip, setZip] = useState('')
  const [ageMin, setMin] = useState<string | number>('1')
  const [ageMax, setMax] = useState<string | number>('14')
  const [zipGroup, setZipGroup] = useState<string[] | []>([])
  const [sort, setSort] = useState('breed')
  const [direction, SetDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [matchModalProps, setMatchModalProps] = useState<ModalProps | null>(
    null
  )
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
  const [favorites, setFavorites] = useLocalStorage<Dog[]>({
    key: 'favorites',
    defaultValue: [],
  })
  const favoritesIds = useMemo(
    () => favorites.map((favorite) => favorite.id),
    [favorites]
  )
  const matchIdMutation = useGetMatchId()
  const matchMutation = useGetMatch()

  const handleSelectDog = (dog: Dog) => {
    if (favorites.includes(dog)) {
      setFavorites((prev) => prev.filter((favorite) => favorite !== dog))
    } else {
      setFavorites((prev) => [...prev, dog])
    }
  }

  const handleChangeZip = (e: React.ChangeEvent<HTMLInputElement>) =>
    setZip(e.target.value)

  const handleAddZip = () => {
    setZipGroup((prev) => [...prev, zip])
    setZip('')
  }

  const handleRemoveZip = (zip: string) => {
    setZipGroup((prev) => prev.filter((selectedZip) => selectedZip !== zip))
  }

  const isSelected = useCallback(
    (dog: Dog) => {
      const favoriteIds = favorites.map((favorite) => favorite.id)
      return favoriteIds.includes(dog.id)
    },
    [favorites]
  )

  const pages = useMemo(() => Math.ceil((dogs?.length ?? 0) / 6), [dogs])
  const paginatedDogs = useMemo(
    () => dogs?.slice((currentPage - 1) * 6, (currentPage - 1) * 6 + 6),
    [dogs, currentPage]
  )

  const handleMatch = () => {
    matchIdMutation.mutate(favoritesIds, {
      onSuccess: (matchId) =>
        matchMutation.mutate([matchId], {
          onSuccess: (match) => setMatchModalProps({ dog: match }),
        }),
    })
  }
  const isMatching = matchIdMutation.isPending || matchMutation.isPending

  return (
    <div className='flex flex-row w-full justify-between p-8 overflow-auto'>
      {matchModalProps && (
        <Modal
          size='sm'
          opened={true}
          onClose={() => setMatchModalProps(null)}
          title={<div className='text-2xl font-bold'>Your Match</div>}
        >
          <div className='flex h-full w-full items-center justify-center'>
            <DogCard dog={matchModalProps.dog} />
          </div>
        </Modal>
      )}
      <div className='flex flex-col gap-4'>
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
              onChange={(value) => setSort(value as Sort)}
              label='Sort By'
            />
            <Select
              className='w-full'
              data={['asc', 'desc']}
              value={direction}
              onChange={(value) => SetDirection(value as Order)}
              label='Sort Order'
            />
          </div>
          <Button
            disabled={isLoading}
            onClick={() => {
              setCurrentPage(1)
              refetch()
            }}
            rightSection={<IconPaw size={20} />}
          >
            Search
          </Button>
        </Fieldset>
        {(favorites?.length ?? 0) > 0 && (
          <Fieldset
            radius='md'
            legend={FavoritesLegend}
            className='flex flex-col gap-4'
          >
            <Accordion variant='contained'>
              {favorites?.map((favorite) => (
                <Accordion.Item key={favorite.id} value={favorite.id}>
                  <Accordion.Control icon={<Avatar src={favorite.img} />}>
                    <div className='w-full flex flex-row justify-between items-center'>
                      <div>{favorite.name}</div>
                      <Badge className='mr-4'>{favorite.breed}</Badge>
                    </div>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <div className='flex flex-row gap-1 items-center pt-3'>
                      <Title order={4}>{favorite.name}</Title>
                      <Tooltip title='Remove' label='Remove'>
                        <ActionIcon
                          variant='subtle'
                          onClick={() => handleSelectDog(favorite)}
                        >
                          <IconCircleMinus />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <div>{favorite.zip_code}</div>|
                      <div>{favorite.age} Years Old</div>
                    </div>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
            <Tooltip
              title='At least 2 favorites are needed for Matchmaking'
              label='At least 2 favorites are needed for Matchmaking'
              hidden={favorites.length > 1}
            >
              <Button
                loading={isMatching}
                disabled={favorites.length < 2 || isMatching}
                color='red'
                rightSection={<IconHearts />}
                onClick={handleMatch}
              >
                Get Match!
              </Button>
            </Tooltip>
          </Fieldset>
        )}
      </div>
      {(dogs?.length ?? 0) > 0 && (
        <Fieldset
          legend={ResultsLegend}
          radius='md'
          className='flex flex-col gap-3 h-full'
        >
          <div className='grid grid-cols-3 gap-2 h-full'>
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
      )}
    </div>
  )
}

export default Home
