import {Component, Inject, Input, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {Season, SeasonTemperature, YearBySeasonTemperature} from "../../model/season-data";
import {ExportChart, SEASONS_CHART_CONFIG} from "../../model/chart-config";
import {ChartjsComponent} from "@ctrl/ngx-chartjs";
import {SeasonTemperatureService} from "../../services/season-temperatue.service";
import {ChartDataset} from "chart.js";

@Component({
  selector: 'app-season-temperature',
  templateUrl: './season-temperature.component.html',
})
export class SeasonTemperatureComponent implements OnInit {
  @Input() public availableYears: number [] = [];
  data: YearBySeasonTemperature[] = [];
  chartConfig: ExportChart = SEASONS_CHART_CONFIG;
  // @ts-ignore
  @ViewChild(ChartjsComponent, {static: false}) chart: ChartjsComponent;

  constructor(@Inject(LOCALE_ID) public locale: string,
              private seasonService: SeasonTemperatureService) {
  }

  ngOnInit(): void {
    this.seasonService.getSeasonsTemperature()
      .subscribe(data => {
        this.data = data;
        this.updateChartData(data);
      });
  }

  private updateChartData(data: YearBySeasonTemperature[]): void {
    const labelsData: any[] = [];
    const winterData: any[] = [];
    const springData: any[] = [];
    const summerData: any[] = [];
    const autumnData: any[] = [];
    data
      .forEach(yearSeasons => {
        labelsData.push(yearSeasons.year);
        const seasons: SeasonTemperature[] = yearSeasons.seasons;
        winterData.push(seasons.find(s => s.season === Season.WINTER)?.temperature);
        springData.push(seasons.find(s => s.season === Season.SPRING)?.temperature);
        summerData.push(seasons.find(s => s.season === Season.SUMMER)?.temperature);
        autumnData.push(seasons.find(s => s.season === Season.AUTUMN)?.temperature);
      });

    this.chartConfig.data.labels = [...labelsData];
    const datasets: ChartDataset[] = this.chartConfig.data.datasets;
    datasets[0].data = [...winterData];
    datasets[1].data = [...springData];
    datasets[2].data = [...summerData];
    datasets[3].data = [...autumnData];
    console.log('Chart data: ', this.chartConfig);
    // to trigger refresh
    this.chart.updateChart();
  }
}
