import {AppLink} from '../ui/AppLink';
import {ArrowIcon} from '../ui/ArrowIcon';

export function TrackerButton({ href, playerName }: { href: string; playerName: string }) {
  return (
    <AppLink href={href} target="_blank" rel="noopener noreferrer" className="tracker-button" aria-label={`Consultar ${playerName} no Tracker.gg (abre numa nova janela)`}>
      <span>Partidas Competitive</span>
      <span className="tracker-button-arrow" aria-hidden="true"><ArrowIcon /></span>
    </AppLink>
  );
}

