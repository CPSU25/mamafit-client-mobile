import { AntDesign, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FlatList, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { useGetAddresses } from '~/features/user/hooks/use-get-addresses'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { Address } from '~/types/address.type'

export default function MyAddressesScreen() {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()
  const { data: addresses, isLoading: isLoadingAddresses, refetch } = useGetAddresses()

  const { refreshControl } = useRefreshs([refetch])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/setting')
    }
  }

  const renderAddressCard = ({ item }: { item: Address }) => (
    <TouchableOpacity>
      <Card className='p-4 gap-1'>
        <Text className='font-inter-medium' numberOfLines={2}>
          {item.street}
        </Text>
        <View className='flex-row items-center gap-1'>
          <Feather name='map-pin' size={14} color={PRIMARY_COLOR.LIGHT} />
          <Text className='text-sm text-muted-foreground' numberOfLines={1}>
            {item.ward}, {item.district}, {item.province}
          </Text>
        </View>
        {item.isDefault && (
          <Badge variant='default' className='mr-auto'>
            <Text className='font-inter-medium'>Default</Text>
          </Badge>
        )}
      </Card>
    </TouchableOpacity>
  )

  if (isLoadingAddresses) return <Loading />

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>My Addresses</Text>
      </View>

      <View className='bg-muted h-2' />

      <FlatList
        data={addresses}
        renderItem={renderAddressCard}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <Button
            variant='outline'
            className='flex-row items-center gap-2'
            onPress={() => router.push('/setting/my-addresses/create')}
          >
            <AntDesign name='pluscircleo' size={14} color={isDarkColorScheme ? 'white' : 'black'} />
            <Text className='native:text-sm font-inter-medium'>Add Address</Text>
          </Button>
        }
        contentContainerClassName='gap-4 p-4'
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      />
    </SafeView>
  )
}
