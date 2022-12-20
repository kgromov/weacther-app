import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {WeatherData} from "../model/weather-data";

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {
  private baseUrl: string = 'http://localhost:8080/weather';

  constructor(private http: HttpClient) {
  }

  public getWeatherForToday(): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.baseUrl}/current`);
  }

  public getWeatherAtDay(day: string | Date): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.baseUrl}/single/${day}`);
  }

  public getWeatherDayInRange(day: string | Date, years?: number): Observable<WeatherData[]> {
    const params: any = {years: years || null};
    return this.http.get<WeatherData[]>(`${this.baseUrl}/${day}`);
  }

}
