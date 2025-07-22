import { AddOnImageConfig } from './types'

export const ADD_ON_IMAGE_CONFIG: Record<string, AddOnImageConfig> = {
  Embroidery: {
    url: require('~/assets/icons/embroidery.png'),
    color: '#FFEAF2',
    textColor: '#BE185D'
  },
  'Pattern Printing': {
    url: require('~/assets/icons/pattern-printing.png'),
    color: '#E1FBF2',
    textColor: '#10B981'
  },
  'Rhinestone Attachment': {
    url: require('~/assets/icons/rhinestone.png'),
    color: '#F3FEFA',
    textColor: '#14B8A6'
  },
  'Lace Applique': {
    url: require('~/assets/icons/lace.png'),
    color: '#E8F2FF',
    textColor: '#2563EB'
  },
  'Bead Attachment': {
    url: require('~/assets/icons/beads.png'),
    color: '#FAF8FF',
    textColor: '#7C3AED'
  },
  'Personal Tag Attachment': {
    url: require('~/assets/icons/personal-tag.png'),
    color: '#FFFBE6',
    textColor: '#EA580C'
  }
} as const

export const DEFAULT_ADD_ON_IMAGE: AddOnImageConfig = {
  url: require('~/assets/icons/more.png'),
  color: '#E6EDFF',
  textColor: '#2563EB'
} as const

export const ORDERED_SIZES = ['Small', 'Medium', 'Large', 'Full Position']

export const ORDERED_TYPES = ['TEXT', 'IMAGE', 'PATTERN']
