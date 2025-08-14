import { ComponentOption } from './component-option.type'

export interface ComponentOptionWithComponent extends ComponentOption {
  componentId: string
  componentName: string
}

export interface Preset {
  id: string
  name: string
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
  sku: string | null
}

export interface PresetWithComponentOptions extends Preset {
  componentOptions: ComponentOptionWithComponent[]
}
