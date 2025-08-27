import { Controller, useFormContext } from 'react-hook-form'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import FieldError from '~/components/field-error'
import { Card } from '~/components/ui/card'
import { ImageThumbnail } from '~/components/ui/image-picker'
import { Text } from '~/components/ui/text'
import { Textarea } from '~/components/ui/textarea'
import { VideoThumbnail } from '~/components/ui/video-picker'
import { useFieldError } from '~/hooks/use-field-error'
import { useImagePicker } from '~/hooks/use-image-picker'
import { useVideoPicker } from '~/hooks/use-video-picker'
import { FILE_PATH, ICON_SIZE, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { OrderItem } from '~/types/order.type'
import { CreateWarrantyRequestSchema } from '../validations'

interface CreateWarrantyRequestFormProps {
  index: number
  orderItem?: OrderItem
}

const imagesMaxReached = 5
const videosMaxReached = 1

export default function CreateWarrantyRequestForm({ index, orderItem }: CreateWarrantyRequestFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
    watch
  } = useFormContext<CreateWarrantyRequestSchema>()

  const className = useFieldError()
  const imagesPath = `items.${index}.images` as const
  const videosPath = `items.${index}.videos` as const
  const descriptionPath = `items.${index}.description` as const

  const currentImages = (watch(imagesPath) as string[]) || []
  const currentVideos = (watch(videosPath) as string[]) || []
  const itemErrors = (errors.items?.[index] as any) || {}

  const {
    pickImages,
    removeImage,
    isUploading: isImageUploading
  } = useImagePicker({
    maxImages: 5,
    initialImages: currentImages,
    path: FILE_PATH.WARRANTY_REQUEST
  })

  const {
    pickVideos,
    removeVideo,
    isUploading: isVideoUploading
  } = useVideoPicker({
    maxVideos: 1,
    maxSizeInMB: 10,
    path: FILE_PATH.WARRANTY_REQUEST
  })

  const handlePickImages = async () => {
    const newUrls = await pickImages()
    if (newUrls.length > 0) {
      setValue(imagesPath, [...currentImages, ...newUrls], { shouldDirty: true, shouldValidate: true })
    }
  }

  const handlePickVideos = async () => {
    const newUrls = await pickVideos()
    if (newUrls.length > 0) {
      setValue(videosPath, [...currentVideos, ...newUrls], { shouldDirty: true, shouldValidate: true })
    }
  }

  const handleRemoveImage = (index: number) => {
    removeImage(index)
    const updatedImages = currentImages.filter((_, i) => i !== index)
    setValue(imagesPath, updatedImages, { shouldDirty: true, shouldValidate: true })
  }

  const handleRemoveVideo = (index: number) => {
    removeVideo(index)
    const updatedVideos = currentVideos.filter((_, i) => i !== index)
    setValue(videosPath, updatedVideos, { shouldDirty: true, shouldValidate: true })
  }

  const noMedias = currentImages.length === 0 && currentVideos.length === 0

  return (
    <Card className='p-2 gap-2' style={styles.container}>
      <View className='flex-1 flex-row items-start gap-2'>
        <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
          <Image source={{ uri: orderItem?.preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
        </View>
        <View className='flex-1 h-20 justify-between pr-2'>
          <View>
            <Text className='native:text-sm font-inter-medium'>{orderItem?.preset?.name || 'Váy bầu tùy chỉnh'}</Text>
            <View className='flex-row items-center justify-between'>
              <Text className='native:text-xs text-muted-foreground'>
                {orderItem?.preset?.styleName || 'Không có kiểu'}
              </Text>
              <Text className='native:text-xs text-muted-foreground'>x{orderItem?.quantity || 1}</Text>
            </View>
          </View>
          <View className='items-end'>
            <Text className='native:text-xs'>SKU: {orderItem?.preset?.sku ?? 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View className='gap-2'>
        {noMedias ? (
          <View className='flex-row items-center gap-2'>
            <View className='gap-1 flex-1'>
              <TouchableOpacity
                onPress={handlePickImages}
                disabled={isImageUploading}
                className='py-3 rounded-2xl border border-input bg-muted/20 border-dashed gap-2 justify-center items-center'
              >
                {SvgIcon.galleryImport({ size: ICON_SIZE.MEDIUM, color: 'GRAY' })}
                <Text className='text-xs text-muted-foreground'>
                  {isImageUploading ? 'Đang tải lên...' : 'Thêm ảnh'}
                </Text>
              </TouchableOpacity>
            </View>
            <View className='gap-1 flex-1'>
              <TouchableOpacity
                onPress={handlePickVideos}
                disabled={isVideoUploading}
                className='py-3 rounded-2xl border border-input bg-muted/20 border-dashed gap-2 justify-center items-center'
              >
                {SvgIcon.videoPlay({ size: ICON_SIZE.MEDIUM, color: 'GRAY' })}
                <Text className='text-xs text-muted-foreground'>
                  {isVideoUploading ? 'Đang tải lên...' : 'Thêm video'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row items-center gap-2'>
              {currentVideos.length < videosMaxReached ? (
                <>
                  {currentVideos.map((video, index) => (
                    <VideoThumbnail
                      key={index}
                      uri={video}
                      onRemove={() => handleRemoveVideo(index)}
                      className='w-28 h-28 bg-transparent border-transparent p-0'
                    />
                  ))}
                  <TouchableOpacity
                    onPress={handlePickVideos}
                    disabled={isVideoUploading}
                    className='w-28 h-28 rounded-2xl border border-input bg-muted/20 border-dashed gap-2 justify-center items-center'
                  >
                    {SvgIcon.videoPlay({ size: ICON_SIZE.MEDIUM, color: 'GRAY' })}
                    <Text className='text-sm text-muted-foreground font-inter-medium'>
                      {videosMaxReached - currentVideos.length}/{videosMaxReached}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                currentVideos.map((video, index) => (
                  <VideoThumbnail
                    key={index}
                    uri={video}
                    onRemove={() => handleRemoveVideo(index)}
                    className='w-28 h-28 bg-transparent border-transparent p-0'
                  />
                ))
              )}
              {currentImages.length < imagesMaxReached ? (
                <>
                  {currentImages.map((img, index) => (
                    <ImageThumbnail
                      key={`${img}-${index}`}
                      uri={img}
                      onRemove={() => handleRemoveImage(index)}
                      className='w-28 h-28 bg-transparent border-transparent p-0'
                    />
                  ))}
                  <TouchableOpacity
                    onPress={handlePickImages}
                    disabled={isImageUploading}
                    className='w-28 h-28 rounded-2xl border border-input bg-muted/20 border-dashed gap-2 justify-center items-center'
                  >
                    {SvgIcon.galleryImport({ size: ICON_SIZE.MEDIUM, color: 'GRAY' })}
                    <Text className='text-sm text-muted-foreground font-inter-medium'>
                      {imagesMaxReached - currentImages.length}/{imagesMaxReached}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                currentImages.map((img, index) => (
                  <ImageThumbnail
                    key={`${img}-${index}`}
                    uri={img}
                    onRemove={() => handleRemoveImage(index)}
                    className='w-28 h-28 bg-transparent border-transparent p-0'
                  />
                ))
              )}
            </View>
          </ScrollView>
        )}
        {!!itemErrors?.images?.message && <FieldError message={String(itemErrors.images.message)} />}
        {!!itemErrors?.videos?.message && <FieldError message={String(itemErrors.videos.message)} />}
      </View>

      <View className='gap-1'>
        <Controller
          control={control}
          name={descriptionPath}
          render={({ field: { value, onChange, onBlur } }) => (
            <Textarea
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder='Mô tả lỗi và vị trí xuất hiện'
              className={cn('rounded-2xl native:text-base', itemErrors?.description && className)}
            />
          )}
        />
        {!!itemErrors?.description?.message && <FieldError message={String(itemErrors.description.message)} />}
      </View>
    </Card>
  )
}
