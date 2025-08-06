export type QuarterlyDeviation = {
  quarter: string;
  date: Date;
  deviation: number;
  vesselName: string;
  imo: number;
};

type ChartDataPoint = {
  x: number;
  y: number;
  quarter: string;
};

export type ChartSeries = {
  name: string;
  id: string;
  data: ChartDataPoint[];
};

export type ChartResponse = {
  series: ChartSeries[];
  availableVessels: Array<{ imo: number; name: string }>;
};

export type QuarterEndLog = {
  vessel_id: number;
  quarter: string;
  toutc: Date;
  aerco2t2w: number;
};
