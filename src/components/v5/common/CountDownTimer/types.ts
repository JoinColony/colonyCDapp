export interface CountDownTimerProps {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  loadingCountdown: boolean;
}
