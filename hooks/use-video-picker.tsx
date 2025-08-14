import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Alert } from 'react-native'
import { toast } from 'sonner-native'
import ProgressToast from '~/components/toast/progress-toast'
import firebaseService from '~/services/firebase.service'

interface UseVideoPickerOptions {
  maxVideos?: number
  maxSizeInMB?: number
  initialVideos?: string[]
  path: string
}

const DEFAULT_MAX_VIDEOS = 3
const DEFAULT_MAX_SIZE_MB = 100

export function useVideoPicker({
  maxVideos = DEFAULT_MAX_VIDEOS,
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  initialVideos = [],
  path
}: UseVideoPickerOptions) {
  const [videos, setVideos] = useState<string[]>(initialVideos)
  const [isUploading, setIsUploading] = useState(false)

  const validateVideoSize = (asset: ImagePicker.ImagePickerAsset): boolean => {
    const fileSizeInMB = (asset.fileSize || 0) / (1024 * 1024)
    if (fileSizeInMB > maxSizeInMB) {
      Alert.alert(
        'Invalid Video',
        `${asset.fileName || 'Video'} is too large (${fileSizeInMB.toFixed(1)}MB). Maximum size is ${maxSizeInMB}MB.`
      )
      return false
    }
    return true
  }

  const pickVideos = async (): Promise<string[]> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access media library is required!')
        return []
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, maxVideos - videos.length),
        quality: 1
      })

      if (result.canceled) return []

      setIsUploading(true)

      const validAssets = result.assets.filter(validateVideoSize)
      if (validAssets.length === 0) {
        setIsUploading(false)
        return []
      }

      if (validAssets.length < result.assets.length) {
        Alert.alert(
          'Some Videos Skipped',
          `${result.assets.length - validAssets.length} video(s) were skipped due to size limits.`
        )
      }

      const urls: string[] = []

      await Promise.all(
        validAssets.map(async (asset, index) => {
          let currentProgress = 0
          const toastId = toast.custom(
            <ProgressToast
              currentProgress={currentProgress}
              title={`Uploading ${asset.fileName}` || `Video ${index + 1}`}
            />,
            { duration: Infinity }
          )

          await firebaseService
            .uploadSingleVideo(asset, path, (progress) => {
              currentProgress = progress
              toast.custom(
                <ProgressToast
                  currentProgress={currentProgress}
                  title={`Uploading ${asset.fileName}` || `Video ${index + 1}`}
                />,
                { id: toastId, duration: Infinity }
              )
            })
            .then((url) => {
              urls.push(url)
              toast.dismiss(toastId)
            })
            .catch((err) => {
              console.error(err)
              toast.dismiss(toastId)
              toast.error(`Failed: ${asset.fileName || `Video ${index + 1}`}`)
            })
        })
      )

      const newVideos = [...videos, ...urls]
      setVideos(newVideos)
      return urls
    } catch (error) {
      console.error('Error picking videos:', error)
      Alert.alert('Error', 'Failed to pick videos. Please try again.')
      return []
    } finally {
      setIsUploading(false)
    }
  }

  const removeVideo = (indexToRemove: number) => {
    setVideos((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const resetVideos = () => {
    Alert.alert('Clear All Videos', 'Are you sure you want to remove all videos?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setVideos([]) }
    ])
  }

  const updateVideos = (newVideos: string[]) => setVideos(newVideos)

  return {
    videos,
    isUploading,
    pickVideos,
    removeVideo,
    resetVideos,
    updateVideos,
    isMaxReached: videos.length >= maxVideos,
    remainingSlots: Math.max(0, maxVideos - videos.length)
  }
}
