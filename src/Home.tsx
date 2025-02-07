import { useLocalStorage } from '@mantine/hooks'
import { useCallback, useMemo, useState } from 'react'
import {
  Dog,
  useGetBreeds,
  useGetDogs,
  useGetMatch,
  useGetMatchId,
  useSearch,
} from './api/hooks'
import DogList from './components/DogList'
import Favorites from './components/Favorites'
import Filters from './components/Filters'
import MatchModal from './components/MatchModal'

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
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [matchModalProps, setMatchModalProps] = useState<ModalProps | null>(
    null
  )
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    refetch,
  } = useSearch({
    breeds: selectedBreeds,
    zipCodes: zipGroup,
    ageMin,
    ageMax,
    sort,
    order: direction,
  })
  const { data: dogs, isLoading: isLoadingDogs } = useGetDogs(searchResults)
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
  const isSearching = isLoadingSearch || isLoadingDogs

  return (
    <div className='flex flex-row w-full justify-between p-8 overflow-auto'>
      {matchModalProps && (
        <MatchModal
          match={matchModalProps.dog}
          handleClose={() => setMatchModalProps(null)}
        />
      )}
      <div className='flex flex-col gap-4'>
        <Filters
          breeds={breeds}
          selectedBreeds={selectedBreeds}
          setSelectedBreeds={setSelectedBreeds}
          zip={zip}
          handleChangeZip={handleChangeZip}
          handleAddZip={handleAddZip}
          zipGroup={zipGroup}
          handleRemoveZip={handleRemoveZip}
          sort={sort}
          ageMin={ageMin}
          ageMax={ageMax}
          direction={direction}
          setMin={setMin}
          setMax={setMax}
          setSort={setSort}
          setDirection={setDirection}
          isSearching={isSearching}
          handleSearch={() => {
            setCurrentPage(1)
            refetch()
          }}
        />
        {(favorites?.length ?? 0) > 0 && (
          <Favorites
            favorites={favorites}
            isMatching={isMatching}
            handleMatch={handleMatch}
            handleRemove={handleSelectDog}
          />
        )}
      </div>
      {(dogs?.length ?? 0) > 0 && (
        <DogList
          paginatedDogs={paginatedDogs}
          isSelected={isSelected}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pages={pages}
          handleSelectDog={handleSelectDog}
        />
      )}
    </div>
  )
}

export default Home
