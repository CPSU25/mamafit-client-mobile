import { Controller, useFormContext } from 'react-hook-form'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import FieldError from '~/components/field-error'
import { Card } from '~/components/ui/card'
import { ImageThumbnail } from '~/components/ui/image-picker'
import { Separator } from '~/components/ui/separator'
import StarRating from '~/components/ui/star-rating'
import { Text } from '~/components/ui/text'
import { Textarea } from '~/components/ui/textarea'
import { useImagePicker } from '~/hooks/use-image-picker'
import { FILE_PATH, ICON_SIZE, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { OrderItem, OrderItemType } from '~/types/order.type'
import { RateOrderFormSchema } from '../validations'

interface RateOrderFormProps {
  index: number
  orderItem: OrderItem
}

const imagesMaxReached = 5

const ratingMap: Record<number, string> = {
  1: '😡 Rất tệ',
  2: '☹️ Tệ',
  3: '😐 Trung bình',
  4: '🙂 Tốt',
  5: '🤩 Rất tốt'
}

const getRatingLabel = (rating: number, placeholder: string) => {
  return ratingMap[rating] || placeholder
}

export default function RateOrderForm({ orderItem, index }: RateOrderFormProps) {
  const {
    control,
    watch,
    formState: { errors },
    setValue
  } = useFormContext<RateOrderFormSchema>()

  const imagesPath = `ratings.${index}.images` as const
  const descriptionPath = `ratings.${index}.description` as const
  const ratingPath = `ratings.${index}.rated` as const

  const currentImages = (watch(imagesPath) as string[]) || []
  const currentRating = (watch(ratingPath) as number) || 0
  const itemErrors = (errors?.ratings?.[index] as any) || {}

  const {
    pickImages,
    removeImage,
    isUploading: isImageUploading
  } = useImagePicker({
    maxImages: 5,
    initialImages: currentImages,
    path: FILE_PATH.FEEDBACK
  })

  const handlePickImages = async () => {
    const newUrls = await pickImages()
    if (newUrls.length > 0) {
      setValue(imagesPath, [...currentImages, ...newUrls], { shouldDirty: true, shouldValidate: true })
    }
  }

  const handleRemoveImage = (imageIndex: number) => {
    removeImage(imageIndex)
    const updatedImages = currentImages.filter((_, i) => i !== imageIndex)
    setValue(imagesPath, updatedImages, { shouldDirty: true, shouldValidate: true })
  }

  if (orderItem.itemType === OrderItemType.Preset) {
    return (
      <Card style={styles.container}>
        <View className='gap-1 px-3 py-2'>
          <View className='flex-row items-center gap-4'>
            <Text className='text-sm font-inter-medium flex-1'>
              {getRatingLabel(currentRating, 'Đánh giá sản phẩm')}
            </Text>
            <Controller
              control={control}
              name={ratingPath}
              render={({ field: { value, onChange } }) => (
                <StarRating rating={value || 0} size={18} onRatingChange={onChange} />
              )}
            />
          </View>
          {!!itemErrors?.rated?.message && <FieldError message={String(itemErrors.rated.message)} />}
        </View>

        <Separator />

        <View className='gap-2 p-2'>
          <Card className='flex-row items-start gap-2 p-2 rounded-xl'>
            <View className='w-20 h-20 rounded-lg overflow-hidden bg-muted/50'>
              <Image source={{ uri: orderItem?.preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
            </View>
            <View className='flex-1 h-20 justify-between'>
              <View>
                <Text className='text-sm font-inter-medium' numberOfLines={1}>
                  {orderItem?.preset?.name || 'Váy bầu tùy chỉnh'}
                </Text>

                <View className='flex-row items-center gap-2'>
                  <Text className='text-xs text-muted-foreground flex-1'>
                    {orderItem?.preset?.sku ? `SKU: ${orderItem?.preset?.sku}` : ''}
                  </Text>
                  <Text className='text-xs text-muted-foreground'>x{orderItem?.quantity || 1}</Text>
                </View>
              </View>
              <View className='items-end'>
                <Text className='text-xs'>
                  <Text className='text-xs underline'>đ</Text>
                  {orderItem?.price?.toLocaleString('vi-VN') || '0'}
                </Text>
              </View>
            </View>
          </Card>

          <View className='gap-1'>
            {currentImages.length === 0 ? (
              <TouchableOpacity
                onPress={handlePickImages}
                disabled={isImageUploading}
                className='py-3 rounded-xl border border-input bg-muted/20 border-dashed gap-2 justify-center items-center'
              >
                {SvgIcon.galleryImport({ size: ICON_SIZE.MEDIUM, color: 'GRAY' })}
                <Text className='text-xs text-muted-foreground'>
                  {isImageUploading ? 'Đang tải lên...' : 'Thêm ảnh'}
                </Text>
              </TouchableOpacity>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className='flex-row items-center gap-2'>
                  {currentImages.length < imagesMaxReached ? (
                    <>
                      {currentImages.map((img, imageIndex) => (
                        <ImageThumbnail
                          key={`${img}-${imageIndex}`}
                          uri={img}
                          onRemove={() => handleRemoveImage(imageIndex)}
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
                    currentImages.map((img, imageIndex) => (
                      <ImageThumbnail
                        key={`${img}-${imageIndex}`}
                        uri={img}
                        onRemove={() => handleRemoveImage(imageIndex)}
                        className='w-28 h-28 bg-transparent border-transparent p-0'
                      />
                    ))
                  )}
                </View>
              </ScrollView>
            )}
            {!!itemErrors?.images?.message && <FieldError message={String(itemErrors.images.message)} />}
          </View>

          <View className='gap-1'>
            <Controller
              control={control}
              name={descriptionPath}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className='relative'>
                  <Textarea
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='Hãy chia sẻ trải nghiệm của bạn về sản phẩm này...'
                    className={cn(
                      'rounded-xl native:text-base min-h-[100px] bg-card/50 border-border/50 text-foreground',
                      itemErrors?.description && 'border-destructive'
                    )}
                    multiline
                  />
                  <View className='absolute bottom-3 right-3'>
                    <Text className='text-xs text-muted-foreground'>{value?.length || 0}/500</Text>
                  </View>
                </View>
              )}
            />
            {!!itemErrors?.description?.message && <FieldError message={String(itemErrors.description.message)} />}
          </View>
        </View>
      </Card>
    )
  }

  if (orderItem.itemType === OrderItemType.Warranty) {
    return (
      <Card style={styles.container}>
        <View className='gap-1 px-3 py-2'>
          <View className='flex-row items-center gap-4'>
            <Text className='text-sm font-inter-medium flex-1'>
              {getRatingLabel(currentRating, 'Đánh giá dịch vụ bảo hành')}
            </Text>
            <Controller
              control={control}
              name={ratingPath}
              render={({ field: { value, onChange } }) => (
                <StarRating rating={value || 0} size={18} onRatingChange={onChange} />
              )}
            />
          </View>
          {!!itemErrors?.rated?.message && <FieldError message={String(itemErrors.rated.message)} />}
        </View>

        <Separator />

        <View className='gap-2 p-2'>
          <Card className='flex-row items-start gap-2 p-2 rounded-xl'>
            <View className='w-20 h-20 rounded-lg overflow-hidden bg-muted/50'>
              <Image source={{ uri: orderItem?.preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
            </View>
            <View className='flex-1 h-20 justify-between'>
              <View>
                <Text className='text-sm font-inter-medium' numberOfLines={1}>
                  {orderItem?.preset?.name || 'Váy bầu tùy chỉnh'}
                </Text>

                <View className='flex-row items-center gap-2'>
                  <Text className='text-xs text-muted-foreground flex-1'>
                    {orderItem?.preset?.sku ? `SKU: ${orderItem?.preset?.sku}` : ''}
                  </Text>
                  <Text className='text-xs text-muted-foreground'>x{orderItem?.quantity || 1}</Text>
                </View>
              </View>
              <View className='items-end'>
                <Text className='text-xs'>
                  <Text className='text-xs underline'>đ</Text>
                  {orderItem?.price?.toLocaleString('vi-VN') || '0'}
                </Text>
              </View>
            </View>
          </Card>

          <View className='gap-1'>
            {currentImages.length === 0 ? (
              <TouchableOpacity
                onPress={handlePickImages}
                disabled={isImageUploading}
                className='py-3 rounded-xl border border-input bg-muted/20 border-dashed gap-2 justify-center items-center'
              >
                {SvgIcon.galleryImport({ size: ICON_SIZE.MEDIUM, color: 'GRAY' })}
                <Text className='text-xs text-muted-foreground'>
                  {isImageUploading ? 'Đang tải lên...' : 'Thêm ảnh'}
                </Text>
              </TouchableOpacity>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className='flex-row items-center gap-2'>
                  {currentImages.length < imagesMaxReached ? (
                    <>
                      {currentImages.map((img, imageIndex) => (
                        <ImageThumbnail
                          key={`${img}-${imageIndex}`}
                          uri={img}
                          onRemove={() => handleRemoveImage(imageIndex)}
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
                    currentImages.map((img, imageIndex) => (
                      <ImageThumbnail
                        key={`${img}-${imageIndex}`}
                        uri={img}
                        onRemove={() => handleRemoveImage(imageIndex)}
                        className='w-28 h-28 bg-transparent border-transparent p-0'
                      />
                    ))
                  )}
                </View>
              </ScrollView>
            )}
            {!!itemErrors?.images?.message && <FieldError message={String(itemErrors.images.message)} />}
          </View>

          <View className='gap-1'>
            <Controller
              control={control}
              name={descriptionPath}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className='relative'>
                  <Textarea
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='Hãy chia sẻ trải nghiệm của bạn về dịch vụ bảo hành này...'
                    className={cn(
                      'rounded-xl native:text-base min-h-[100px] bg-card/50 border-border/50 text-foreground',
                      itemErrors?.description && 'border-destructive'
                    )}
                    multiline
                  />
                  <View className='absolute bottom-3 right-3'>
                    <Text className='text-xs text-muted-foreground'>{value?.length || 0}/500</Text>
                  </View>
                </View>
              )}
            />
            {!!itemErrors?.description?.message && <FieldError message={String(itemErrors.description.message)} />}
          </View>
        </View>
      </Card>
    )
  }

  if (orderItem.itemType === OrderItemType.DesignRequest) {
    return (
      <Card style={styles.container}>
        <View className='gap-1 px-3 py-2'>
          <View className='flex-row items-center gap-4'>
            <Text className='text-sm font-inter-medium flex-1'>
              {getRatingLabel(currentRating, 'Đánh giá dịch vụ')}
            </Text>
            <Controller
              control={control}
              name={ratingPath}
              render={({ field: { value, onChange } }) => (
                <StarRating rating={value || 0} size={18} onRatingChange={onChange} />
              )}
            />
          </View>
          {!!itemErrors?.rated?.message && <FieldError message={String(itemErrors.rated.message)} />}
        </View>

        <Separator />

        <View className='gap-2 p-2'>
          <Card className='flex-row items-start gap-2 p-2 rounded-xl'>
            <View className='w-20 h-20 rounded-lg overflow-hidden bg-muted/50'>
              <Image
                source={{ uri: orderItem?.designRequest?.images?.[0] }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>
            <View className='flex-1 h-20 justify-between'>
              <View>
                <Text className='text-sm font-inter-medium' numberOfLines={1}>
                  Yêu cầu thiết kế
                </Text>

                <View className='flex-row items-center gap-2'>
                  <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
                    {orderItem?.designRequest?.description}
                  </Text>
                </View>
              </View>
              <View className='items-end'>
                <Text className='text-xs'>
                  <Text className='text-xs underline'>đ</Text>
                  {orderItem?.price?.toLocaleString('vi-VN') || '0'}
                </Text>
              </View>
            </View>
          </Card>

          <View className='gap-1'>
            {currentImages.length === 0 ? (
              <TouchableOpacity
                onPress={handlePickImages}
                disabled={isImageUploading}
                className='py-3 rounded-xl border border-input bg-muted/20 border-dashed gap-2 justify-center items-center'
              >
                {SvgIcon.galleryImport({ size: ICON_SIZE.MEDIUM, color: 'GRAY' })}
                <Text className='text-xs text-muted-foreground'>
                  {isImageUploading ? 'Đang tải lên...' : 'Thêm ảnh'}
                </Text>
              </TouchableOpacity>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className='flex-row items-center gap-2'>
                  {currentImages.length < imagesMaxReached ? (
                    <>
                      {currentImages.map((img, imageIndex) => (
                        <ImageThumbnail
                          key={`${img}-${imageIndex}`}
                          uri={img}
                          onRemove={() => handleRemoveImage(imageIndex)}
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
                    currentImages.map((img, imageIndex) => (
                      <ImageThumbnail
                        key={`${img}-${imageIndex}`}
                        uri={img}
                        onRemove={() => handleRemoveImage(imageIndex)}
                        className='w-28 h-28 bg-transparent border-transparent p-0'
                      />
                    ))
                  )}
                </View>
              </ScrollView>
            )}
            {!!itemErrors?.images?.message && <FieldError message={String(itemErrors.images.message)} />}
          </View>

          <View className='gap-1'>
            <Controller
              control={control}
              name={descriptionPath}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className='relative'>
                  <Textarea
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='Hãy chia sẻ trải nghiệm của bạn về dịch vụ này...'
                    className={cn(
                      'rounded-xl native:text-base min-h-[100px] bg-card/50 border-border/50 text-foreground',
                      itemErrors?.description && 'border-destructive'
                    )}
                    multiline
                  />
                  <View className='absolute bottom-3 right-3'>
                    <Text className='text-xs text-muted-foreground'>{value?.length || 0}/500</Text>
                  </View>
                </View>
              )}
            />
            {!!itemErrors?.description?.message && <FieldError message={String(itemErrors.description.message)} />}
          </View>
        </View>
      </Card>
    )
  }

  if (orderItem.itemType === OrderItemType.ReadyToBuy) {
    return (
      <Card style={styles.container}>
        <View className='gap-1 px-3 py-2'>
          <View className='flex-row items-center gap-4'>
            <Text className='text-sm font-inter-medium flex-1'>
              {getRatingLabel(currentRating, 'Đánh giá sản phẩm')}
            </Text>
            <Controller
              control={control}
              name={ratingPath}
              render={({ field: { value, onChange } }) => (
                <StarRating rating={value || 0} size={18} onRatingChange={onChange} />
              )}
            />
          </View>
          {!!itemErrors?.rated?.message && <FieldError message={String(itemErrors.rated.message)} />}
        </View>

        <Separator />

        <View className='gap-2 p-2'>
          <Card className='flex-row items-start gap-2 p-2 rounded-xl'>
            <View className='w-20 h-20 overflow-hidden relative rounded-lg'>
              <Image
                source={{ uri: orderItem.maternityDressDetail?.image[0] }}
                style={{
                  width: '100%',
                  height: '180%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                resizeMode='cover'
              />
            </View>
            <View className='flex-1 h-20 justify-between'>
              <View>
                <Text className='text-sm font-inter-medium' numberOfLines={1}>
                  {orderItem?.maternityDressDetail?.name || 'Váy bầu tùy chỉnh'}
                </Text>

                <View className='flex-row items-center gap-2'>
                  <Text className='text-xs text-muted-foreground flex-1'>
                    {orderItem?.maternityDressDetail?.sku ? `SKU: ${orderItem?.maternityDressDetail?.sku}` : ''}
                  </Text>
                  <Text className='text-xs text-muted-foreground'>x{orderItem?.quantity || 1}</Text>
                </View>
              </View>
              <View className='items-end'>
                <Text className='text-xs'>
                  <Text className='text-xs underline'>đ</Text>
                  {orderItem?.price?.toLocaleString('vi-VN') || '0'}
                </Text>
              </View>
            </View>
          </Card>

          <View className='gap-1'>
            {currentImages.length === 0 ? (
              <TouchableOpacity
                onPress={handlePickImages}
                disabled={isImageUploading}
                className='py-3 rounded-xl border border-input bg-muted/20 border-dashed gap-2 justify-center items-center'
              >
                {SvgIcon.galleryImport({ size: ICON_SIZE.MEDIUM, color: 'GRAY' })}
                <Text className='text-xs text-muted-foreground'>
                  {isImageUploading ? 'Đang tải lên...' : 'Thêm ảnh'}
                </Text>
              </TouchableOpacity>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className='flex-row items-center gap-2'>
                  {currentImages.length < imagesMaxReached ? (
                    <>
                      {currentImages.map((img, imageIndex) => (
                        <ImageThumbnail
                          key={`${img}-${imageIndex}`}
                          uri={img}
                          onRemove={() => handleRemoveImage(imageIndex)}
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
                    currentImages.map((img, imageIndex) => (
                      <ImageThumbnail
                        key={`${img}-${imageIndex}`}
                        uri={img}
                        onRemove={() => handleRemoveImage(imageIndex)}
                        className='w-28 h-28 bg-transparent border-transparent p-0'
                      />
                    ))
                  )}
                </View>
              </ScrollView>
            )}
            {!!itemErrors?.images?.message && <FieldError message={String(itemErrors.images.message)} />}
          </View>

          <View className='gap-1'>
            <Controller
              control={control}
              name={descriptionPath}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className='relative'>
                  <Textarea
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='Hãy chia sẻ trải nghiệm của bạn về sản phẩm này...'
                    className={cn(
                      'rounded-xl native:text-base min-h-[100px] bg-card/50 border-border/50 text-foreground',
                      itemErrors?.description && 'border-destructive'
                    )}
                    multiline
                  />
                  <View className='absolute bottom-3 right-3'>
                    <Text className='text-xs text-muted-foreground'>{value?.length || 0}/500</Text>
                  </View>
                </View>
              )}
            />
            {!!itemErrors?.description?.message && <FieldError message={String(itemErrors.description.message)} />}
          </View>
        </View>
      </Card>
    )
  }
}
