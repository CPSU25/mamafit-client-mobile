import { Feather } from '@expo/vector-icons'
import * as React from 'react'
import { TextInput, type TextInputProps, TouchableOpacity, View } from 'react-native'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'

export interface InputProps extends TextInputProps {
  StartIcon?: React.ReactNode
  EndIcon?: React.ReactNode
  placeholderClassName?: string
  onStartIconPress?: () => void
  onEndIconPress?: () => void
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      className,
      placeholderClassName,
      StartIcon,
      EndIcon,
      secureTextEntry,
      onStartIconPress,
      onEndIconPress,
      ...props
    },
    ref
  ) => {
    const [passwordVisible, setPasswordVisible] = React.useState(false)
    const isPassword = secureTextEntry

    const togglePasswordVisibility = () => {
      setPasswordVisible((prev) => !prev)
    }

    return (
      <View
        className={cn(
          'flex-row items-center rounded-2xl border border-input bg-background',
          props.editable === false && 'opacity-50 web:cursor-not-allowed',
          className
        )}
      >
        {StartIcon && (
          <TouchableOpacity onPress={onStartIconPress} className='pl-3'>
            {StartIcon}
          </TouchableOpacity>
        )}
        <TextInput
          ref={ref}
          className={cn(
            'flex-1 h-10 native:h-12 px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
          )}
          placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
          secureTextEntry={isPassword && !passwordVisible}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity onPress={togglePasswordVisibility} className='pr-3'>
            {passwordVisible ? (
              <Feather name='eye' size={20} color={PRIMARY_COLOR.LIGHT} />
            ) : (
              <Feather name='eye-off' size={20} color={PRIMARY_COLOR.LIGHT} />
            )}
          </TouchableOpacity>
        ) : EndIcon ? (
          <TouchableOpacity onPress={onEndIconPress} className='pr-3'>
            {EndIcon}
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }
)

Input.displayName = 'Input'

export { Input }
