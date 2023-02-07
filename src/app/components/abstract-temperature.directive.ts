import {Directive, Inject, LOCALE_ID} from '@angular/core';
import {DAILY_CHART_CONFIG, ExportChart} from "../model/chart-config";
import {WeatherServiceService} from "../services/weather-service.service";

@Directive({
  selector: '[appAbstractTemperature]'
})
export class AbstractTemperatureDirective {
  chartConfig: ExportChart = DAILY_CHART_CONFIG;

  constructor(@Inject(LOCALE_ID) public locale: string,
              private weatherService: WeatherServiceService) {
  }

}
