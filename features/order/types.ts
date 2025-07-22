import { AddOnOption } from '~/types/add-on.type'

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
  positionId: string
  sizeId: string
  type: string
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
