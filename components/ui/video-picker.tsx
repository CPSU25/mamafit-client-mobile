import { Feather } from '@expo/vector-icons'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import { useVideoPicker } from '~/hooks/use-video-picker'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { Text } from './text'

interface VideoPickerTriggerProps {
  onPress: () => void
  isUploading: boolean
  isMaxReached: boolean
  currentCount: number
  maxVideos: number
  placeholder?: string
}

export function VideoPickerTrigger({
  onPress,
  isUploading,
  isMaxReached,
  currentCount,
  maxVideos,
  placeholder = 'Add videos'
}: VideoPickerTriggerProps) {
  if (isMaxReached) {
    return (
      <View className='flex flex-col items-center justify-center gap-2'>
        <Feather name='alert-circle' size={40} color='#f43f5e' />
        <Text className='text-xs font-medium text-rose-600'>
          Max {maxVideos} videos reached. Remove some to add more.
        </Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      disabled={isUploading}
      onPress={onPress}
      className='flex flex-col items-center justify-center gap-2'
    >
      {SvgIcon.videoPlay({ size: ICON_SIZE.LARGE, color: 'GRAY' })}
      <Text className='text-xs font-medium text-muted-foreground'>
        {isUploading
          ? 'Uploading...'
          : currentCount > 0
            ? `${currentCount} / ${maxVideos} videos selected. Tap to add more.`
            : placeholder}
      </Text>
    </TouchableOpacity>
  )
}

export function VideoThumbnail({
  uri,
  onRemove,
  className
}: {
  uri: string
  onRemove?: () => void
  className?: string
}) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true
    p.muted = false
    p.volume = 0.5
  })

  return (
    <View className='relative'>
      <View className={cn('w-24 h-24 rounded-xl', className)}>
        <VideoView
          style={{ width: '100%', height: '100%', borderRadius: 12 }}
          player={player}
          allowsFullscreen={true}
          allowsPictureInPicture={true}
          contentFit='cover'
        />
      </View>
      {onRemove ? (
        <Pressable
          onPress={onRemove}
          className='absolute top-1 right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-lg border border-white'
        >
          <Feather name='x' size={12} color='white' />
        </Pressable>
      ) : null}
    </View>
  )
}

interface VideoGridProps {
  videos: string[]
  onRemoveVideo: (index: number) => void
}

export function VideoGrid({ videos, onRemoveVideo }: VideoGridProps) {
  if (videos.length === 0) return null

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className='flex flex-row gap-2'>
        {videos.map((uri, index) => (
          <VideoThumbnail key={`${uri}-${index}`} uri={uri} onRemove={() => onRemoveVideo(index)} />
        ))}
      </View>
    </ScrollView>
  )
}

interface VideoResetButtonProps {
  onReset: () => void
}

export function VideoResetButton({ onReset }: VideoResetButtonProps) {
  return (
    <TouchableOpacity
      onPress={onReset}
      className='flex flex-row items-center justify-center gap-2 p-3 bg-rose-100 rounded-xl'
    >
      <Feather name='refresh-cw' size={16} color='#f43f5e' />
      <Text className='text-sm font-medium text-rose-600'>Clear all videos</Text>
    </TouchableOpacity>
  )
}

interface VideoPickerComponentProps {
  videos: string[]
  onVideosChange: (videos: string[]) => void
  maxVideos?: number
  maxSizeInMB?: number
  placeholder?: string
  containerClassName?: string
  path: string
}

export function VideoPickerComponent({
  videos,
  onVideosChange,
  maxVideos = 3,
  maxSizeInMB = 100,
  placeholder = 'Add videos',
  containerClassName = '',
  path
}: VideoPickerComponentProps) {
  const { pickVideos, removeVideo, resetVideos, isUploading, isMaxReached } = useVideoPicker({
    maxVideos,
    maxSizeInMB,
    initialVideos: videos,
    path
  })

  const handlePickVideos = async () => {
    const newUrls = await pickVideos()
    if (newUrls.length > 0) {
      onVideosChange([...videos, ...newUrls])
    }
  }

  const handleRemoveVideo = (index: number) => {
    removeVideo(index)
    onVideosChange(videos.filter((_, i) => i !== index))
  }

  const handleResetVideos = () => {
    resetVideos()
    onVideosChange([])
  }

  return (
    <View className='flex flex-col gap-4'>
      <View
        className={`flex flex-col gap-4 p-2 border border-dashed rounded-2xl ${containerClassName} ${
          isMaxReached ? 'border-rose-200 bg-rose-50/50' : 'border-input bg-muted/20'
        }`}
      >
        <VideoPickerTrigger
          onPress={handlePickVideos}
          isUploading={isUploading}
          isMaxReached={isMaxReached}
          currentCount={videos.length}
          maxVideos={maxVideos}
          placeholder={placeholder}
        />

        <VideoGrid videos={videos} onRemoveVideo={handleRemoveVideo} />

        {isMaxReached && <VideoResetButton onReset={handleResetVideos} />}
      </View>
    </View>
  )
}
