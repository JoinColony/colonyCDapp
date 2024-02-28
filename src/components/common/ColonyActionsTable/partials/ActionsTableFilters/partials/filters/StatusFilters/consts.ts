import { FILTER_MOTION_STATES } from '~constants/actionsFilters.ts';
import { formatText } from '~utils/intl.ts';

export const STATUS_FILTERS = FILTER_MOTION_STATES.map((state) => ({
  label: formatText({ id: 'motion.state' }, { state }),
  name: state,
}));
