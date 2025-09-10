import { useEffect, useState } from 'react'

export default function HelpFloating() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 20, y: 20 })
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      setPos({ x: clientX - offset.x, y: clientY - offset.y })
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, offset])

  const startDrag = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setOffset({ x: clientX - rect.left, y: clientY - rect.top })
    setDragging(true)
  }

  return (
    <>
      <div
        style={{ position: 'fixed', right: pos.x, bottom: pos.y, zIndex: 50 }}
        className="flex flex-col items-end"
      >
        {open && (
          <div className="mb-3 w-80 max-w-[90vw] bg-white border rounded-lg shadow-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Help Center</div>
              <button onClick={() => setOpen(false)} className="text-gray-500">✕</button>
            </div>
            <p className="text-sm text-gray-600 mb-2">Quick links</p>
            <div className="flex flex-col gap-2">
              <a className="text-blue-600" href="/help">FAQs Assistant</a>
              <a className="text-blue-600" href="/terms">Terms of Service</a>
              <a className="text-blue-600" href="/safety">Safety Guidelines</a>
              <a className="text-blue-600" href="mailto:easydriverhire1@gmail.com">Contact Support</a>
            </div>
          </div>
        )}
        <button
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          onClick={() => setOpen(!open)}
          className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center"
          aria-label="Help"
        >
          ?
        </button>
      </div>
    </>
  )
}



