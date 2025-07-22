import { AddOn, AddOnOption } from '~/types/add-on.type'
import { ADD_ON_IMAGE_CONFIG, DEFAULT_ADD_ON_IMAGE, ORDERED_SIZES, ORDERED_TYPES } from './constants'
import { AddOnImageConfig, AddOnMap, OptionMap, PositionInfo, SizeInfo } from './types'

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
    const pairKey = `${option.id}-${option.position.id}-${option.size.id}-${option.itemServiceType}`

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
        const [id, positionId, sizeId, type] = pairKey.split('-')
        return { id, positionId, sizeId, type }
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

export const getPairAddOnId = (optionDetail: OptionMap, positionId: string, sizeId: string, type: string) => {
  return optionDetail.validPairs.find(
    (pair) => pair.positionId === positionId && pair.sizeId === sizeId && pair.type === type
  )?.id
}
