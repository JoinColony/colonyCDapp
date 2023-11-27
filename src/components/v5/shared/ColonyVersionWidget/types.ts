export type ColonyVersionWidgetProps = {
  status: Status;
  lastVersion: string | number;
  currentVersion: string | number;
};

type Status = 'success' | 'error';
