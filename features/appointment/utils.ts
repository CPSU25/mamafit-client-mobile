import * as Location from 'expo-location'
import { LatLng } from 'react-native-maps'
import { Branch } from '~/types/order.type'

// Calculate distance between two coordinates
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Decode polyline
export const decodePolyline = (encoded: string): LatLng[] => {
  const points: LatLng[] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let shift = 0
    let result = 0
    let byte: number

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lat += result & 1 ? ~(result >> 1) : result >> 1

    shift = 0
    result = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lng += result & 1 ? ~(result >> 1) : result >> 1

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5
    })
  }

  return points
}

// Find nearest branch
export const findNearestBranch = (userLocation: Location.LocationObject, branches: Branch[]): Branch | null => {
  if (!branches || branches.length === 0) return null

  let nearest = branches[0]
  let minDistance = calculateDistance(
    userLocation.coords.latitude,
    userLocation.coords.longitude,
    branches[0].latitude,
    branches[0].longitude
  )

  branches.forEach((branch) => {
    const distance = calculateDistance(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      branch.latitude,
      branch.longitude
    )
    if (distance < minDistance) {
      minDistance = distance
      nearest = branch
    }
  })

  return nearest
}

// Create map coordinates from location and branch
export const createCoordinatesArray = (location: Location.LocationObject, branch: Branch): LatLng[] => [
  {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  },
  {
    latitude: branch.latitude,
    longitude: branch.longitude
  }
]
