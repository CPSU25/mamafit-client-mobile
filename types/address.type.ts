export interface Address {
  id: string
  userId: string
  mapId: string
  province: string
  district: string
  isDefault: boolean
  ward: string
  street: string
  latitude: number
  longitude: number
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}
