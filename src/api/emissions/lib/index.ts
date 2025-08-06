import {
  calculateVesselDeviations,
  createChartSeries,
  groupFactorsByType,
  groupLogsByVessel,
} from './emission-data.utils';
import { fetchQuarterlyEndLogs } from './emission-query.utils';
import type {
  ChartResponse,
  ChartSeries,
  QuarterEndLog,
  QuarterlyDeviation,
} from './types';

export {
  calculateVesselDeviations,
  createChartSeries,
  groupFactorsByType,
  groupLogsByVessel,
  fetchQuarterlyEndLogs,
};

export type { ChartResponse, ChartSeries, QuarterEndLog, QuarterlyDeviation };
