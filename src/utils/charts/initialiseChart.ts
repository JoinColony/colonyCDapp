import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { backgroundOverlayPlugin as BackgroundOverlayPlugin } from './plugins/backgroundOverlay.ts';

export const initialiseChart = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BackgroundOverlayPlugin,
  );
};
