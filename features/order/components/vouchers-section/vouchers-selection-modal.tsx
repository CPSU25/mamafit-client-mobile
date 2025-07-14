import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { format } from 'date-fns'
import { BlurView } from 'expo-blur'
import { forwardRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { FlattenedVoucher } from '~/types/voucher.type'

interface VouchersSelectionModalProps {
  vouchers: FlattenedVoucher[]
  selectedVoucherId?: string
  onSelectVoucher: (id: string) => void
  merchandiseTotal: number
}

type VoucherStatus = {
  isDisabled: boolean
  errorMessage?: string
}

const getVoucherStatus = (voucher: FlattenedVoucher, merchandiseTotal: number): VoucherStatus => {
  const now = new Date()
  const startDate = new Date(voucher.startDate)
  const endDate = new Date(voucher.endDate)

  if (now < startDate) {
    return {
      isDisabled: true,
      errorMessage: `Available from ${format(startDate, 'dd/MM/yyyy')}`
    }
  }

  if (now > endDate) {
    return {
      isDisabled: true,
      errorMessage: `Expired since ${format(endDate, 'dd/MM/yyyy')}`
    }
  }

  if (voucher.status === 'INACTIVE' || voucher.status === 'EXPIRED' || voucher.status === 'USED') {
    return {
      isDisabled: true,
      errorMessage: 'Invalid'
    }
  }

  if (merchandiseTotal < voucher.minimumOrderValue) {
    return {
      isDisabled: true,
      errorMessage: `Need to spend đ${(voucher.minimumOrderValue - merchandiseTotal).toLocaleString('vi-VN')} more to use`
    }
  }

  return {
    isDisabled: false
  }
}

const VouchersSelectionModal = forwardRef<BottomSheetModal, VouchersSelectionModalProps>(
  ({ vouchers, onSelectVoucher, selectedVoucherId, merchandiseTotal }, ref) => {
    return (
      <BottomSheetModal
        style={{
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
          maxHeight: '100%'
        }}
        ref={ref}
        snapPoints={['50%', '80%']}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={({ style }) => (
          <BlurView
            experimentalBlurMethod='dimezisBlurView'
            tint='light'
            intensity={5}
            style={[style, { overflow: 'hidden' }]}
          />
        )}
      >
        <Text className='text-xl font-inter-semibold text-center'>Vouchers Selection</Text>
        <BottomSheetFlatList
          data={vouchers}
          keyExtractor={(voucher) => voucher.voucherId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const { isDisabled, errorMessage } = getVoucherStatus(item, merchandiseTotal)

            return (
              <TouchableOpacity
                onPress={() => {
                  if (!isDisabled) {
                    if (item.voucherId === selectedVoucherId) {
                      onSelectVoucher('')
                    } else {
                      onSelectVoucher(item.voucherId)
                    }
                  }
                }}
                className={isDisabled ? 'opacity-50' : ''}
              >
                <View className='flex-row'>
                  <View className='w-8 h-32 bg-emerald-500 rounded-l-xl flex justify-center items-center'>
                    {SvgIcon.ticket({
                      size: 18,
                      color: 'WHITE'
                    })}
                  </View>
                  <View className='flex-1 p-3 border border-y-border border-r-border border-l-transparent flex-row rounded-r-xl'>
                    <View className='flex-1'>
                      <View className='mb-2'>
                        {item.discountType === 'FIXED' ? (
                          <Text className='font-inter-semibold text-xl text-emerald-500'>
                            <Text className='underline font-inter-semibold text-emerald-500 text-lg'>đ</Text>
                            {item.discountValue.toLocaleString('vi-VN')}
                          </Text>
                        ) : (
                          <Text className='font-inter-semibold text-xl text-emerald-500'>
                            {item.discountValue}% OFF Capped at{' '}
                            <Text className='underline font-inter-semibold text-emerald-500 text-lg'>đ</Text>
                            {item.maximumDiscountValue.toLocaleString('vi-VN')}
                          </Text>
                        )}
                      </View>
                      <Text className='text-sm' numberOfLines={1}>
                        Min. Spend <Text className='underline text-sm'>đ</Text>
                        {item.minimumOrderValue.toLocaleString('vi-VN')}
                      </Text>
                      <Text className='text-xs text-muted-foreground'>
                        Valid till: {format(new Date(item.endDate), 'dd/MM/yyyy')}
                      </Text>
                      {errorMessage && <Text className='text-xs text-rose-500 mt-auto'>{errorMessage}</Text>}
                    </View>

                    <View className='w-6 h-6 border border-black/50 rounded-full self-center flex justify-center items-center'>
                      {item.voucherId === selectedVoucherId && <View className='w-4 h-4 bg-emerald-500 rounded-full' />}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
          contentContainerClassName='p-4 gap-4'
        />
      </BottomSheetModal>
    )
  }
)

VouchersSelectionModal.displayName = 'VouchersSelectionModal'

export default VouchersSelectionModal
