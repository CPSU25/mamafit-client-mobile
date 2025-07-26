import { MaterialIcons } from '@expo/vector-icons'
import { addWeeks, endOfWeek, format, isThisWeek, isToday, isWithinInterval, parseISO, startOfWeek } from 'date-fns'
import * as Location from 'expo-location'
import { LatLng } from 'react-native-maps'
import { Branch } from '~/types/order.type'
import { DateRange } from './types'

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

export const formatDateStr = (isoDateString: string): DateRange => {
  const date = parseISO(isoDateString)
  const now = new Date()

  if (isToday(date)) {
    return {
      date: 'Today',
      from: date,
      to: date
    }
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    return {
      date: 'This Week',
      from: startOfWeek(now, { weekStartsOn: 1 }),
      to: endOfWeek(now, { weekStartsOn: 1 })
    }
  }

  // Next week detection
  const nextWeekStart = startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 })
  const nextWeekEnd = endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 })

  if (isWithinInterval(date, { start: nextWeekStart, end: nextWeekEnd })) {
    return {
      date: 'Next Week',
      from: nextWeekStart,
      to: nextWeekEnd
    }
  }

  // For dates beyond next week or in the past
  return {
    date: format(date, 'MMM d, yyyy'),
    from: date,
    to: date
  }
}

// Helper function to create a unique key for date ranges
export const createDateRangeKey = (dateRange: DateRange): string => {
  return `${dateRange.date}-${dateRange.from.getTime()}-${dateRange.to.getTime()}`
}

// Helper function to parse date range key back to DateRange
export const parseDateRangeKey = (key: string): DateRange => {
  const [date, fromTime, toTime] = key.split('-')
  return {
    date,
    from: new Date(parseInt(fromTime)),
    to: new Date(parseInt(toTime))
  }
}

export const getStatusColor = (
  status: string
): {
  bgColor: string
  text: string
  icon: keyof typeof MaterialIcons.glyphMap
  iconColor: string
  barColor: string
} => {
  switch (status) {
    case 'UP_COMING':
      return {
        bgColor: 'bg-blue-100',
        text: 'Upcoming',
        icon: 'upcoming',
        iconColor: '#2563eb',
        barColor: '#669df6'
      }
    case 'CHECKED_IN':
      return {
        bgColor: 'bg-amber-100',
        text: 'Checked In',
        icon: 'check-box',
        iconColor: '#d97706',
        barColor: '#f3aa4a'
      }
    case 'CHECKED_OUT':
      return {
        bgColor: 'bg-emerald-100',
        text: 'Checked Out',
        icon: 'check-box',
        iconColor: '#059669',
        barColor: '#37c392'
      }
    case 'CANCELED':
      return {
        bgColor: 'bg-rose-100',
        text: 'Canceled',
        icon: 'close',
        iconColor: '#e11d48',
        barColor: '#f16b85'
      }
    default:
      return {
        bgColor: 'bg-gray-100',
        text: 'Unknown',
        icon: 'close',
        iconColor: '#4b5563',
        barColor: '#8a949f'
      }
  }
}
