import { Controller, useFormContext } from 'react-hook-form'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import FieldError from '~/components/field-error'
import { ImageThumbnail } from '~/components/ui/image-picker'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { Textarea } from '~/components/ui/textarea'
import { VideoThumbnail } from '~/components/ui/video-picker'
import { useFieldError } from '~/hooks/use-field-error'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn, isFormError } from '~/lib/utils'
import { TicketType } from '~/types/ticket.type'
import { CreateTicketFormSchema } from '../validations'

interface CreateTicketFormProps {
  pickImages: () => Promise<string[]>
  pickVideos: () => Promise<string[]>
  isImageUploading: boolean
  currentImages: string[]
  isVideoUploading: boolean
  currentVideos: string[]
}

export default function CreateTicketForm({
  pickImages,
  pickVideos,
  isImageUploading,
  currentImages,
  isVideoUploading,
  currentVideos
}: CreateTicketFormProps) {
  const {
    control,
    formState: { errors },
    setValue
  } = useFormContext<CreateTicketFormSchema>()
  const className = useFieldError()

  const handlePickImages = async () => {
    const newUrls = await pickImages()
    if (newUrls.length > 0) {
      setValue('images', [...currentImages, ...newUrls])
    }
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = currentImages.filter((_, i) => i !== index)
    setValue('images', updatedImages)
  }

  const handlePickVideos = async () => {
    const newUrls = await pickVideos()
    if (newUrls.length > 0) {
      setValue('videos', [...currentVideos, ...newUrls])
    }
  }

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = currentVideos.filter((_, i) => i !== index)
    setValue('videos', updatedVideos)
  }

  const noMedias = currentImages.length === 0 && currentVideos.length === 0
  const imagesMaxReached = 5
  const videosMaxReached = 1

  return (
    <View className='gap-4'>
      {/* Title */}
      <Animated.View entering={FadeInDown.delay(100)} className='flex flex-col gap-1'>
        <Text className='font-inter-medium text-sm'>Tiêu đề</Text>
        <Controller
          control={control}
          name='title'
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder='Nhập tiêu đề'
              value={value}
              onChangeText={onChange}
              className={cn('bg-background border-input', isFormError(errors, 'title') ? className : '')}
            />
          )}
        />
        {isFormError(errors, 'title') && <FieldError message={errors.title?.message || ''} />}
      </Animated.View>

      {/* Ticket Type */}
      <Animated.View entering={FadeInDown.delay(200)} className='flex flex-col gap-2'>
        <Text className='font-inter-medium text-sm'>Loại yêu cầu</Text>
        <Controller
          control={control}
          name='type'
          render={({ field: { onChange, value } }) => (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className='flex-row gap-2'>
                {Object.values(TicketType).map((type) => (
                  <View
                    key={type}
                    className={`px-3 py-2 rounded-lg border ${
                      value === type ? 'border-primary bg-primary/10' : 'border-input bg-background'
                    }`}
                  >
                    <TouchableOpacity onPress={() => onChange(type)}>
                      <Text
                        className={`text-sm ${value === type ? 'text-primary font-inter-medium' : 'text-foreground'}`}
                      >
                        {type === TicketType.WarrantyService && 'Dịch vụ bảo hành'}
                        {type === TicketType.DeliveryService && 'Dịch vụ vận chuyển'}
                        {type === TicketType.Other && 'Khác'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        />
        {isFormError(errors, 'type') && <FieldError message={errors.type?.message || ''} />}
      </Animated.View>

      {/* Media Picker */}
      <Animated.View entering={FadeInDown.delay(300)} className='flex flex-col gap-2'>
        <Text className='font-inter-medium text-sm'>Hình ảnh & Video</Text>
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
                  {isImageUploading ? 'Đang Tải Lên...' : 'Thêm Ảnh'}
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
                  {isVideoUploading ? 'Đang Tải Lên...' : 'Thêm Video'}
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
        {isFormError(errors, 'images') && <FieldError message={errors.images?.message || ''} />}
        {isFormError(errors, 'videos') && <FieldError message={errors.videos?.message || ''} />}
      </Animated.View>

      {/* Description */}
      <Animated.View entering={FadeInDown.delay(400)} className='flex flex-col gap-2'>
        <Controller
          control={control}
          name='description'
          render={({ field: { onChange, value } }) => (
            <Textarea
              placeholder='Mô tả chi tiết vấn đề của bạn'
              value={value}
              onChangeText={onChange}
              aria-labelledby='descriptionLabel'
              className={cn(
                'native:text-base bg-background border-input',
                isFormError(errors, 'description') ? className : ''
              )}
            />
          )}
        />
        {isFormError(errors, 'description') && <FieldError message={errors.description?.message || ''} />}
      </Animated.View>
    </View>
  )
}
