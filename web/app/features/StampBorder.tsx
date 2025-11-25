export const StampBorder = ({
  children,
  borderColor,
  background,
  borderThickness = '24px',
  borderRadius = '8px',
  borderRotation = '0deg',
}: {
  children: React.ReactNode
  background: string
  borderColor: string
  borderThickness?: string
  borderRadius?: string
  borderRotation?: string
}) => (
  <div
    className="stamp-border"
    style={{
      ['--stamp-bg' as string]: background,
      ['--border-color' as string]: borderColor,
      ['--border-thickness' as string]: borderThickness,
      ['--border-radius' as string]: borderRadius,
      ['--border-rotation' as string]: borderRotation,
    }}
  >
    {children}
  </div>
)
