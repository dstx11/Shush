import type { ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { hoverMotion, motionPresets } from '../../lib/motion';

type PrimitiveProps = {
  children?: ReactNode;
  className?: string;
};

export function SnakeLine({ className = '' }: PrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <svg className={`snake-line ${className}`} viewBox="0 0 420 42" aria-hidden="true" focusable="false">
      <motion.path
        d="M8 28 C78 4, 118 42, 184 20 S303 2, 412 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        variants={reduceMotion ? undefined : motionPresets.snakeLine}
        initial={reduceMotion ? false : 'hidden'}
        whileInView={reduceMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-12%' }}
      />
    </svg>
  );
}

export function Waveform({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const points = compact
    ? '0,14 14,14 22,9 31,18 40,14 62,14 70,8 82,20 92,14 120,14'
    : '0,28 30,28 44,18 58,38 74,28 112,28 126,12 148,44 168,28 214,28 232,20 250,36 270,28 320,28 338,14 360,42 382,28 420,28';

  return (
    <svg className={`waveform ${compact ? 'is-compact' : ''} ${className}`} viewBox={compact ? '0 0 120 28' : '0 0 420 56'} aria-hidden="true" focusable="false">
      <motion.polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={compact ? '2' : '3'}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={reduceMotion ? undefined : motionPresets.snakeLine}
        initial={reduceMotion ? false : 'hidden'}
        whileInView={reduceMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-12%' }}
      />
    </svg>
  );
}

export function MotionRail({ className = '' }: PrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`motion-rail ${className}`}
      aria-hidden="true"
      variants={reduceMotion ? undefined : motionPresets.railDraw}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-12%' }}
    />
  );
}

export function TacticalGrid({ className = '' }: PrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`tactical-grid ${className}`}
      aria-hidden="true"
      variants={reduceMotion ? undefined : motionPresets.tacticalGrid}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true }}
    />
  );
}

export function MapPing({ label = 'Mapa ativo', className = '' }: { label?: string; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className={`map-ping ${className}`} aria-label={label}>
      <motion.span aria-hidden="true" animate={reduceMotion ? undefined : motionPresets.mapPing.animate} />
    </span>
  );
}

export function StatusBadge({ children, className = '', pulse = false }: PrimitiveProps & { pulse?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span className={`motion-status-badge ${className}`} animate={!reduceMotion && pulse ? motionPresets.statusPulse.animate : undefined}>
      {children}
    </motion.span>
  );
}

export function ProgressMilestones({ progress, milestones = [25, 50, 75, 100] }: { progress: number; milestones?: number[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="progress-milestones" aria-hidden="true">
      {milestones.map((milestone) => (
        <motion.span
          key={milestone}
          className={progress >= milestone ? 'is-reached' : ''}
          style={{ left: `${milestone}%` }}
          variants={reduceMotion ? undefined : motionPresets.milestone}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? undefined : progress >= milestone ? 'visible' : 'hidden'}
        />
      ))}
    </div>
  );
}

export function AnimatedUnderline({ children, className = '' }: PrimitiveProps) {
  return <span className={`animated-underline ${className}`}>{children}</span>;
}

export function MotionCard({ children, className = '' }: PrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div className={className} whileHover={reduceMotion ? undefined : hoverMotion.card} whileTap={reduceMotion ? undefined : hoverMotion.tap}>
      {children}
    </motion.div>
  );
}

export function EmptyStateMotion({ title, copy, className = '' }: { title: string; copy: string; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`empty-state-motion ${className}`}
      variants={reduceMotion ? undefined : motionPresets.panel}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true }}
    >
      <span>A atualizar</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </motion.div>
  );
}

export function ScrollProgressRail() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="scroll-progress-rail" aria-hidden="true">
      <motion.span style={reduceMotion ? undefined : { scaleY }} />
    </div>
  );
}

export function PlayerLockIndicator({ label = 'LOCKED' }: { label?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="player-lock-indicator"
      variants={reduceMotion ? undefined : motionPresets.success}
      initial={reduceMotion ? false : 'initial'}
      animate={reduceMotion ? undefined : 'animate'}
    >
      {label}
    </motion.span>
  );
}

export function JerseyStitchOverlay() {
  return (
    <svg className="jersey-stitch-overlay" viewBox="0 0 520 520" aria-hidden="true" focusable="false">
      <path d="M90 108 C170 36, 350 36, 430 108" />
      <path d="M118 148 C190 210, 330 210, 402 148" />
      <path d="M104 398 C190 442, 330 442, 416 398" />
    </svg>
  );
}

export function SignalBars({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className={`signal-bars ${className}`} aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <motion.span key={item} animate={reduceMotion ? undefined : motionPresets.creatorSignal.animate} transition={reduceMotion ? undefined : { delay: item * 0.14 }} />
      ))}
    </span>
  );
}

export function SectionBreadcrumb({ items, className = '' }: { items: string[]; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.nav
      className={`section-breadcrumb ${className}`}
      aria-label="Breadcrumb da secção"
      variants={reduceMotion ? undefined : motionPresets.revealX}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion ? undefined : 'visible'}
    >
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>{item}</span>
      ))}
    </motion.nav>
  );
}

export function UltrawideClampLines() {
  return (
    <div className="ultrawide-clamp-lines" aria-hidden="true">
      <span />
      <span />
    </div>
  );
}
