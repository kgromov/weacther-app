import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {WeatherData, YearsRange} from "../model/weather-data";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  public getWeatherForToday(): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.baseUrl}/weather/current`);
  }

  public getWeatherAtDay(day: string | Date): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.baseUrl}/weather/single/${day}`);
  }

  public getWeatherDayInRange(day: string | Date, years?: number): Observable<WeatherData[]> {
    const params: any = {};
    if (years) {
      params.years = years;
    }
    return this.http.get<WeatherData[]>(`${this.baseUrl}/weather/${day}`, {params: params});
  }

  public getYearsToShow(): Observable<YearsRange> {
    return this.http.get<YearsRange>(`${this.baseUrl}/weather/years`);
  }

}
