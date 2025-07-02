import { useEffect } from 'react'
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { View } from 'react-native'
import RadioWrapper from '~/components/radio-wrapper'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Text } from '~/components/ui/text'
import { useGetComponentsByStyleId } from '~/features/component/hooks/use-get-components'
import { useGetDefaultPreset } from '../hooks/use-get-default-preset'

interface ComponentSectionProps<T extends FieldValues> {
  methods: UseFormReturn<T>
  styleId: string
}

export default function ComponentSection<T extends FieldValues>({ methods, styleId }: ComponentSectionProps<T>) {
  const { data: defaultPreset } = useGetDefaultPreset(styleId)
  const { data: componentsByStyle } = useGetComponentsByStyleId(styleId)

  useEffect(() => {
    if (defaultPreset) {
      defaultPreset.componentOptions.forEach((option) => {
        methods.setValue(option.componentName.toLowerCase() as Path<T>, option.id as T[Path<T>], {
          shouldDirty: false,
          shouldTouch: false
        })
      })
    }
  }, [defaultPreset, methods])

  const defaultValues = componentsByStyle?.map((component) => `item-${component.id}`) || []

  return (
    <View className='gap-2 px-4 py-2'>
      <Text className='font-inter-semibold text-xl'>Choose Component</Text>
      <Accordion
        type='multiple'
        collapsible
        className='w-full max-w-sm native:max-w-md'
        key={defaultValues.join('-')}
        defaultValue={defaultValues}
      >
        {componentsByStyle?.map((component) => (
          <AccordionItem key={component.id} value={`item-${component.id}`}>
            <AccordionTrigger>
              <Text>{component.name}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Controller
                control={methods.control}
                name={component.name.toLowerCase() as Path<T>}
                render={({ field: { value, onChange } }) => (
                  <View className='flex-row gap-2 flex-wrap'>
                    {component.options.map((option) => (
                      <RadioWrapper
                        key={option.id}
                        currentItem={option}
                        selectedValue={value}
                        onChange={() => onChange(option.id)}
                        name='id'
                      >
                        <Text>{option.name}</Text>
                      </RadioWrapper>
                    ))}
                  </View>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </View>
  )
}
