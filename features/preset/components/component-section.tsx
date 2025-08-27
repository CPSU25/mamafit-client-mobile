import { CircleCheckBig } from 'lucide-react-native'
import { useEffect } from 'react'
import { Control, Controller, FieldValues, Path, UseFormSetValue } from 'react-hook-form'
import { Image, TouchableOpacity, View } from 'react-native'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import { useGetComponentsByStyleId } from '~/features/component/hooks/use-get-components'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn, getOrderedComponentsWithOptions } from '~/lib/utils'
import { useGetDefaultPreset } from '../hooks/use-get-default-preset'

interface ComponentSectionProps<T extends FieldValues> {
  control: Control<T>
  setValue: UseFormSetValue<T>
  styleId: string
}

export default function ComponentSection<T extends FieldValues>({
  styleId,
  control,
  setValue
}: ComponentSectionProps<T>) {
  const { data: defaultPreset } = useGetDefaultPreset(styleId)
  const { data: componentsByStyle } = useGetComponentsByStyleId(styleId)

  useEffect(() => {
    if (defaultPreset) {
      defaultPreset.componentOptions.forEach((option) => {
        setValue(option.componentName.toLowerCase() as Path<T>, option.id as T[Path<T>])
      })
    }
  }, [defaultPreset, setValue])

  const defaultValues = componentsByStyle?.map((component) => `item-${component.id}`) || []

  const orderedComponents = getOrderedComponentsWithOptions(componentsByStyle ?? [])

  return (
    <View className='px-4'>
      <Accordion
        type='multiple'
        collapsible
        className='w-full max-w-sm native:max-w-md'
        key={defaultValues.join('-')}
        defaultValue={defaultValues}
      >
        {orderedComponents.map((component, index) => (
          <AccordionItem
            key={component.id}
            value={`item-${component.id}`}
            className={cn(
              index !== orderedComponents.length - 1 ? 'border-b border-border' : '',
              index === 0 ? 'border-t border-border' : ''
            )}
          >
            <AccordionTrigger>
              <Text>
                {component.name}{' '}
                <Text className='text-muted-foreground native:text-sm'>({component?.options?.length} lựa chọn)</Text>
              </Text>
            </AccordionTrigger>
            <AccordionContent>
              <Controller
                control={control}
                name={component.name.toLowerCase() as Path<T>}
                render={({ field: { value, onChange } }) => (
                  <View className='flex-row gap-4 flex-wrap'>
                    {component.options.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        className={cn('w-24 py-4 justify-center items-center gap-2 relative')}
                        onPress={() => onChange(option.id)}
                      >
                        <Image source={{ uri: option.images[0] }} className='w-16 h-16 rounded-xl' />
                        <Text className='native:text-xs text-center'>{option.name}</Text>
                        {option.id === value && (
                          <Icon
                            as={CircleCheckBig}
                            size={16}
                            color={PRIMARY_COLOR.LIGHT}
                            className='absolute top-2 left-2'
                          />
                        )}
                      </TouchableOpacity>
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
