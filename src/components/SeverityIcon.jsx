import { ChevronDown, ChevronUp, Info, Minus } from 'lucide-react'

const config = {
  Blocker: { icon: Minus, bg: '#d98890', fg: '#fff' },
  High: { icon: ChevronUp, bg: '#e0a28a', fg: '#fff' },
  Medium: { icon: ChevronUp, bg: '#e8b8a4', fg: '#fff' },
  Low: { icon: ChevronDown, bg: '#e5d68f', fg: '#5c5426' },
  Info: { icon: Info, bg: '#9fc3e8', fg: '#29425f' },
}

export function SeverityIcon({ severity, size = 16 }) {
  const { icon: Icon, bg, fg } = config[severity] ?? config.Info
  return (
    <span
      className="severity-icon"
      style={{ background: bg, color: fg, width: size, height: size }}
      aria-hidden="true"
    >
      <Icon size={size * 0.7} strokeWidth={3} />
    </span>
  )
}
