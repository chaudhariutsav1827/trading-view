import { Time } from 'lightweight-charts';

export interface VolumeModel {
  volume: number;
  date: string;
  isPositive: boolean;
}

export interface FormattedVolumeData {
  time: Time;
  value: number;
  color: string;
}
