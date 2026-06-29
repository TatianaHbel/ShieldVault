import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import React, { useRef, useState, useCallback, useEffect } from 'react'

interface BottomDrawerProps {
  open: boolean
  onDismiss: () => void
  children: React.ReactNode
}

const PARTIAL_HEIGHT = '74%'
const FULL_HEIGHT    = '100%'
const SPRING = { type: 'spring' as const, damping: 30, stiffness: 280, mass: 0.8 }

export function BottomDrawer({ open, onDismiss, children }: BottomDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const bodyRef       = useRef<HTMLDivElement>(null)
  const dragControls  = useDragControls()
  const isExpandedRef = useRef(false)

  useEffect(() => { isExpandedRef.current = isExpanded }, [isExpanded])

  useEffect(() => {
    if (!open) return
    const body = bodyRef.current
    if (!body) return

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (!isExpandedRef.current && target.scrollTop > 0) {
        isExpandedRef.current = true
        setIsExpanded(true)
      }
    }

    body.addEventListener('scroll', onScroll, { capture: true, passive: true })
    return () => body.removeEventListener('scroll', onScroll, { capture: true })
  }, [open])

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (!isExpandedRef.current && (info.velocity.y < -400 || info.offset.y < -40)) {
        isExpandedRef.current = true
        setIsExpanded(true)
        return
      }

      const shouldClose = info.offset.y > 80 || info.velocity.y > 400
      if (!shouldClose) return

      if (isExpandedRef.current) {
        const sc = bodyRef.current?.querySelector('.screen-content') as HTMLElement | null
        if (sc) sc.scrollTop = 0
        setIsExpanded(false)
      } else {
        onDismiss()
      }
    },
    [onDismiss],
  )

  const handleExitComplete = useCallback(() => setIsExpanded(false), [])

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {open && (
        <div className="drawer-overlay">
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onDismiss}
          />

          <motion.div
            className="bottom-drawer"
            initial={{ y: '100%', height: PARTIAL_HEIGHT }}
            animate={{ y: 0, height: isExpanded ? FULL_HEIGHT : PARTIAL_HEIGHT }}
            exit={{ y: '100%' }}
            transition={SPRING}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.4, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
          >
            <div
              className="drawer-handle-area"
              onPointerDown={e => dragControls.start(e)}
              style={{ touchAction: 'none' }}
            >
              <div className="drawer-handle" />
            </div>

            <div ref={bodyRef} className="drawer-body">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
