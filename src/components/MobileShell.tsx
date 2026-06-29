import { Signal, Wifi, Battery } from 'lucide-react'

interface MobileShellProps {
  children: React.ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="device-outer">
      <div className="device">
        <div className="status-bar">
          <span>9:41</span>
          <span className="status-bar__icons">
            <Signal size={14} strokeWidth={2} />
            <Wifi size={14} strokeWidth={2} />
            <Battery size={14} strokeWidth={2} />
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
