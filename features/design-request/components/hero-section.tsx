import { useRouter } from 'expo-router'
import { Image, TouchableOpacity } from 'react-native'
import { getShadowStyles, styles } from '~/lib/constants/constants'

export default function HeroSection() {
  const router = useRouter()

  return (
    <TouchableOpacity
      onPress={() => router.push('/design-request/create')}
      className='rounded-2xl overflow-hidden border border-sky-800'
      style={[styles.container, getShadowStyles('#000080')]}
    >
      <Image source={require('~/assets/images/hero-section.jpg')} className='w-full h-[156px] rounded-xl' />
    </TouchableOpacity>
  )
}
