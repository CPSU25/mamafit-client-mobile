export interface Position {
  id: string
  name: string
  image: string
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface Size {
  id: string
  name: string
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface AddOnOption {
  id: string
  addOnId: string
  positionId: string
  sizeId: string
  name: string
  description: string
  price: number
  itemServiceType: string
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
  value: string | null
  position: Position
  size: Size
}

export interface AddOn {
  id: string
  name: string
  description: string
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
  addOnOptions: AddOnOption[]
}

export interface FlattenedSize {
  sizeId: string
  sizeName: string
  optionId: string
  price: number
  description: string
}

export interface FlattenedAddOn {
  addOnId: string
  addOnName: string
  addOnDescription: string
  minPrice: number
  maxPrice: number
  optionGroups: {
    name: string
    positionId: string
    positionName: string
    itemServiceType: string
    sizes: FlattenedSize[]
  }[]
}
