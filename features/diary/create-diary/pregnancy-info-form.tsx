import { Feather } from '@expo/vector-icons'
import { View } from 'react-native'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function PregnancyInfoForm() {
  return (
    <View className='flex flex-col gap-4'>
      <View className='flex flex-col gap-2 mt-4'>
        <Text className='font-inter-medium text-lg'>Additional Details for Accuracy</Text>
        <Text className='text-muted-foreground text-sm'>
          Provide extra information to help ensure more accurate results or recommendations.
        </Text>
      </View>

      <Accordion type='single' collapsible className='w-full max-w-sm native:max-w-md'>
        <AccordionItem value='body-measurements'>
          <AccordionTrigger>
            <Text className='font-inter-medium'>Body Measurements</Text>
          </AccordionTrigger>
          <AccordionContent>
            <View className='flex flex-col gap-4'>
              <Input
                placeholder='Bust circumference (cm)'
                keyboardType='numeric'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
              />
              <Input
                placeholder='Waist circumference (cm)'
                keyboardType='numeric'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
              />
              <Input
                placeholder='Hip circumference (cm)'
                keyboardType='numeric'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
              />
            </View>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='menstrual-cycle'>
          <AccordionTrigger>
            <Text className='font-inter-medium'>Menstrual Cycle</Text>
          </AccordionTrigger>
          <AccordionContent>
            <View className='flex flex-col gap-4'>
              <Input
                placeholder='Previous pregnancies'
                keyboardType='numeric'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
              />
              <Input
                placeholder='Average cycle length (days)'
                keyboardType='numeric'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
              />
            </View>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='ultrasound'>
          <AccordionTrigger>
            <Text className='font-inter-medium'>Ultrasound</Text>
          </AccordionTrigger>
          <AccordionContent>
            <View className='flex flex-col gap-4'>
              <Input
                placeholder='Ultrasound date'
                keyboardType='default'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
              />
              <Input
                placeholder='Weeks from ultrasound'
                keyboardType='numeric'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
              />
              <Input
                placeholder='Due date from ultrasound'
                keyboardType='default'
                StartIcon={<Feather name='info' size={20} color={PRIMARY_COLOR.LIGHT} />}
              />
            </View>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  )
}
