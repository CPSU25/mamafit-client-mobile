import { differenceInYears, parseISO } from 'date-fns'
import { z } from 'zod'

export const personalInfoFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    weight: z.string().min(1, { message: 'Weight is required' }),
    height: z.string().min(1, { message: 'Height is required' }),
    dateOfBirth: z.string().min(1, { message: 'Date of birth is required' })
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
      const today = new Date()
      const age = differenceInYears(today, dateOfBirth)

      if (age < 18 || age > 55) {
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

export type PersonalInfoFormSchema = z.infer<typeof personalInfoFormSchema>
