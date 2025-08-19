import { StyleSheet } from 'react-native'
import { SvgIcon } from './svg-icon'

export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)' // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)' // foreground
  }
}

export const PRIMARY_COLOR = {
  LIGHT: 'hsl(262.1 83.3% 57.8%)',
  DARK: 'hsl(263.4 70% 50.4%)'
}

export const ICON_SIZE = {
  EXTRA_SMALL: 24,
  SMALL: 28,
  MEDIUM: 32,
  LARGE: 40,
  MEDIUM_LARGE: 62,
  EXTRA_LARGE: 100
}

export const getShadowStyles = (shadowColor: string = 'rgba(0, 0, 0, 0.1)') => ({
  boxShadow: `0 0px 4px 0px ${shadowColor}`
})

export const styles = StyleSheet.create({
  container: getShadowStyles()
})

export const KEYBOARD_OFFSET = 15

export const placeholderImage =
  'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'

export const ERROR_MESSAGES = {
  ALREADY_HAVE_MEASUREMENT: 'Bạn đã có đo lường cho tuần này.',
  SOMETHING_WENT_WRONG: 'Có lỗi xảy ra! Vui lòng thử lại sau.',
  WRONG_CREDENTIALS: 'Thông tin đăng nhập không chính xác! Vui lòng thử lại.',
  INSUFFICIENT_PERMISSION: 'Bạn không có quyền truy cập vào ứng dụng này.'
}

export const ORDERED_COMPONENTS_OPTIONS = ['Neckline', 'Sleeves', 'Waist', 'Hem', 'Color', 'Fabric']

export const measurementCategories = [
  {
    title: 'Thông tin thai kỳ',
    description: 'Có sai sót? Quay lại để chỉnh sửa',
    icon: SvgIcon.calendarOne({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'weekOfPregnancy' as const, label: 'Tuổi thai', unit: 'tuần', editable: false },
      { name: 'bust' as const, label: 'Vòng ngực', unit: 'cm', editable: false },
      { name: 'waist' as const, label: 'Vòng eo', unit: 'cm', editable: false },
      { name: 'hip' as const, label: 'Vòng hông', unit: 'cm', editable: false }
    ]
  },
  {
    title: 'Số đo thân trên',
    description: 'Nhấn vào số đo để chỉnh sửa',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'neck' as const, label: 'Vòng cổ', unit: 'cm', editable: true },
      { name: 'coat' as const, label: 'Vòng áo', unit: 'cm', editable: true },
      { name: 'chestAround' as const, label: 'Vòng ngực', unit: 'cm', editable: true },
      { name: 'shoulderWidth' as const, label: 'Vòng vai', unit: 'cm', editable: true }
    ]
  },
  {
    title: 'Số đo thân giữa & vòng eo',
    description: 'Nhấn vào số đo để chỉnh sửa',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'stomach' as const, label: 'Vòng bụng', unit: 'cm', editable: true },
      { name: 'pantsWaist' as const, label: 'Vòng eo quần', unit: 'cm', editable: true }
    ]
  },
  {
    title: 'Số đo thân dưới',
    description: 'Nhấn vào số đo để chỉnh sửa',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'thigh' as const, label: 'Vòng đùi', unit: 'cm', editable: true },
      { name: 'legLength' as const, label: 'Chiều dài chân', unit: 'cm', editable: true }
    ]
  },
  {
    title: 'Số đo khác',
    description: 'Nhấn vào số đo để chỉnh sửa',
    icon: SvgIcon.ruler({ size: ICON_SIZE.SMALL, color: 'PRIMARY' }),
    measurements: [
      { name: 'dressLength' as const, label: 'Chiều dài váy', unit: 'cm', editable: true },
      { name: 'sleeveLength' as const, label: 'Chiều dài tay áo', unit: 'cm', editable: true }
    ]
  }
]

export const FILE_PATH = {
  DESIGN_REQUEST: 'design-requests',
  WARRANTY_REQUEST: 'warranty-requests',
  TICKET: 'tickets',
  FEEDBACK: 'feedbacks'
}
