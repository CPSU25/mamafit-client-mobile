import { PersonalInfoFormOutput, PregnancyInfoFormOutput } from '~/features/diary/create-diary/validations'

export interface PreviewDiaryResponse {
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
}

export type PreviewDiaryInput = PersonalInfoFormOutput & PregnancyInfoFormOutput

export type CreateDiaryInput = {
  diary: PreviewDiaryInput
  measurement: PreviewDiaryResponse
}
