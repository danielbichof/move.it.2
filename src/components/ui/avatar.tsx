interface AvatarProps {
  name: string
  size?: number
  className?: string
}

// Círculo com a inicial do nome; sem nome vira só o disco
export default function Avatar({ name, size = 30, className = '' }: AvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white uppercase ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        background: 'var(--avatar-fill)'
      }}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </span>
  )
}
