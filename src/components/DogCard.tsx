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
  handleSelect: (dog: Dog) => void
  isSelected: boolean
}

const DogCard = ({ dog, handleSelect, isSelected }: Props) => {
  const tooltipTitle = isSelected ? 'Remove Favorite' : 'Favorite'
  return (
    <div>
      <Card className='w-[300px]' shadow='sm' radius='md' withBorder>
        <CardSection>
          <BackgroundImage w={300} h={300} src={dog.img}>
            <Tooltip title={tooltipTitle} label={tooltipTitle}>
              <ActionIcon
                color={isSelected ? 'red' : 'blue'}
                className='absolute top-[10px] left-[255px] z-50'
                onClick={() => handleSelect(dog)}
                radius='md'
                size='lg'
              >
                <IconHeart size={20} />
              </ActionIcon>
            </Tooltip>
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
