import { TouchableOpacity } from 'react-native'
import { cn } from '~/lib/utils'

interface RadioWrapperProps<T> {
  children: React.ReactNode
  selectedValue: string
  currentItem: T
  onChange: (item: T) => void
  name: keyof T
  activeClassName?: string
  inactiveClassName?: string
}

export default function RadioWrapper<T>({
  children,
  selectedValue,
  currentItem,
  onChange,
  name,
  activeClassName,
  inactiveClassName
}: RadioWrapperProps<T>) {
  const classNameOne = inactiveClassName ? inactiveClassName : 'bg-muted/10 border border-muted'
  const classNameTwo = activeClassName ? activeClassName : 'bg-primary/10 border border-primary'

  const handleSelect = (item: T) => {
    onChange(item)
  }

  const isSelected = () => {
    return currentItem[name] === selectedValue
  }

  return (
    <TouchableOpacity
      className={cn('rounded-xl px-4 py-2', isSelected() ? classNameTwo : classNameOne)}
      onPress={() => handleSelect(currentItem)}
    >
      {children}
    </TouchableOpacity>
  )
}
