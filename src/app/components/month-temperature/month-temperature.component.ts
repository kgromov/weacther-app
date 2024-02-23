import {Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MONTH_NAMES, MonthTemperature, YearByMonthTemperature} from "../../model/season-data";
import {ExportChart, YEAR_SUMMARY_CHART_CONFIG} from "../../model/chart-config";
import {ChartjsComponent} from "@ctrl/ngx-chartjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {WeatherServiceService} from "../../services/weather-service.service";
import {TemperatureService} from "../../services/temperature.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ChartDataset} from "chart.js";
import {WeatherData} from "../../model/weather-data";

interface MonthName {
  name: string,
  value: number
}

@Component({
  selector: 'app-month-temperature',
  templateUrl: './month-temperature.component.html'
})
export class MonthTemperatureComponent implements OnInit, OnDestroy {

  availableYears: number [] = [];
  yearsRange: number = 0;
  data: YearByMonthTemperature[] = [];
  chartConfig: ExportChart = YEAR_SUMMARY_CHART_CONFIG;
  // @ts-ignore
  @ViewChild(ChartjsComponent, {static: false}) chart: ChartjsComponent;
  private $subject: Subject<void> = new Subject<void>();
  // @ts-ignore
  form: FormGroup;
  monthItems: MonthName[] = MONTH_NAMES.map((value, index) => ({name: value, value: index + 1}))

  constructor(@Inject(LOCALE_ID) public locale: string,
              private weatherService: WeatherServiceService,
              private seasonService: TemperatureService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const currentMonth: number = new Date().getMonth();
    this.form = this.fb.group({
      month: this.monthItems[currentMonth]
    });

    this.weatherService.getYearsToShow()
      .subscribe(yearsRange => {
        console.log('Years range = ', yearsRange);
        this.availableYears = [...Array(yearsRange).keys()].map(i => i + 1)
      });

    this.seasonService.getMonthTemperature()
      .subscribe(data => {
        this.data = data;
        this.updateChartData(data);
      });

    this.month.valueChanges
      .pipe(takeUntil(this.$subject))
      .subscribe(value => {
        console.log('Selected month = ', JSON.stringify(value));
        this.updateChartData(this.data);
      });
  }

  ngOnDestroy(): void {
    this.$subject.next();
    this.$subject.complete();
  }

  // it's kind of workaround in reactive forms but does not work from from form to ccmponent
  onMonthChanged(month: MonthName) {
    console.log('Selected month = ', month.name);
    this.month.setValue(month);
  }

  private updateChartData(data: YearByMonthTemperature[]) {
    // @ts-ignore
    const currentMonthIndex: number = this.month.value?.value || 0;
    console.log('currentMonthIndex = ', currentMonthIndex);
    const labelsData: any[] = [];
    const minData: any[] = [];
    const averageData: any[] = [];
    const maxData: any[] = [];
    data
      .forEach(yearMonths => {
        console.log('year months = ', yearMonths);
        const months: MonthTemperature[] = yearMonths.months;
        // @ts-ignore
        const currentMonth: MonthTemperature = months.find(it => it.month === currentMonthIndex);
        if (!!currentMonth) {
          labelsData.push(yearMonths.year);
          minData.push(currentMonth.minTemp);
          averageData.push(currentMonth.avgTemp);
          maxData.push(currentMonth.maxTemp);
        }
      });
    this.yearsRange = labelsData.length;

    this.chartConfig.data.labels = [...labelsData];
    const datasets: ChartDataset[] = this.chartConfig.data.datasets;
    datasets[0].data = [...minData];
    datasets[1].data = [...averageData];
    datasets[2].data = [...maxData];
    console.log('Chart data: ', this.chartConfig);
    // to trigger refresh
    this.chart.updateChart();
  }

  get month(): FormControl {
    return this.form.get('month') as FormControl;
  }

  get monthName(): string {
    return this.month.value?.name;
  }
}
