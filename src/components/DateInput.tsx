import { getTodayString } from '../lib/utils/dates'

interface DateInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function DateInput({ value, onChange, className }: DateInputProps) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={getTodayString()}
      className={className}
      required
    />
  )
}