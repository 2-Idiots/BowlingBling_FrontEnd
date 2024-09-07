import { IconType } from 'react-icons'

interface CategoryIconProps {
  name: string
  Icon: IconType
}

export default function CategoryIcon({ name, Icon }: CategoryIconProps) {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
        <Icon className="text-2xl text-gray-600 group-hover:text-rose-500" />
      </div>
      <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-rose-500">
        {name}
      </span>
    </div>
  )
}
