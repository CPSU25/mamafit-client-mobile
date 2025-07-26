import { Appointment } from '~/types/appointment.type'

export interface DateRange {
  date: string
  from: Date
  to: Date
}

export interface SectionData {
  type: 'header' | 'item'
  data: DateRange | Appointment
}
