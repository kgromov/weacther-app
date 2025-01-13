import {Component, Inject, Input, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {YearSummary} from "../../model/season-data";
import {ExportChart, YEAR_SUMMARY_CHART_CONFIG} from "../../model/chart-config";
import {ChartjsComponent} from "@ctrl/ngx-chartjs";
import {TemperatureService} from "../../services/temperature.service";
import {
  ActiveElement,
  Chart, ChartData,
  ChartDataset, ChartEvent,
  PluginChartOptions,
  PluginOptionsByType,
  ScriptableContext,
  TooltipCallbacks,
  TooltipModel
} from "chart.js";
import {WeatherServiceService} from "../../services/weather-service.service";
import {callback} from "chart.js/helpers";

@Component({
  selector: 'app-year-temperature',
  templateUrl: './year-temperature.component.html',
  styleUrls: ['../../app.component.css']
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
    this.chartConfig = this.chartConfigOverrides(YEAR_SUMMARY_CHART_CONFIG);
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

  private formatToIso(extremumDates: string[] = []): string {
    return extremumDates.map(date => new Date(date).toISOString().slice(0, 10))
      .join('; ');
  }

  private chartConfigOverrides(chartConfig: ExportChart): ExportChart {
    const plugins: any = {
      tooltip: {
        enabled: true,
        position: 'nearest',
        // external: (context: TooltipModel<any> ) => {
        //   // Tooltip Element
        //   const  { chart: Chart; tooltip: TooltipModel<TType> } = this.context;
        // },
        callbacks: {
          label: (context: ScriptableContext<any>) => {
            /*
            export interface ScriptableContext<TType extends ChartType> {
                active: boolean;
                chart: Chart;
                dataIndex: number;
                dataset: UnionToIntersection<ChartDataset<TType>>;
                datasetIndex: number;
                parsed: UnionToIntersection<ParsedDataType<TType>>;
                raw: unknown;
             */
            console.log('callback', context);
            let label = context.dataset.label || '';
            console.log('label = ', label);
            // TODO: format to 'MMM, dd' instead
            if (this.data?.length > 0 && context.datasetIndex !== 1) {
              const date = this.formatToIso(this.data[context.dataIndex][context.datasetIndex === 0 ? 'minTempDates' : 'maxTempDates']);
              label = `${label}: ${context.raw} (${date})`;
            }
            console.log('modified label = ', label);
            return label;
          }
        }
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        this.onPointClicked(event, elements, chart)
      }
    }
    const optionsOverrides: any = {
      ...chartConfig.options,
      plugins: plugins,
    };
    return {
      ...chartConfig,
      options: optionsOverrides
    };
  }

  private onPointClicked(event: ChartEvent, elements: ActiveElement[], chart: Chart): void {
    const selectedElements: ActiveElement[] = elements as ActiveElement[];
    if (selectedElements.length <= 0) {
      return;
    }
    const selectedElement: ActiveElement = selectedElements[0];
    console.log(selectedElement.element);
    const datasetIndex: number = selectedElement.datasetIndex;
    const pointIndex: number = selectedElement.index;

    const data: ChartData = chart.config.data as ChartData;
    const dataset: ChartDataset[] = data.datasets;

    const dataObject: any = dataset[datasetIndex].data[pointIndex];
  }

  // const getOrCreateTooltip = (chart) => {
  //   let tooltipEl = chart.canvas.parentNode.querySelector('div');
  //
  //   if (!tooltipEl) {
  //     tooltipEl = document.createElement('div');
  //     tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
  //     tooltipEl.style.borderRadius = '3px';
  //     tooltipEl.style.color = 'white';
  //     tooltipEl.style.opacity = 1;
  //     tooltipEl.style.pointerEvents = 'none';
  //     tooltipEl.style.position = 'absolute';
  //     tooltipEl.style.transform = 'translate(-50%, 0)';
  //     tooltipEl.style.transition = 'all .1s ease';
  //
  //     const table = document.createElement('table');
  //     table.style.margin = '0px';
  //
  //     tooltipEl.appendChild(table);
  //     chart.canvas.parentNode.appendChild(tooltipEl);
  //   }
  //
  //   return tooltipEl;
  // };
  //
  // const externalTooltipHandler = (context) => {
  //   // Tooltip Element
  //   const {chart, tooltip} = context;
  //   const tooltipEl = getOrCreateTooltip(chart);
  //
  //   // Hide if no tooltip
  //   if (tooltip.opacity === 0) {
  //     tooltipEl.style.opacity = 0;
  //     return;
  //   }
  //
  //   // Set Text
  //   if (tooltip.body) {
  //     const titleLines = tooltip.title || [];
  //     const bodyLines = tooltip.body.map(b => b.lines);
  //
  //     const tableHead = document.createElement('thead');
  //
  //     titleLines.forEach(title => {
  //       const tr = document.createElement('tr');
  //       tr.style.borderWidth = 0;
  //
  //       const th = document.createElement('th');
  //       th.style.borderWidth = 0;
  //       const text = document.createTextNode(title);
  //
  //       th.appendChild(text);
  //       tr.appendChild(th);
  //       tableHead.appendChild(tr);
  //     });
  //
  //     const tableBody = document.createElement('tbody');
  //     bodyLines.forEach((body, i) => {
  //       const colors = tooltip.labelColors[i];
  //
  //       const span = document.createElement('span');
  //       span.style.background = colors.backgroundColor;
  //       span.style.borderColor = colors.borderColor;
  //       span.style.borderWidth = '2px';
  //       span.style.marginRight = '10px';
  //       span.style.height = '10px';
  //       span.style.width = '10px';
  //       span.style.display = 'inline-block';
  //
  //       const tr = document.createElement('tr');
  //       tr.style.backgroundColor = 'inherit';
  //       tr.style.borderWidth = 0;
  //
  //       const td = document.createElement('td');
  //       td.style.borderWidth = 0;
  //
  //       const text = document.createTextNode(body);
  //
  //       td.appendChild(span);
  //       td.appendChild(text);
  //       tr.appendChild(td);
  //       tableBody.appendChild(tr);
  //     });
  //
  //     const tableRoot = tooltipEl.querySelector('table');
  //
  //     // Remove old children
  //     while (tableRoot.firstChild) {
  //       tableRoot.firstChild.remove();
  //     }
  //
  //     // Add new children
  //     tableRoot.appendChild(tableHead);
  //     tableRoot.appendChild(tableBody);
  //   }
  //
  //   const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  //
  //   // Display, position, and set styles for font
  //   tooltipEl.style.opacity = 1;
  //   tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  //   tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  //   tooltipEl.style.font = tooltip.options.bodyFont.string;
  //   tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  // };
}
