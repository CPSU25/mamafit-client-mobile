import { differenceInWeeks, parseISO } from 'date-fns'
import { z } from 'zod'

const validateMeasurement = (
  value: string,
  fieldName: string,
  min: number,
  max: number,
  path: string,
  ctx: z.RefinementCtx
) => {
  const num = value === '' ? NaN : Number(value)
  if (isNaN(num)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} must be a number`,
      path: [path]
    })
  } else if (num < min || num > max) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} must be between ${min} and ${max} cm`,
      path: [path]
    })
  } else if (value.includes('.') && value.split('.')[1].length > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} can have maximum 1 decimal place`,
      path: [path]
    })
  }
}

const bmiValidation = (weight: string, height: string, ctx: z.RefinementCtx) => {
  const weightForBmi = Number(weight)
  const heightForBmi = Number(height) / 100
  if (!isNaN(weightForBmi) && !isNaN(heightForBmi) && heightForBmi > 0) {
    const bmi = weightForBmi / (heightForBmi * heightForBmi)
    if (bmi < 16 || bmi > 45) {
      ctx.addIssue({
        code: 'custom',
        message: 'Weight and height combination is not realistic (BMI must be between 16 and 45)'
      })
    }
  }
}

export const personalInfoFormOutput = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    weight: z.string().min(1, { message: 'Weight is required' }),
    height: z.string().min(1, { message: 'Height is required' }),
    age: z.string({ message: 'Age is required' }).min(1, { message: 'Age is required' })
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
    bmiValidation(data.weight, data.height, ctx)

    // Age validation
    const age = data.age === '' ? NaN : Number(data.age)
    if (isNaN(age)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age must be a number', path: ['age'] })
    } else if (age < 18 || age > 55) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age must be 18-55 years old', path: ['age'] })
    } else if (!Number.isInteger(age)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age must be an integer', path: ['age'] })
    }
  })
  .transform((data) => ({
    ...data,
    age: Number(data.age),
    weight: Number(data.weight),
    height: Number(data.height)
  }))

export const pregnancyInfoFormOutput = z
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
    averageMenstrualCycle: z.string(),
    ultrasoundDate: z.string().nullable().optional(),
    weeksFromUltrasound: z.string()
    // dueDateFromUltrasound: z.string().nullable().optional()
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
    // if (data.dueDateFromUltrasound) {
    //   const dueDateFromUltrasound = parseISO(data.dueDateFromUltrasound)
    //   if (isNaN(dueDateFromUltrasound.getTime())) {
    //     ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid due date', path: ['dueDateFromUltrasound'] })
    //   } else if (dueDateFromUltrasound < today) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: "Due date can't be in the past",
    //       path: ['dueDateFromUltrasound']
    //     })
    //   }
    // }

    // Due date consistency with first date of last period
    // if (data.firstDateOfLastPeriod && data.dueDateFromUltrasound) {
    //   const firstDate = parseISO(data.firstDateOfLastPeriod)
    //   const dueDate = parseISO(data.dueDateFromUltrasound)
    //   if (!isNaN(firstDate.getTime()) && !isNaN(dueDate.getTime())) {
    //     const weeksDiff = differenceInWeeks(dueDate, firstDate)
    //     if (weeksDiff < 38 || weeksDiff > 42) {
    //       ctx.addIssue({
    //         code: z.ZodIssueCode.custom,
    //         message: 'Due date must be 38-42 weeks from last period',
    //         path: ['dueDateFromUltrasound']
    //       })
    //     }
    //   }
    // }

    // Weeks from ultrasound consistency with dates
    // if (data.ultrasoundDate && data.weeksFromUltrasound && data.dueDateFromUltrasound) {
    //   const ultrasoundDate = parseISO(data.ultrasoundDate)
    //   const dueDate = parseISO(data.dueDateFromUltrasound)
    //   const weeksFromUltrasoundNum = Number(data.weeksFromUltrasound)
    //   if (!isNaN(ultrasoundDate.getTime()) && !isNaN(dueDate.getTime()) && !isNaN(weeksFromUltrasoundNum)) {
    //     const weeksToDueDate = differenceInWeeks(dueDate, ultrasoundDate)
    //     const expectedWeeksToDueDate = 40 - weeksFromUltrasoundNum
    //     if (Math.abs(weeksToDueDate - expectedWeeksToDueDate) > 2) {
    //       ctx.addIssue({
    //         code: z.ZodIssueCode.custom,
    //         message: "Weeks don't match dates",
    //         path: ['weeksFromUltrasound']
    //       })
    //     }
    //   }
    // }

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
    // if (data.ultrasoundDate && data.dueDateFromUltrasound) {
    //   const ultrasoundDate = parseISO(data.ultrasoundDate)
    //   const dueDate = parseISO(data.dueDateFromUltrasound)
    //   if (!isNaN(ultrasoundDate.getTime()) && !isNaN(dueDate.getTime()) && ultrasoundDate >= dueDate) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: "Ultrasound can't be on or after due date",
    //       path: ['ultrasoundDate']
    //     })
    //   }
    // }
  })
  .transform((data) => ({
    ...data,
    firstDateOfLastPeriod: parseISO(data.firstDateOfLastPeriod).toISOString(),
    ultrasoundDate: data.ultrasoundDate ? parseISO(data.ultrasoundDate).toISOString() : null,
    averageMenstrualCycle: data.averageMenstrualCycle ? Number(data.averageMenstrualCycle) : 0,
    weeksFromUltrasound: data.weeksFromUltrasound ? Number(data.weeksFromUltrasound) : 0,
    bust: Number(data.bust),
    waist: Number(data.waist),
    hip: Number(data.hip),
    numberOfPregnancy: Number(data.numberOfPregnancy)
  }))

export const measurementsFormOutput = z
  .object({
    // Pregnancy status
    weekOfPregnancy: z.string().min(1, { message: 'Gestational age is required' }),
    weight: z.string().min(1, { message: 'Weight is required' }),
    bust: z.string().min(1, { message: 'Bust measurement is required' }),
    waist: z.string().min(1, { message: 'Waist measurement is required' }),
    hip: z.string().min(1, { message: 'Hip measurement is required' }),

    // Upper body measurements
    neck: z.string().min(1, { message: 'Neck measurement is required' }),
    coat: z.string().min(1, { message: 'Coat measurement is required' }),
    chestAround: z.string().min(1, { message: 'Chest around measurement is required' }),
    shoulderWidth: z.string().min(1, { message: 'Shoulder width measurement is required' }),

    // Core & waist measurements
    stomach: z.string().min(1, { message: 'Stomach measurement is required' }),
    pantsWaist: z.string().min(1, { message: 'Pants waist measurement is required' }),

    // Lower body measurements
    thigh: z.string().min(1, { message: 'Thigh measurement is required' }),
    legLength: z.string().min(1, { message: 'Leg length measurement is required' }),

    // Garment specific measurements
    dressLength: z.string().min(1, { message: 'Dress length measurement is required' }),
    sleeveLength: z.string().min(1, { message: 'Sleeve length measurement is required' })
  })
  .superRefine((data, ctx) => {
    // Week of pregnancy validation
    const weekOfPregnancyNum = data.weekOfPregnancy === '' ? NaN : Number(data.weekOfPregnancy)
    if (isNaN(weekOfPregnancyNum)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Gestational age must be a number',
        path: ['weekOfPregnancy']
      })
    } else if (!Number.isInteger(weekOfPregnancyNum)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Gestational age must be an integer',
        path: ['weekOfPregnancy']
      })
    } else if (weekOfPregnancyNum < 1 || weekOfPregnancyNum > 42) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Gestational age must be between 1 and 42 weeks',
        path: ['weekOfPregnancy']
      })
    }

    // Body measurements validation
    validateMeasurement(data.bust, 'Bust', 60, 120, 'bust', ctx)
    validateMeasurement(data.waist, 'Waist', 60, 150, 'waist', ctx)
    validateMeasurement(data.hip, 'Hip', 60, 120, 'hip', ctx)
    validateMeasurement(data.weight, 'Weight', 20, 200, 'weight', ctx)

    // FIXME: Finalize these validations
    // Upper body measurements validation
    // validateMeasurement(data.neck, 'Neck', 25, 50, 'neck')
    // validateMeasurement(data.coat, 'Coat', 40, 80, 'coat')
    // validateMeasurement(data.chestAround, 'Chest around', 60, 150, 'chestAround')
    // validateMeasurement(data.shoulderWidth, 'Shoulder width', 30, 60, 'shoulderWidth')

    // Core & waist measurements validation
    // validateMeasurement(data.stomach, 'Stomach', 50, 150, 'stomach')
    // validateMeasurement(data.pantsWaist, 'Pants waist', 50, 150, 'pantsWaist')

    // Lower body measurements validation
    // validateMeasurement(data.thigh, 'Thigh', 40, 80, 'thigh')
    // validateMeasurement(data.legLength, 'Leg length', 60, 120, 'legLength')

    // Garment specific measurements validation
    // validateMeasurement(data.dressLength, 'Dress length', 60, 150, 'dressLength')
    // validateMeasurement(data.sleeveLength, 'Sleeve length', 40, 80, 'sleeveLength')
  })
  .transform((data) => ({
    weekOfPregnancy: Number(data.weekOfPregnancy),
    weight: Number(data.weight),
    bust: Number(data.bust),
    waist: Number(data.waist),
    hip: Number(data.hip),
    neck: Number(data.neck),
    coat: Number(data.coat),
    chestAround: Number(data.chestAround),
    shoulderWidth: Number(data.shoulderWidth),
    stomach: Number(data.stomach),
    pantsWaist: Number(data.pantsWaist),
    thigh: Number(data.thigh),
    legLength: Number(data.legLength),
    dressLength: Number(data.dressLength),
    sleeveLength: Number(data.sleeveLength)
  }))

export const previewMeasurementFormOutput = z
  .object({
    measurementDiaryId: z.string().min(1, { message: 'Measurement diary id is required' }),
    weight: z.string().min(1, { message: 'Weight is required' }),
    bust: z.string().min(1, { message: 'Bust measurement is required' }),
    waist: z.string().min(1, { message: 'Waist measurement is required' }),
    hip: z.string().min(1, { message: 'Hip measurement is required' })
  })
  .superRefine((data, ctx) => {
    // Body measurements validation
    validateMeasurement(data.bust, 'Bust', 60, 120, 'bust', ctx)
    validateMeasurement(data.waist, 'Waist', 60, 150, 'waist', ctx)
    validateMeasurement(data.hip, 'Hip', 60, 120, 'hip', ctx)
    validateMeasurement(data.weight, 'Weight', 20, 200, 'weight', ctx)
  })
  .transform((data) => ({
    measurementDiaryId: data.measurementDiaryId,
    weight: Number(data.weight),
    bust: Number(data.bust),
    waist: Number(data.waist),
    hip: Number(data.hip)
  }))

// Input types (before transform) - for forms
export type PersonalInfoFormInput = z.input<typeof personalInfoFormOutput>
export type PregnancyInfoFormInput = z.input<typeof pregnancyInfoFormOutput>
export type MeasurementsFormInput = z.input<typeof measurementsFormOutput>
export type PreviewMeasurementFormInput = z.input<typeof previewMeasurementFormOutput>

// Output types (after transform) - for API/processing
export type PersonalInfoFormOutput = z.output<typeof personalInfoFormOutput>
export type PregnancyInfoFormOutput = z.output<typeof pregnancyInfoFormOutput>
export type MeasurementsFormOutput = z.output<typeof measurementsFormOutput>
export type PreviewMeasurementFormOutput = z.output<typeof previewMeasurementFormOutput>
