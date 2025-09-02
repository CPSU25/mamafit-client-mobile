import { useQuery } from '@tanstack/react-query'
import dressService from '~/services/dress.service'

export const useAutocomplete = (search: string) => {
  return useQuery({
    queryKey: ['autocomplete', search],
    queryFn: () => dressService.getAutocomplete(search),
    enabled: !!search
  })
}
