export function PipboyMissionCard({
  className = '',
  mission = 'FIRST DEPOSIT',
  series = 'VAULT BUDDY FIELD ISSUE',
  showMascot = true,
}: {
  className?: string
  mission?: string
  series?: string
  showMascot?: boolean
}) {
  const classes = ['pip-card', className, !showMascot ? 'pip-card--no-mascot' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} aria-label="Pip-Boy mission issue card skin">
      <div className="pip-card__grid" />
      <div className="pip-card__scan" />
      <div className="pip-card__corner pip-card__corner--tl" />
      <div className="pip-card__corner pip-card__corner--tr" />
      <div className="pip-card__corner pip-card__corner--bl" />
      <div className="pip-card__corner pip-card__corner--br" />

      <div className="pip-card__top">
        <div>
          <div className="pip-card__issuer">SHIELDVAULT</div>
          <div className="pip-card__series">{series}</div>
        </div>
        <div className="pip-card__level">LVL 06</div>
      </div>

      {showMascot && <div className="pip-card__mascot" aria-hidden="true" />}

      <div className="pip-card__mission">
        <span>MISSION</span>
        <strong>{mission}</strong>
      </div>

      <div className="pip-card__chip" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="pip-card__bottom">
        <div className="pip-card__stamp">CLEARANCE GRANTED</div>
        <div className="pip-card__digits">115-06-090</div>
      </div>
    </div>
  )
}
