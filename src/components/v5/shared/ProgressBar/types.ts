export interface ProgressBarProps {
  progress: number;
  progressLabel?: JSX.Element | string;
  isTall?: boolean;
  threshold?: number;
  max?: number;
  barClassName?: string;
  className?: string;
}
