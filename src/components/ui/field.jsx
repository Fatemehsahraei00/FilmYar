import { useContext, useId } from 'react'
import { FieldContext } from './field-internal'

function Field(props) {
  const { className = '', children, ...rest } = props
  const id = useId()
  const dataInvalid = rest['data-invalid'] !== undefined
  const ctx = { id, invalid: dataInvalid }
  return (
    <FieldContext.Provider value={ctx}>
      <div
        data-invalid={dataInvalid || undefined}
        className={`flex w-full flex-col gap-2 ${className}`}
        data-slot="field"
      >
        {children}
      </div>
    </FieldContext.Provider>
  )
}

function FieldLabel({ className = '', ...props }) {
  const ctx = useContext(FieldContext)
  return (
    <label
      htmlFor={props.htmlFor ?? ctx?.id}
      data-invalid={ctx?.invalid || undefined}
      className={`flex select-none items-center gap-2 text-base font-bold text-ink-dim ${className}`}
      data-slot="field-label"
    >
      {props.children}
    </label>
  )
}

function FieldDescription({ className = '', ...props }) {
  const ctx = useContext(FieldContext)
  return (
    <p
      data-invalid={ctx?.invalid || undefined}
      className={`text-sm leading-6 text-ink-dim/70 ${className}`}
      data-slot="field-description"
    >
      {props.children}
    </p>
  )
}

export { Field, FieldLabel, FieldDescription }
