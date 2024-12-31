import { useScaleAvailability } from '../hooks/useScaleAvailability'

interface ScaleSelectProps {
  value: number
  onChange: (value: number) => void
  currentScale?: number
  className?: string
}

export default function ScaleSelect({ value, onChange, currentScale, className }: ScaleSelectProps) {
  const { assignedScales, loading } = useScaleAvailability(currentScale)

  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={loading}
      className={className}
      required
    >
      <option value="">Select a scale</option>
      {[1, 2, 3, 4].map((num) => {
        const isAssigned = assignedScales.includes(num)
        const isCurrent = num === currentScale
        return (
          <option 
            key={num} 
            value={num}
            disabled={isAssigned && !isCurrent}
          >
            Scale {num} {isAssigned && !isCurrent ? '(In use)' : ''}
          </option>
        )
      })}
    </select>
  )
}