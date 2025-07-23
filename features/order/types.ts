import { AddOnOption } from '~/types/add-on.type'
import { PresetWithComponentOptions } from '~/types/preset.type'

export interface AddOnMap {
  id: string
  name: string
  description: string
  minPrice: number
  maxPrice: number
  groupOptions: AddOnOption[]
}

export interface PositionInfo {
  positionId: string
  positionName: string
  image: string
}

export interface SizeInfo {
  sizeId: string
  sizeName: string
}

export interface ValidPair {
  id: string
  name: string
  positionId: string
  sizeId: string
  type: string
  price: number
}

export interface OptionMap {
  name: string
  minPrice: number
  maxPrice: number
  type: string
  positions: PositionInfo[]
  sizes: SizeInfo[]
  validPairs: ValidPair[]
}

export interface AddOnImageConfig {
  url: any
  color: string
  textColor: string
}

export interface PresetItem extends PresetWithComponentOptions {
  addOnOptions: AddOnOptionItem[]
}

export interface AddOnOptionItem {
  addOnOptionId: string
  name: string
  sizeName: string
  sizeId: string
  value: string
  type: string
  positionName: string
  positionId: string
  price: number
}
