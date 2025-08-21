import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { format } from 'date-fns'
import { BlurView } from 'expo-blur'
import { forwardRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { FlattenedVoucher } from '~/types/voucher.type'
import VoucherCard from './voucher-card'

interface VouchersSelectionModalProps {
  vouchers: FlattenedVoucher[]
  selectedVoucherId?: string
  onSelectVoucher: (id: string | null) => void
  fullMerchandiseTotal: number
}

type VoucherStatus = {
  isDisabled: boolean
  errorMessage?: string
}

const getVoucherStatus = (voucher: FlattenedVoucher, fullMerchandiseTotal: number): VoucherStatus => {
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

  if (fullMerchandiseTotal < voucher.minimumOrderValue) {
    return {
      isDisabled: true,
      errorMessage: `Need to spend đ${(voucher.minimumOrderValue - fullMerchandiseTotal).toLocaleString('vi-VN')} more to use`
    }
  }

  return {
    isDisabled: false
  }
}

const VouchersSelectionModal = forwardRef<BottomSheetModal, VouchersSelectionModalProps>(
  ({ vouchers, onSelectVoucher, selectedVoucherId, fullMerchandiseTotal }, ref) => {
    return (
      <BottomSheetModal
        style={{
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
          maxHeight: '100%'
        }}
        ref={ref}
        snapPoints={['50%', '90%']}
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
        <Text className='text-xl font-inter-medium text-center'>Chọn mã giảm giá</Text>
        <BottomSheetFlatList
          data={vouchers}
          keyExtractor={(voucher) => voucher.voucherId}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className='mx-auto mt-24'>
              <Text className='text-sm text-muted-foreground'>Không tìm thấy mã giảm giá</Text>
            </View>
          }
          renderItem={({ item }) => {
            const { isDisabled, errorMessage } = getVoucherStatus(item, fullMerchandiseTotal)

            return (
              <TouchableOpacity
                onPress={() => {
                  if (!isDisabled) {
                    if (item.voucherId === selectedVoucherId) {
                      onSelectVoucher(null)
                    } else {
                      onSelectVoucher(item.voucherId)
                    }
                  }
                }}
                className={isDisabled ? 'opacity-50' : ''}
              >
                <VoucherCard
                  voucher={item}
                  errorMessage={errorMessage || ''}
                  isSelected={item.voucherId === selectedVoucherId}
                />
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
