import { JWTPayload } from 'jose'
import { OrderItemType } from './order.type'
import { Preset } from './preset.type'

export interface BaseResponse<T> {
  data: T | null
  additionalData: Record<string, any> | null
  message: string | null
  statusCode: number
  code: string | null
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface BasePaginationResponse<T> {
  data: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    items: T[]
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export interface ErrorResponse {
  errorCode: string
  errorMessage: string
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
}

export interface JwtUser extends JWTPayload {
  email: string
  name: string
  role: string
  userId: string
  username: string
}

export interface Permission {
  userName: string
  userEmail: string
  roleName: string
  profilePicture: string
}

export interface User {
  id: string
  userName: string | null
  userEmail: string
  phoneNumber: string | null
  dateOfBirth: null
  profilePicture: string | null
  fullName: string | null
  roleName: string
  isVerify: boolean
  createdAt: string
  createdBy: string | null
  updatedAt: string
  updatedBy: string | null
}

export interface ForwardGeocodingResponse {
  results: {
    address_components: {
      long_name: string
      short_name: string
    }[]
    formatted_address: string
    geometry: {
      location: {
        lat: number
        lng: number
      }
      boundary: null
    }
    place_id: string
    reference: string
    plus_code: {
      compound_code: string
      global_code: string
    }
    compound: {
      district: string
      commune: string
      province: string
    }
    types: string[]
    name: string
    address: string
  }[]
  status: string
}

export enum Vehicle {
  Bike = 'bike',
  Car = 'car',
  Truck = 'truck',
  Taxi = 'taxi',
  Hd = 'hd'
}

export interface DirectionResponse {
  geocoded_waypoints: GeocodedWaypoint[]
  routes: Route[]
}

export interface GeocodedWaypoint {
  geocoder_status: string
  place_id: string
}

export interface Route {
  bounds: Record<string, unknown>
  legs: Leg[]
  overview_polyline: Polyline
  summary: string
  warnings: string[]
  waypoint_order: number[]
}

export interface Leg {
  distance: TextValue
  duration: TextValue
  end_address: string
  end_location: LatLng
  start_address: string
  start_location: LatLng
  steps: Step[]
}

export interface Step {
  distance: TextValue
  duration: TextValue
  end_location: LatLng
  html_instructions: string
  maneuver: string
  polyline: Polyline
  start_location: LatLng
  travel_mode: string
}

export interface LatLng {
  lat: number
  lng: number
}

export interface TextValue {
  text: string
  value: number
}

export interface Polyline {
  points: string
}

export interface AppConfig {
  fields: { depositRate: number; designRequestServiceFee: number; name: string; presetVersions: number }
}

export interface CartItem {
  preset: Preset | null
  maternityDressDetail: any | null
  quantity: number
  type: OrderItemType
  itemId: string
}
