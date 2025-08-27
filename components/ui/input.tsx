import { Eye, EyeOff } from 'lucide-react-native'
import * as React from 'react'
import { Platform, TextInput, type TextInputProps, TouchableOpacity, View } from 'react-native'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Icon } from './icon'

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
          'flex-row items-center rounded-xl border border-input bg-background shadow-sm shadow-black/5',
          props.editable === false &&
            cn('opacity-50', Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })),
          className
        )}
      >
        {StartIcon ? (
          <TouchableOpacity onPress={onStartIconPress} className='pl-3' disabled={!onStartIconPress}>
            {StartIcon}
          </TouchableOpacity>
        ) : null}

        <TextInput
          ref={ref}
          className={cn(
            'flex-1 h-10 px-2.5 py-1 text-base leading-5 text-foreground min-w-0 sm:h-9',
            Platform.select({
              web: cn(
                'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
              ),
              native: 'placeholder:text-muted-foreground/50 native:text-base native:leading-[1.25] native:h-11'
            })
          )}
          placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
          secureTextEntry={isPassword && !passwordVisible}
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className='pr-3'
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole='button'
          >
            {passwordVisible ? (
              <Icon as={Eye} size={20} color={PRIMARY_COLOR.LIGHT} />
            ) : (
              <Icon as={EyeOff} size={20} color={PRIMARY_COLOR.LIGHT} />
            )}
          </TouchableOpacity>
        ) : EndIcon ? (
          <TouchableOpacity onPress={onEndIconPress} className='pr-3' disabled={!onEndIconPress}>
            {EndIcon}
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }
)

Input.displayName = 'Input'

export { Input }
