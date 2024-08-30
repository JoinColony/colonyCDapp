import { type ComputedBarDatum } from '@nivo/bar';

export interface LegendItem {
  label: string;
  color: string;
}

export interface BarChartDataItem {
  [key: string]: string;
  in: string;
  out: string;
  label: string;
}

export type BarItem = ComputedBarDatum<BarChartDataItem>;

export type GroupedBarItems = Record<string, BarItem[]>;
