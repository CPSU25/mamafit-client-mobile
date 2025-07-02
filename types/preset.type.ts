import { ComponentOption } from './component-option.type'

interface ComponentOptionWithComponent extends ComponentOption {
  componentId: string
  componentName: string
}

export interface Preset {
  id: string
  styleId: string
  styleName: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string | null
  images: string[]
  type: string
  isDefault: boolean
  price: number
}

export interface PresetWithComponentOptions extends Preset {
  componentOptions: ComponentOptionWithComponent[]
}
