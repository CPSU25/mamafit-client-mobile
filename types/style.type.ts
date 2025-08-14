import { Category } from './category.type'

export interface Style {
  id: string
  name: string
  isCustom: boolean
  globalStatus: string
  description: string
  images: string[]
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export interface StylesByCategoryResponse extends Category {
  styles: Style[]
}
