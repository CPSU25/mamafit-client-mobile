import { PersonalInfoFormOutput, PregnancyInfoFormOutput } from '~/features/diary/validations'

export interface Diary {
  id: string
  age: number
  averageMenstrualCycle: number
  bust: number
  createdAt: string
  createdBy: string
  firstDateOfLastPeriod: string
  height: number
  hip: number
  name: string
  numberOfPregnancy: number
  pregnancyStartDate: string
  ultrasoundDate: string
  updatedAt: string
  updatedBy: string
  userId: string
  waist: number
  weeksFromUltrasound: number
  weight: number
}

export interface DiaryDetail extends Diary {
  measurements: Measurement[]
}

export interface Measurement {
  id: string
  bust: number
  chestAround: number
  coat: number
  dressLength: number
  hip: number
  legLength: number
  neck: number
  pantsWaist: number
  shoulderWidth: number
  sleeveLength: number
  stomach: number
  thigh: number
  waist: number
  weekOfPregnancy: number
  weight: number
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

export type PreviewDiaryInput = PersonalInfoFormOutput & PregnancyInfoFormOutput

export type CreateDiaryInput = {
  diary: PreviewDiaryInput
  measurement: Partial<Measurement>
}

export interface GetDiaryDetailFilters {
  diaryId: string
  startDate?: string
  endDate?: string
}

export interface EditMeasurementDetailInput {
  weight: number
  neck: number
  coat: number
  bust: number
  chestAround: number
  stomach: number
  pantsWaist: number
  thigh: number
  dressLength: number
  sleeveLength: number
  shoulderWidth: number
  waist: number
  legLength: number
  hip: number
}
