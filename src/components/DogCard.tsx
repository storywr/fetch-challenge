import {
  ActionIcon,
  BackgroundImage,
  Badge,
  Card,
  CardSection,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'
import { Dog } from '../api/hooks'

type Props = {
  dog: Dog
  handleSelect?: (dog: Dog) => void
  isSelected?: boolean
}

const DogCard = ({ dog, handleSelect, isSelected = false }: Props) => {
  const tooltipTitle = isSelected ? 'Remove Favorite' : 'Favorite'
  return (
    <div>
      <Card className='w-[280px]' shadow='sm' radius='md' withBorder>
        <CardSection>
          <BackgroundImage w={280} h={280} src={dog.img}>
            {handleSelect && (
              <Tooltip title={tooltipTitle} label={tooltipTitle}>
                <ActionIcon
                  color={isSelected ? 'red' : 'blue'}
                  className='absolute top-[10px] left-[235px] z-50'
                  onClick={handleSelect ? () => handleSelect(dog) : () => null}
                  radius='md'
                  size='lg'
                >
                  <IconHeart size={20} />
                </ActionIcon>
              </Tooltip>
            )}
          </BackgroundImage>
        </CardSection>
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
  )
}

export default DogCard
