import { differenceInWeeks, differenceInYears, parseISO } from 'date-fns'
import { z } from 'zod'

const getAge = (date: Date) => {
  const today = new Date()
  return differenceInYears(today, date)
}

export const personalInfoFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    weight: z.string().min(1, { message: 'Weight is required' }),
    height: z.string().min(1, { message: 'Height is required' }),
    dateOfBirth: z.string({ message: 'Date of birth is required' }).min(1, { message: 'Date of birth is required' })
  })
  .superRefine((data, ctx) => {
    // Weight validation
    const weightNum = data.weight === '' ? NaN : Number(data.weight)

    if (isNaN(weightNum)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weight must be a number',
        path: ['weight']
      })
    } else if (weightNum < 20 || weightNum > 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weight must be between 20 and 200 kg',
        path: ['weight']
      })
    }

    // Height validation
    const heightNum = data.height === '' ? NaN : Number(data.height)

    if (isNaN(heightNum)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Height must be a number',
        path: ['height']
      })
    } else if (heightNum < 100 || heightNum > 220) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Height must be between 100 and 220 cm',
        path: ['height']
      })
    }

    // BMI validation
    const weightForBmi = Number(data.weight)
    const heightForBmi = Number(data.height) / 100
    if (!isNaN(weightForBmi) && !isNaN(heightForBmi) && heightForBmi > 0) {
      const bmi = weightForBmi / (heightForBmi * heightForBmi)
      if (bmi < 16 || bmi > 45) {
        ctx.addIssue({
          code: 'custom',
          message: 'Weight and height combination is not realistic (BMI must be between 16 and 45)'
        })
      }
    }

    // Date of birth validation
    try {
      const dateOfBirth = parseISO(data.dateOfBirth)

      if (getAge(dateOfBirth) < 18 || getAge(dateOfBirth) > 55) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'You must be between 18 and 55 years old',
          path: ['dateOfBirth']
        })
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date of birth is invalid',
        path: ['dateOfBirth']
      })
    }
  })

export const pregnancyInfoFormSchema = z
  .object({
    firstDateOfLastPeriod: z
      .string({
        message: 'Last period date required'
      })
      .min(1, { message: 'Last period date required' }),
    bust: z.string({ message: 'Bust required' }).min(1, { message: 'Bust required' }),
    waist: z.string({ message: 'Waist required' }).min(1, { message: 'Waist required' }),
    hip: z.string({ message: 'Hip required' }).min(1, { message: 'Hip required' }),
    numberOfPregnancy: z.string().min(1, { message: 'Pregnancy count required' }),
    averageMenstrualCycle: z.string().nullable().optional(),
    ultrasoundDate: z.string().nullable().optional(),
    weeksFromUltrasound: z.string().nullable().optional(),
    dueDateFromUltrasound: z.string().nullable().optional()
  })
  .superRefine((data, ctx) => {
    // First date of last period validation
    const firstDateOfLastPeriod = parseISO(data.firstDateOfLastPeriod)
    const today = new Date()
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(today.getFullYear() - 1)

    if (isNaN(firstDateOfLastPeriod.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid last period date',
        path: ['firstDateOfLastPeriod']
      })
    } else if (firstDateOfLastPeriod > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Last period date can't be in the future",
        path: ['firstDateOfLastPeriod']
      })
    } else if (firstDateOfLastPeriod < oneYearAgo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Last period must be within 12 months',
        path: ['firstDateOfLastPeriod']
      })
    } else {
      const pregnancyWeeks = differenceInWeeks(today, firstDateOfLastPeriod)
      if (pregnancyWeeks > 42) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pregnancy duration over 42 weeks',
          path: ['firstDateOfLastPeriod']
        })
      }
    }

    // Bust validation
    const bustNum = data.bust === '' ? NaN : Number(data.bust)
    if (isNaN(bustNum)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Bust must be a number', path: ['bust'] })
    } else if (bustNum < 60 || bustNum > 120) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Bust must be 60-120 cm', path: ['bust'] })
    } else if (data.bust.includes('.') && data.bust.split('.')[1].length > 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Bust max 2 decimals', path: ['bust'] })
    }

    // Waist validation
    const waistNum = data.waist === '' ? NaN : Number(data.waist)
    if (isNaN(waistNum)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Waist must be a number', path: ['waist'] })
    } else if (waistNum < 60 || waistNum > 150) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Waist must be 60-150 cm', path: ['waist'] })
    } else if (data.waist.includes('.') && data.waist.split('.')[1].length > 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Waist max 2 decimals', path: ['waist'] })
    }

    // Hip validation
    const hipNum = data.hip === '' ? NaN : Number(data.hip)
    if (isNaN(hipNum)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hip must be a number', path: ['hip'] })
    } else if (hipNum < 60 || hipNum > 120) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hip must be 60-120 cm', path: ['hip'] })
    } else if (data.hip.includes('.') && data.hip.split('.')[1].length > 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Hip max 2 decimals', path: ['hip'] })
    }

    // Number of pregnancy validation
    const numberOfPregnancyNum = data.numberOfPregnancy === '' ? NaN : Number(data.numberOfPregnancy)
    if (isNaN(numberOfPregnancyNum)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pregnancy count must be a number',
        path: ['numberOfPregnancy']
      })
    } else if (!Number.isInteger(numberOfPregnancyNum)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pregnancy count must be an integer',
        path: ['numberOfPregnancy']
      })
    } else if (numberOfPregnancyNum < 1 || numberOfPregnancyNum > 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pregnancy count must be 1-10',
        path: ['numberOfPregnancy']
      })
    }

    // Average menstrual cycle validation
    if (data.averageMenstrualCycle) {
      const averageMenstrualCycleNum = Number(data.averageMenstrualCycle)
      if (isNaN(averageMenstrualCycleNum)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cycle must be a number',
          path: ['averageMenstrualCycle']
        })
      } else if (averageMenstrualCycleNum < 20 || averageMenstrualCycleNum > 40) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cycle must be 20-40 days',
          path: ['averageMenstrualCycle']
        })
      }
    }

    // Ultrasound date validation
    if (data.ultrasoundDate) {
      const ultrasoundDate = parseISO(data.ultrasoundDate)
      if (isNaN(ultrasoundDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid ultrasound date',
          path: ['ultrasoundDate']
        })
      } else if (ultrasoundDate > today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ultrasound can't be in the future",
          path: ['ultrasoundDate']
        })
      } else if (
        firstDateOfLastPeriod &&
        !isNaN(firstDateOfLastPeriod.getTime()) &&
        ultrasoundDate < firstDateOfLastPeriod
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ultrasound before last period',
          path: ['ultrasoundDate']
        })
      }
    }

    // Weeks from ultrasound requirement
    if (data.ultrasoundDate && !data.weeksFromUltrasound) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weeks from ultrasound required when ultrasound date is provided',
        path: ['weeksFromUltrasound']
      })
    }

    // Ultrasound date requirement
    if (!data.ultrasoundDate && data.weeksFromUltrasound) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ultrasound date required when weeks from ultrasound is provided',
        path: ['ultrasoundDate']
      })
    }

    // Weeks from ultrasound validation
    if (data.weeksFromUltrasound) {
      const weeksFromUltrasoundNum = Number(data.weeksFromUltrasound)
      if (isNaN(weeksFromUltrasoundNum)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Weeks must be a number',
          path: ['weeksFromUltrasound']
        })
      } else if (weeksFromUltrasoundNum < 1 || weeksFromUltrasoundNum > 42) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Weeks must be 1-42',
          path: ['weeksFromUltrasound']
        })
      }
    }

    // Due date from ultrasound validation
    if (data.dueDateFromUltrasound) {
      const dueDateFromUltrasound = parseISO(data.dueDateFromUltrasound)
      if (isNaN(dueDateFromUltrasound.getTime())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid due date', path: ['dueDateFromUltrasound'] })
      } else if (dueDateFromUltrasound < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Due date can't be in the past",
          path: ['dueDateFromUltrasound']
        })
      }
    }

    // Due date consistency with first date of last period
    if (data.firstDateOfLastPeriod && data.dueDateFromUltrasound) {
      const firstDate = parseISO(data.firstDateOfLastPeriod)
      const dueDate = parseISO(data.dueDateFromUltrasound)
      if (!isNaN(firstDate.getTime()) && !isNaN(dueDate.getTime())) {
        const weeksDiff = differenceInWeeks(dueDate, firstDate)
        if (weeksDiff < 38 || weeksDiff > 42) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Due date must be 38-42 weeks from last period',
            path: ['dueDateFromUltrasound']
          })
        }
      }
    }

    // Weeks from ultrasound consistency with dates
    if (data.ultrasoundDate && data.weeksFromUltrasound && data.dueDateFromUltrasound) {
      const ultrasoundDate = parseISO(data.ultrasoundDate)
      const dueDate = parseISO(data.dueDateFromUltrasound)
      const weeksFromUltrasoundNum = Number(data.weeksFromUltrasound)
      if (!isNaN(ultrasoundDate.getTime()) && !isNaN(dueDate.getTime()) && !isNaN(weeksFromUltrasoundNum)) {
        const weeksToDueDate = differenceInWeeks(dueDate, ultrasoundDate)
        const expectedWeeksToDueDate = 40 - weeksFromUltrasoundNum
        if (Math.abs(weeksToDueDate - expectedWeeksToDueDate) > 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Weeks don't match dates",
            path: ['weeksFromUltrasound']
          })
        }
      }
    }

    // Consistency between firstDateOfLastPeriod, ultrasoundDate, and weeksFromUltrasound
    if (data.firstDateOfLastPeriod && data.ultrasoundDate && data.weeksFromUltrasound) {
      const firstDate = parseISO(data.firstDateOfLastPeriod)
      const ultrasoundDate = parseISO(data.ultrasoundDate)
      const weeksFromUltrasoundNum = Number(data.weeksFromUltrasound)
      if (!isNaN(firstDate.getTime()) && !isNaN(ultrasoundDate.getTime()) && !isNaN(weeksFromUltrasoundNum)) {
        const weeksBetween = differenceInWeeks(ultrasoundDate, firstDate)
        if (Math.abs(weeksBetween - weeksFromUltrasoundNum) > 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Weeks don't match first date of last period",
            path: ['weeksFromUltrasound']
          })
        }
      }
    }

    // Ensure ultrasoundDate is before dueDateFromUltrasound
    if (data.ultrasoundDate && data.dueDateFromUltrasound) {
      const ultrasoundDate = parseISO(data.ultrasoundDate)
      const dueDate = parseISO(data.dueDateFromUltrasound)
      if (!isNaN(ultrasoundDate.getTime()) && !isNaN(dueDate.getTime()) && ultrasoundDate >= dueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ultrasound can't be on or after due date",
          path: ['ultrasoundDate']
        })
      }
    }
  })

export type PersonalInfoFormSchema = z.infer<typeof personalInfoFormSchema>
export type PregnancyInfoFormSchema = z.infer<typeof pregnancyInfoFormSchema>
