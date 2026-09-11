import { useContext } from 'react'
import { FieldContext } from './field-internal'

function Input({ className = '', type = 'text', ...props }) {
  const ctx = useContext(FieldContext)
  return (
    <input
      type={type}
      id={props.id ?? ctx?.id}
      aria-invalid={ctx?.invalid || props['aria-invalid'] || undefined}
      className={`h-12 w-full rounded-xl border border-accent/40 bg-base-deep/60 px-4 text-lg text-ink
        placeholder:text-ink-dim/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
        transition-[color,box-shadow,border-color] outline-none
        focus-visible:border-accent-soft focus-visible:shadow-[0_0_0_4px_rgba(81,40,136,0.35)]
        aria-invalid:border-red-400/70 aria-invalid:shadow-[0_0_0_4px_rgba(248,113,113,0.15)]
        disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      data-slot="input"
      {...props}
    />
  )
}

export { Input }
