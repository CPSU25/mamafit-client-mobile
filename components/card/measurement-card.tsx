import { getShadowStyles, styles } from '~/lib/constants/constants'
import { Card } from '../ui/card'
import { Text } from '../ui/text'

export default function MeasurementCard() {
  return (
    <Card className='p-2' style={[styles.container, getShadowStyles()]}>
      <Text>MeasurementCard</Text>
    </Card>
  )
}
