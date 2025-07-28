import AsyncStorage from '@react-native-async-storage/async-storage'
import { AddOn, AddOnOption } from '~/types/add-on.type'
import { OrderItemTemp } from '~/types/order-item.type'
import { ADD_ON_IMAGE_CONFIG, DEFAULT_ADD_ON_IMAGE, ORDERED_SIZES, ORDERED_TYPES } from './constants'
import { AddOnImageConfig, AddOnMap, AddOnOptionItem, OptionMap, PositionInfo, PresetItem, SizeInfo } from './types'

export const getAddOnImage = (name: string): AddOnImageConfig => {
  return ADD_ON_IMAGE_CONFIG[name] ?? DEFAULT_ADD_ON_IMAGE
}

export const capitalizeText = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const sortSizesSafely = (sizes: SizeInfo[]): SizeInfo[] => {
  return [...sizes].sort((a, b) => {
    const aIndex = ORDERED_SIZES.indexOf(a.sizeName)
    const bIndex = ORDERED_SIZES.indexOf(b.sizeName)

    if (aIndex === -1 && bIndex === -1) return a.sizeName.localeCompare(b.sizeName)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1

    return aIndex - bIndex
  })
}

export const sortTypesSafely = (types: string[]): string[] => {
  return [...types].sort((a, b) => {
    const aIndex = ORDERED_TYPES.indexOf(a)
    const bIndex = ORDERED_TYPES.indexOf(b)

    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1

    return aIndex - bIndex
  })
}

export const transformAddOns = (addOns: AddOn[]): AddOnMap[] => {
  if (!Array.isArray(addOns) || addOns.length === 0) {
    return []
  }

  return addOns.map((addOn): AddOnMap => {
    if (!addOn.id || !addOn.name || !Array.isArray(addOn.addOnOptions)) {
      throw new Error(`Invalid add-on structure: missing required fields for ${addOn.name || 'unknown'}`)
    }

    const prices = addOn.addOnOptions
      .map((option: AddOnOption) => option.price)
      .filter((price: number) => typeof price === 'number' && !isNaN(price))

    if (prices.length === 0) {
      throw new Error(`No valid prices found for add-on: ${addOn.name}`)
    }

    return {
      id: addOn.id,
      name: addOn.name,
      description: addOn.description || '',
      groupOptions: addOn.addOnOptions,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices)
    }
  })
}

export const transformOptions = (groupOptions: AddOnOption[]): OptionMap[] => {
  if (!Array.isArray(groupOptions) || groupOptions.length === 0) {
    return []
  }

  const optionsMap = new Map<
    string,
    {
      name: string
      minPrice: number
      maxPrice: number
      type: string
      positions: Map<string, PositionInfo>
      sizes: Map<string, SizeInfo>
      validPairs: Set<string>
    }
  >()

  groupOptions.forEach((option) => {
    const key = `${option.addOnId}-${option.name}`
    const pairKey = `${option.id}-${option.name}-${option.position.id}-${option.size.id}-${option.itemServiceType}-${option.price}`

    let currentOption = optionsMap.get(key)

    if (currentOption) {
      currentOption.positions.set(option.position.id, {
        positionId: option.position.id,
        positionName: option.position.name,
        image: option.position.image
      })

      currentOption.sizes.set(option.size.id, {
        sizeId: option.size.id,
        sizeName: option.size.name
      })

      currentOption.validPairs.add(pairKey)
      currentOption.minPrice = Math.min(currentOption.minPrice, option.price)
      currentOption.maxPrice = Math.max(currentOption.maxPrice, option.price)
    } else {
      currentOption = {
        name: option.name,
        minPrice: option.price,
        maxPrice: option.price,
        type: option.itemServiceType || '',
        positions: new Map([
          [
            option.position.id,
            {
              positionId: option.position.id,
              positionName: option.position.name,
              image: option.position.image
            }
          ]
        ]),
        sizes: new Map([
          [
            option.size.id,
            {
              sizeId: option.size.id,
              sizeName: option.size.name
            }
          ]
        ]),
        validPairs: new Set([pairKey])
      }
      optionsMap.set(key, currentOption)
    }
  })

  return Array.from(optionsMap.values()).map((option): OptionMap => {
    const sizesArray = Array.from(option.sizes.values())
    const sortedSizes = sortSizesSafely(sizesArray)

    return {
      name: option.name,
      minPrice: option.minPrice,
      maxPrice: option.maxPrice,
      type: option.type,
      positions: Array.from(option.positions.values()),
      sizes: sortedSizes,
      validPairs: Array.from(option.validPairs).map((pairKey) => {
        const [id, name, positionId, sizeId, type, price] = pairKey.split('-')
        return { id, name, positionId, sizeId, type, price: Number(price) }
      })
    }
  })
}

export const isPositionEnabled = (optionDetail: OptionMap, positionId: string, sizeId: string | null): boolean => {
  if (!sizeId) return true
  return optionDetail.validPairs.some((pair) => pair.positionId === positionId && pair.sizeId === sizeId)
}

export const isSizeEnabled = (optionDetail: OptionMap, sizeId: string, positionId: string | null): boolean => {
  if (!positionId) return true
  return optionDetail.validPairs.some((pair) => pair.sizeId === sizeId && pair.positionId === positionId)
}

export const getAvailableTypes = (optionDetail: OptionMap, positionId: string, sizeId: string): string[] => {
  const types = optionDetail.validPairs
    .filter((pair) => pair.positionId === positionId && pair.sizeId === sizeId)
    .map((pair) => pair.type)
    .filter((type, index, array) => array.indexOf(type) === index)

  return sortTypesSafely(types)
}

export const getValidPair = (optionDetail: OptionMap, positionId: string, sizeId: string, type: string) => {
  return optionDetail.validPairs.find(
    (pair) => pair.positionId === positionId && pair.sizeId === sizeId && pair.type === type
  )
}

export const getOrderItems = async () => {
  try {
    const orderItems = await AsyncStorage.getItem('order-items')
    if (!orderItems) return null

    const parsedOrderItems = JSON.parse(orderItems) as OrderItemTemp<unknown>
    if (
      parsedOrderItems &&
      typeof parsedOrderItems === 'object' &&
      'type' in parsedOrderItems &&
      'items' in parsedOrderItems
    ) {
      return parsedOrderItems
    }

    return null
  } catch (error) {
    console.error('Error getting order items:', error)
    return null
  }
}

export const savePresetToAsyncStorage = async (preset: PresetItem) => {
  try {
    await AsyncStorage.setItem(
      'order-items',
      JSON.stringify({
        type: 'preset',
        items: [preset]
      })
    )
    return true
  } catch (error) {
    console.error('Error saving preset to AsyncStorage:', error)
    return false
  }
}

export const removeAddOnOptionFromPreset = (preset: PresetItem, optionId: string): PresetItem => {
  const updatedAddOnOptions = preset.addOnOptions?.filter((option) => option.addOnOptionId !== optionId) || []
  return { ...preset, addOnOptions: updatedAddOnOptions }
}

export const addAddOnOptionToPreset = (preset: PresetItem, newOption: AddOnOptionItem): PresetItem => {
  const existingOptions = preset.addOnOptions || []
  // Remove duplicates by id and position
  const filteredOptions = existingOptions.filter(
    (option) => option.addOnOptionId !== newOption.addOnOptionId && option.positionId !== newOption.positionId
  )

  return {
    ...preset,
    addOnOptions: [...filteredOptions, newOption]
  }
}

export const convertAddOnOptionsToFormFormat = (addOnOptions: AddOnOptionItem[]) => {
  return addOnOptions.map((option) => ({
    addOnOptionId: option.addOnOptionId,
    value: option.value
  }))
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'CREATED':
      return 'credit-card'
    case 'IN_DESIGN':
      return 'edit-3'
    case 'CONFIRMED':
      return 'check-circle'
    case 'IN_PRODUCTION':
      return 'tool'
    case 'IN_QC':
      return 'search'
    case 'AWAITING_PAID_REST':
      return 'dollar-sign'
    case 'PACKAGING':
      return 'package'
    case 'SHIPPING':
      return 'truck'
    case 'COMPLETED':
      return 'award'
    case 'WARRANTY_CHECK':
      return 'shield'
    case 'IN_WARRANTY':
      return 'refresh-cw'
    default:
      return 'circle'
  }
}
