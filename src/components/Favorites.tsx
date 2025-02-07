import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Fieldset,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  IconCircleMinus,
  IconHearts,
  IconTableHeart,
} from '@tabler/icons-react'
import { Dog } from '../api/hooks'

const FavoritesLegend = (
  <div className='flex flex-row gap-2 items-center text-lg'>
    Favorites <IconTableHeart size={20} />
  </div>
)

type Props = {
  favorites: Dog[]
  handleRemove: (dog: Dog) => void
  isMatching: boolean
  handleMatch: () => void
}

const Favorites = ({
  favorites,
  handleRemove,
  isMatching,
  handleMatch,
}: Props) => {
  return (
    <Fieldset
      radius='md'
      legend={FavoritesLegend}
      className='flex flex-col gap-4'
    >
      <Accordion className='max-h-[345px] overflow-auto' variant='contained'>
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
                    onClick={() => handleRemove(favorite)}
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
  )
}

export default Favorites
