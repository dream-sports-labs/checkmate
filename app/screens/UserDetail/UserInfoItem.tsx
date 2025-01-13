import {Tooltip} from '@components/Tooltip/Tooltip'
import {Copy} from 'lucide-react'
import {useState} from 'react'
import {styles} from './style'

const UserInfoItem = (param: {title: string; value?: string}) => {
  if (!param.value) return null

  const [tooltipText, setTooltipText] = useState('Click to copy')

  const handleCopy = () => {
    if (param?.value) {
      navigator.clipboard.writeText(param.value).then(
        () => {
          setTooltipText('Copied')
          setTimeout(() => {
            setTooltipText('Click to copy')
          }, 1500)
        },
        () => {
          setTooltipText('Failed to copy')
        },
      )
    }
  }

  return (
    <div style={styles.infoItem}>
      <strong>{param.title}</strong>
      <div style={styles.valueContainer}>
        <span>{param.value}</span>
        <Tooltip
          anchor={
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Copy
                onClick={handleCopy}
                size={16}
                style={{cursor: 'pointer'}}
              />
            </div>
          }
          content={tooltipText}
        />
      </div>
    </div>
  )
}

export default UserInfoItem
