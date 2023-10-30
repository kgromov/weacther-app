export interface WeatherData {
  date: string,
  morningTemperature: number,
  afternoonTemperature: number,
  eveningTemperature: number,
  nightTemperature: number
}

export interface YearsRange {
  minYear: number;
  maxYear: number;
}

export interface SyncStatus {
  code: number,
  message: string
}
