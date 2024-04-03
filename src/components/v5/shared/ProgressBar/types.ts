export interface ProgressBarProps {
  progress: number;
  progressLabel?: string;
  isTall?: boolean;
  threshold?: number;
  max?: number;
  barClassName?: string;
  className?: string;
  labelClassName?: string;
}
