import { getPasswordStrength } from '../../utils/validation'

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null
  const { score, label, color } = getPasswordStrength(password)

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? color : 'bg-surface-border'}`}
          />
        ))}
      </div>
      <p className="text-[11px] text-ink-500 mt-1">{label} password</p>
    </div>
  )
}
