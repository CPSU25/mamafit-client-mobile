export interface Dress {
  id: string
  styleName: string
  name: string
  description: string
  sku: string
  images: string[]
  price: number[]
  globalStatus: string
  slug: string
  soldCount: number
  feedbackCount: number
  averageRating: number
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export interface DressVariant {
  id: string
  name: string
  description: string
  color: string
  image: string[]
  sku: string
  size: string
  price: number
  quantity: number
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface DressDetail {
  id: string
  styleName: string
  name: string
  description: string
  images: string[]
  globalStatus: string
  sku: string
  slug: string
  soldCount: number
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  details: DressVariant[]
}
