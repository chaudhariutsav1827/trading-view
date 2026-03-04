import { environment } from '@env/environment.development';

const apiUrl = environment.apiUrl;
export const END_POINTS = {
  INDICATORS: {
    POST: {
      EMA: apiUrl + '/api/indicator/ema',
      BB: apiUrl + '/api/indicator/bb',
      RSI: apiUrl + '/api/indicator/rsi',
      MACD: apiUrl + '/api/indicator/macd',
      Ichimoku: apiUrl + '/api/indicator/ichimoku',
      RS: apiUrl + '/api/indicator/rs',
      WT: apiUrl + '/api/indicator/wt',
      VWAP: apiUrl + '/api/indicator/vwap',
      ADX: apiUrl + '/api/indicator/adx',
      ST: apiUrl + '/api/indicator/st',
      OI: apiUrl + '/api/indicator/oi',
      IV: apiUrl + '/api/indicator/iv',
      DELTA: apiUrl + '/api/indicator/delta',
      GAMMA: apiUrl + '/api/indicator/gamma',
      THETA: apiUrl + '/api/indicator/theta',
      VEGA: apiUrl + '/api/indicator/vega',
      RHO: apiUrl + '/api/indicator/rho',
      VOLUME: apiUrl + '/api/indicator/volume',
    },
  },
  STOCKS: {
    GET: {
      SEARCH: apiUrl + '/api/stock/search',
      PRICE: apiUrl + '/api/stock/price',
    },
  },
  CHARTS: {
    GET: {
      CHARTS: apiUrl + '/api/candle',
      DATE_RANGE: apiUrl + '/api/candle/daterange',
    },
    POST: {
      ALL_DATA: apiUrl + '/api/candle',
      EXPORT_DATA: apiUrl + '/api/candle/export',
    },
  },
  DOWNLOAD: {
    SAMPLE_FILE: 'public/sample/sample1.csv',
  },
};
