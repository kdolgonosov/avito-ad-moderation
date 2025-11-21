import BuildIcon from '@mui/icons-material/Build'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import DevicesIcon from '@mui/icons-material/Devices'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import HomeIcon from '@mui/icons-material/Home'
import PetsIcon from '@mui/icons-material/Pets'
import WorkIcon from '@mui/icons-material/Work'

export const CATEGORIES = ['Электроника', 'Недвижимость', 'Транспорт', 'Работа', 'Услуги', 'Животные', 'Мода', 'Детское'] as const
export const CATEGORY_ICONS = [DevicesIcon, HomeIcon, DirectionsCarIcon, WorkIcon, BuildIcon, PetsIcon, CheckroomIcon, ChildFriendlyIcon] as const

export const getCategoryIcon = (id: number) => {
    const Icon = CATEGORY_ICONS[id]
    return Icon ?? DevicesIcon
}
