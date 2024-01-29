export type ColonyVersionWidgetProps = {
  status: Status;
  latestVersion: string | number;
  currentVersion: string | number;
};

type Status = 'success' | 'error';
