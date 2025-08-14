import { WarrantyRequestStatus } from '~/types/order.type'

export const requestStatusMap: Record<WarrantyRequestStatus, { text: string; color: string; backgroundColor: string }> =
  {
    [WarrantyRequestStatus.Pending]: {
      text: 'Pending',
      color: '#2c56c4',
      backgroundColor: '#edf7ff'
    },
    [WarrantyRequestStatus.Repairing]: {
      text: 'Repairing',
      color: '#c46b21',
      backgroundColor: '#fff9df'
    },
    [WarrantyRequestStatus.Completed]: {
      text: 'Completed',
      color: '#1d944a',
      backgroundColor: '#d4fbe3'
    },
    [WarrantyRequestStatus.Approved]: {
      text: 'Approved',
      color: '#1d944a',
      backgroundColor: '#d4fbe3'
    },
    [WarrantyRequestStatus.Rejected]: {
      text: 'Rejected',
      color: '#e14a4a',
      backgroundColor: '#fee6e6'
    },
    [WarrantyRequestStatus.PartiallyRejected]: {
      text: 'Partially Rejected',
      color: '#c46b21',
      backgroundColor: '#fff9df'
    },
    [WarrantyRequestStatus.Cancelled]: {
      text: 'Cancelled',
      color: '#e14a4a',
      backgroundColor: '#fee6e6'
    }
  }
