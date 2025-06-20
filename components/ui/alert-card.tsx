import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { cn } from '~/lib/utils'
import { Text } from './text'

type AlertVariant = 'warning' | 'info' | 'success' | 'error' | 'tip'

interface AlertCardProps {
  variant?: AlertVariant
  title: string
  description?: string
  icon?: keyof typeof FontAwesome.glyphMap
  children?: React.ReactNode
  delay?: number
  className?: string
}

const variantConfig = {
  warning: {
    icon: 'exclamation-triangle' as const,
    lightColors: {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-600',
      iconColor: '#d97706'
    },
    darkColors: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-900',
      text: 'text-amber-500',
      iconColor: '#f59e0b'
    }
  },
  info: {
    icon: 'info-circle' as const,
    lightColors: {
      bg: 'bg-sky-500/20',
      border: 'border-sky-500/30',
      text: 'text-sky-600',
      iconColor: '#2563eb'
    },
    darkColors: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-900',
      text: 'text-sky-500',
      iconColor: '#3b82f6'
    }
  },
  success: {
    icon: 'check-circle' as const,
    lightColors: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-600',
      iconColor: '#059669'
    },
    darkColors: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-900',
      text: 'text-emerald-500',
      iconColor: '#10b981'
    }
  },
  error: {
    icon: 'times-circle' as const,
    lightColors: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-600',
      iconColor: '#dc2626'
    },
    darkColors: {
      bg: 'bg-red-500/10',
      border: 'border-red-900',
      text: 'text-red-500',
      iconColor: '#ef4444'
    }
  },
  tip: {
    icon: 'lightbulb-o' as const,
    lightColors: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-600',
      iconColor: '#059669'
    },
    darkColors: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-900',
      text: 'text-emerald-500',
      iconColor: '#10b981'
    }
  }
}

export function AlertCard({
  variant = 'info',
  title,
  description,
  icon,
  children,
  delay = 100,
  className
}: AlertCardProps) {
  const { isDarkColorScheme } = useColorScheme()
  const config = variantConfig[variant]
  const colors = isDarkColorScheme ? config.darkColors : config.lightColors
  const iconName = icon || config.icon

  return (
    <Animated.View
      entering={FadeInDown.delay(delay)}
      className={cn('border rounded-2xl p-3 border-dashed flex flex-col', colors.bg, colors.border, className)}
    >
      <View className='flex flex-row items-center gap-3'>
        <FontAwesome name={iconName} size={16} color={colors.iconColor} />
        <View className='flex flex-col gap-0.5 flex-shrink'>
          <Text className={cn('font-inter-semibold', colors.text)}>{title}</Text>
        </View>
      </View>

      {description && <Text className={cn('text-xs', colors.text)}>{description}</Text>}

      {children && <View className='mt-0.5'>{children}</View>}
    </Animated.View>
  )
}

export function WarningCard(props: Omit<AlertCardProps, 'variant'>) {
  return <AlertCard variant='warning' {...props} />
}

export function InfoCard(props: Omit<AlertCardProps, 'variant'>) {
  return <AlertCard variant='info' {...props} />
}

export function SuccessCard(props: Omit<AlertCardProps, 'variant'>) {
  return <AlertCard variant='success' {...props} />
}

export function ErrorCard(props: Omit<AlertCardProps, 'variant'>) {
  return <AlertCard variant='error' {...props} />
}

export function TipCard(props: Omit<AlertCardProps, 'variant'>) {
  return <AlertCard variant='tip' {...props} />
}
