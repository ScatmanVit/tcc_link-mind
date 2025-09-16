import './style.css'
import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, children }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null)
  if (!elRef.current && typeof document !== 'undefined') {
    elRef.current = document.createElement('div')
  }

  useEffect(() => {
    const el = elRef.current!
    document.body.appendChild(el)
    return () => { document.body.removeChild(el) }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal card" onMouseDown={e => e.stopPropagation()}>
        {title && <div className="modal-header"><h3>{title}</h3><button className="icon" onClick={onClose}>✕</button></div>}
        <div className="modal-content">{children}</div>
      </div>
    </div>,
    elRef.current!
  )
}

