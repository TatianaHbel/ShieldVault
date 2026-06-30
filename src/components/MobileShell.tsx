interface MobileShellProps {
  children: React.ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="device-outer">
      <div className="device">
        {children}
      </div>
    </div>
  )
}
