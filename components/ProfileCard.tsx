import Image from 'next/image'

interface ProfileCardProps {
  name: string
  description: string
  imageUrl: string
  association: string
  center: string
}

export default function ProfileCard({
  name,
  description,
  imageUrl,
  association,
  center,
}: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {name} <span className="text-rose-500">{description}</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">{association}</p>
        <p className="text-sm text-gray-600">{center}</p>
      </div>
    </div>
  )
}
