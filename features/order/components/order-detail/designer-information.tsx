import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { placeholderImage, styles } from '~/lib/constants/constants'
import { isValidUrl } from '~/lib/utils'
import { DesignerInfo } from '~/types/order.type'

interface DesignerInformationProps {
  designerInfo: DesignerInfo | null | undefined
}

export default function DesignerInformation({ designerInfo }: DesignerInformationProps) {
  const router = useRouter()

  return (
    <Card className='p-3' style={styles.container}>
      {designerInfo && designerInfo.designer && designerInfo.chatRoomId ? (
        <TouchableOpacity
          onPress={() => {
            if (designerInfo.chatRoomId) {
              router.push({
                pathname: '/chat/[roomId]',
                params: { roomId: designerInfo.chatRoomId }
              })
            }
          }}
        >
          <View className='flex-row items-center gap-3'>
            <Avatar alt={designerInfo.designer.fullName || 'designer-avatar'} className='border-2 border-emerald-500'>
              <AvatarImage
                source={{
                  uri:
                    designerInfo.designer.profilePicture && isValidUrl(designerInfo.designer.profilePicture)
                      ? designerInfo.designer.profilePicture
                      : placeholderImage
                }}
              />
              <AvatarFallback>
                <Text>{designerInfo.designer.fullName?.charAt(0)}</Text>
              </AvatarFallback>
            </Avatar>
            <View>
              <Text className='text-sm font-inter-medium' numberOfLines={1}>
                {designerInfo.designer.fullName}
              </Text>
              <Text className='text-xs text-muted-foreground'>Press to chat now</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View className='flex-row items-center gap-3'>
          <Avatar alt='designer-avatar'>
            <AvatarImage
              source={{
                uri: placeholderImage
              }}
            />
            <AvatarFallback>
              <Text>N/A</Text>
            </AvatarFallback>
          </Avatar>
          <View>
            <Text className='text-sm font-inter-medium'>
              Your Designer <Text className='text-xs text-muted-foreground/80'>(not assigned yet)</Text>
            </Text>
            <Text className='text-xs text-muted-foreground' numberOfLines={1}>
              Please wait for the designer to be assigned to you
            </Text>
          </View>
        </View>
      )}
    </Card>
  )
}
