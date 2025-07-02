import { ComponentOption } from './component-option.type'

export interface Component {
  id: string
  name: string
  description: string
  images: string[]
  globalStatus: string
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export interface ComponentWithOptions extends Component {
  options: ComponentOption[]
}
