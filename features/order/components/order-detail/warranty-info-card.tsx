import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Text } from '~/components/ui/text'
import { styles } from '~/lib/constants/constants'
import { WarrantyRequest } from '~/types/order.type'

interface WarrantyInfoCardProps {
  warrantyRequest: WarrantyRequest
}

export default function WarrantyInfoCard({ warrantyRequest }: WarrantyInfoCardProps) {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Card className='bg-muted/5 p-0' style={styles.container}>
      <View className='flex-row items-center gap-2 px-3 py-2'>
        <MaterialCommunityIcons name='shield' size={16} color='#db2777' />
        <Text className='font-inter-medium text-sm'>Warranty Information</Text>
      </View>

      <View className='gap-2'>
        <View className='gap-1 px-3'>
          <View className='flex-row items-center gap-2'>
            <Text className='flex-1 text-xs text-muted-foreground/80'>Order Number</Text>
            <Text className='text-foreground/80 text-xs'>#{warrantyRequest?.orderCode}</Text>
          </View>

          <View className='flex-row items-center gap-2'>
            <Text className='flex-1 text-xs text-muted-foreground/80'>Warranty Status</Text>
            <Text className='text-foreground/80 text-xs'>{warrantyRequest?.status}</Text>
          </View>

          <View className='flex-row items-center gap-2'>
            <Text className='flex-1 text-xs text-muted-foreground/80'>Warranty Submitted At</Text>
            <Text className='text-foreground/80 text-xs'>
              {warrantyRequest?.createdAt
                ? format(new Date(warrantyRequest.createdAt), "MMM dd, yyyy 'at' hh:mm a")
                : 'N/A'}
            </Text>
          </View>
        </View>

        <View className='border-b border-dashed border-muted-foreground/30 my-1' />

        <View className='flex-row items-center gap-3 px-3 pb-3'>
          <View className='flex-1'>
            <TouchableOpacity
              className='w-full px-4 py-2 rounded-xl flex-row items-center justify-center gap-3 border border-border'
              onPress={() =>
                router.push({ pathname: '/order/[orderId]', params: { orderId: warrantyRequest.orderId } })
              }
            >
              <Feather name='link' size={16} color='black' />
              <Text className='text-sm font-inter-medium'>Go To Order</Text>
            </TouchableOpacity>
          </View>

          <View className='flex-1'>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <TouchableOpacity className='w-full px-4 py-2 rounded-xl flex-row items-center justify-center gap-3 bg-pink-50 border border-pink-100'>
                  <Feather name='folder' size={16} color='#db2777' />
                  <Text className='text-sm text-pink-600 font-inter-medium'>View Details</Text>
                </TouchableOpacity>
              </DialogTrigger>
              <DialogContent
                displayCloseButton={false}
                style={{
                  padding: 16,
                  width: width - 30
                }}
              >
                <Button variant='outline' onPress={() => setDialogOpen(false)}>
                  <Text className='font-inter-medium'>Close</Text>
                </Button>
              </DialogContent>
            </Dialog>
          </View>
        </View>
      </View>
    </Card>
  )
}
