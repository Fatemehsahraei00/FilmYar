import { createContext } from 'react'

// shared between field.jsx and input.jsx without an import cycle
export const FieldContext = createContext(undefined)
