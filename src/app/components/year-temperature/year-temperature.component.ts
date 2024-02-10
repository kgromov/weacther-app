import {Component, Inject, Input, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {YearSummary} from "../../model/season-data";
import {ExportChart, YEAR_SUMMARY_CHART_CONFIG} from "../../model/chart-config";
import {ChartjsComponent} from "@ctrl/ngx-chartjs";
import {TemperatureService} from "../../services/temperature.service";
import {ChartDataset} from "chart.js";
import {WeatherServiceService} from "../../services/weather-service.service";

@Component({
  selector: 'app-year-temperature',
  templateUrl: './year-temperature.component.html',
})
export class YearTemperatureComponent implements OnInit {
  @Input() public availableYears: number [] = [];
  data: YearSummary[] = [];
  chartConfig: ExportChart = YEAR_SUMMARY_CHART_CONFIG;
  // @ts-ignore
  @ViewChild(ChartjsComponent, {static: false}) chart: ChartjsComponent;

  constructor(@Inject(LOCALE_ID) public locale: string,
              private weatherService: WeatherServiceService,
              private seasonService: TemperatureService) {
  }

  ngOnInit(): void {
    this.weatherService.getYearsToShow()
      .subscribe(years => {
        console.log('Years range = ', years);
        this.availableYears = [...Array(years).keys()].map(i => i + 1)
      });

    this.seasonService.getYearSummary()
      .subscribe(data => {
        this.data = data;
        this.updateChartData(data);
      });
  }

  private updateChartData(data: YearSummary[]): void {
    const labelsData: any[] = [];
    const minData: any[] = [];
    const averageData: any[] = [];
    const maxData: any[] = [];
    data.forEach(summary => {
      labelsData.push(summary.year);
      minData.push(summary.min);
      averageData.push(summary.avg);
      maxData.push(summary.max);
    });

    this.chartConfig.data.labels = [...labelsData];
    const datasets: ChartDataset[] = this.chartConfig.data.datasets;
    datasets[0].data = [...minData];
    datasets[1].data = [...averageData];
    datasets[2].data = [...maxData];
    console.log('Chart data: ', this.chartConfig);
    // to trigger refresh
    this.chart.updateChart();
  }
}
