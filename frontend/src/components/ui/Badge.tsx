interface BadgeProps {
  label: string
  bg: string
  color: string
  size?: 'sm' | 'xs'
}

export function Badge({ label, bg, color, size = 'xs' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded font-semibold ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'}`}
      style={{ background: bg, color }}
    >
      {label}
    </span>
  )
}
