export interface ProgressBarProps {
  progress: number;
  isTall?: boolean;
  additionalText?: React.ReactNode;
  threshold?: number;
  max?: number;
  barClassName?: string;
  className?: string;
}
