import {Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AggregateType, Season, SeasonTemperature, YearBySeasonTemperature} from "../../model/season-data";
import {ExportChart, SEASONS_CHART_CONFIG} from "../../model/chart-config";
import {ChartjsComponent} from "@ctrl/ngx-chartjs";
import {TemperatureService} from "../../services/temperature.service";
import {ChartDataset} from "chart.js";
import {WeatherServiceService} from "../../services/weather-service.service";
import {Subject} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-season-temperature',
  templateUrl: './season-temperature.component.html',
})
export class SeasonTemperatureComponent implements OnInit, OnDestroy {
  availableYears: number [] = [];
  data: YearBySeasonTemperature[] = [];
  chartConfig: ExportChart = SEASONS_CHART_CONFIG;
  // @ts-ignore
  @ViewChild(ChartjsComponent, {static: false}) chart: ChartjsComponent;
  private $subject: Subject<void> = new Subject<void>();
  // @ts-ignore
  form: FormGroup;
  aggregateTypes: string[] = Object.keys(AggregateType);

  constructor(@Inject(LOCALE_ID) public locale: string,
              private weatherService: WeatherServiceService,
              private seasonService: TemperatureService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    console.log('Aggregate types = ', this.aggregateTypes);

    this.form = this.fb.group({
      aggregateType: AggregateType.AVG,
    });

    this.weatherService.getYearsToShow()
      .subscribe(years => {
        console.log('Years range = ', years);
        this.availableYears = [...Array(years).keys()].map(i => i + 1)
      });

    this.seasonService.getSeasonsTemperature()
      .subscribe(data => {
        this.data = data;
        this.updateChartData(data);
      });

    this.aggregateType.valueChanges
      .pipe(takeUntil(this.$subject))
      .subscribe(value => {
        console.log('Aggregated by ', value);
        this.updateChartData(this.data);
      });
  }

  ngOnDestroy(): void {
    this.$subject.next();
    this.$subject.complete();
  }

  onAggregateChanged(aggregateType: string) {
    console.log('Selected aggregateType = ', aggregateType);
    this.aggregateType.setValue(aggregateType);
  }

  private updateChartData(data: YearBySeasonTemperature[]): void {
    const labelsData: any[] = [];
    const winterData: any[] = [];
    const springData: any[] = [];
    const summerData: any[] = [];
    const autumnData: any[] = [];
    data
      .forEach(yearSeasons => {
        console.log('yearSeasons = ', yearSeasons);
        labelsData.push(yearSeasons.year);
        const seasons: SeasonTemperature[] = yearSeasons.seasons;
        winterData.push(this.getTemperatureByAggregate(seasons.find(s => s.season === Season.WINTER)));
        springData.push(this.getTemperatureByAggregate(seasons.find(s => s.season === Season.SPRING)));
        summerData.push(this.getTemperatureByAggregate(seasons.find(s => s.season === Season.SUMMER)));
        autumnData.push(this.getTemperatureByAggregate(seasons.find(s => s.season === Season.AUTUMN)));
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

  private getTemperatureByAggregate(season?: SeasonTemperature): number | undefined {
    const aggregate: string = this.aggregateType.value;
    switch (aggregate?.toLocaleUpperCase()) {
      case 'MIN':
        return season?.minTemp;
      case 'MAX':
        return season?.maxTemp;
      default:
        return season?.avgTemp;
    }
  }

  get aggregateType(): FormControl {
    return this.form.get('aggregateType') as FormControl;
  }
}
