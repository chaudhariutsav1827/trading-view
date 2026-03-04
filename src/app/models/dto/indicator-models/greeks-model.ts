export interface GreeksModel {
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  rho?: number;
  oI?: number;
  iV?: number;
  date: string;
}
