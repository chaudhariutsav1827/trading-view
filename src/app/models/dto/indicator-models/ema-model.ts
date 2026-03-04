export interface EmaModel {
  ema: number;
  date: string;
}

export interface MultipleEmaModel {
  [key: string]: EmaModel[];
}
