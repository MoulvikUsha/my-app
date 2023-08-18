import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";

@Component({
  selector: 'app-am-charts',
  templateUrl: './am-charts.component.html',
  styleUrls: ['./am-charts.component.scss']
})
export class AmChartsComponent implements OnInit {

  chart: any;
  liveChart: any;
  interval: any;

  constructor() { }

  ngOnInit(): void {
    this.amChartLive();
    this.stepLineChart();
  }

  stepLineChart() {
    // Chart Instance
    this.chart = am4core.create("amChart", am4charts.XYChart);

    let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.title.text = "Countries";
    categoryAxis.renderer.minGridDistance = 15;

    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Litres sold (M)";

    // Chart Series
    var series = this.chart.series.push(new am4charts.StepLineSeries());
    series.dataFields.categoryX = "country";
    series.dataFields.valueY = "litres";
    series.strokeWidth = 3;

    // Add data
    this.chart.data = [
      {
        "country": "Lithuania",
        "litres": 101.9
      }, {
        "country": "Czech Republic",
        "litres": 301.9
      }, {
        "country": "Ireland",
        "litres": 201.1
      }, {
        "country": "Germany",
        "litres": 85.8
      }, {
        "country": "Australia",
        "litres": 139.9
      }, {
        "country": "Austria",
        "litres": 128.3
      }, {
        "country": "UK",
        "litres": 99
      }, {
        "country": "Belgium",
        "litres": 260
      }, {
        "country": "The Netherlands",
        "litres": 150
      }
    ];
    this.chart.legend = new am4charts.Legend();
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.scrollbarX = new am4core.Scrollbar();
  }
  
  amChartLive() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    this.liveChart = am4core.create("amChartLive", am4charts.XYChart);
    console.log('this.liveChart:', this.liveChart);

    this.liveChart.hiddenState.properties.opacity = 0;
    this.liveChart.padding(0, 0, 0, 0);
    this.liveChart.zoomOutButton.disabled = true;

    let data = [];
    let visits = 10;
    let i = 0;
    for (i = 0; i <= 20; i++) {
      visits -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date().setSeconds(i - 30), value: visits });
    }
    this.liveChart.data = data;

    // X-Axis
    let dateAxis = this.liveChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.dateFormats.setKey("second", "ss");
    dateAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
    dateAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
    dateAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
    dateAxis.renderer.inside = true;
    dateAxis.renderer.axisFills.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = true;

    // Y-Axis
    let valueAxis = this.liveChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.interpolationDuration = 500;
    valueAxis.rangeChangeDuration = 500;
    valueAxis.renderer.inside = true;
    valueAxis.renderer.minLabelPosition = 0.05;
    valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;

    // Series
    let series = this.liveChart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.interpolationDuration = 500;
    series.defaultState.transitionDuration = 0;
    series.tensionX = 0.8;

    this.liveChart.events.on("datavalidated", function () {
      dateAxis.zoom({ start: 1 / 15, end: 1.2 }, false, true);
    });

    dateAxis.interpolationDuration = 500;
    dateAxis.rangeChangeDuration = 500;


    this.interval = setInterval(() => {
      visits = visits + Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
      let lastdataItem = series.dataItems.getIndex(series.dataItems.length - 1);
      this.liveChart.addData(
        { date: new Date(lastdataItem.dateX.getTime() + 1000), value: visits },
        1
      );
    }, 1000);


    // all the below is optional, makes some fancy effects
    // gradient fill of the series
    series.fillOpacity = 1;
    let gradient = new am4core.LinearGradient();
    gradient.addColor(this.liveChart.colors.getIndex(0), 0.2);
    gradient.addColor(this.liveChart.colors.getIndex(0), 0);
    series.fill = gradient;

    // this makes date axis labels to fade out
    dateAxis.renderer.labels.template.adapter.add("fillOpacity", (fillOpacity: any, target: any) => {
      let dataItem = target.dataItem;
      return dataItem.position;
    })

    // need to set this, otherwise fillOpacity is not changed and not set
    dateAxis.events.on("validated", () => {
      am4core.iter.each(dateAxis.renderer.labels.iterator(), (label: any) => {
        label.fillOpacity = label.fillOpacity;
      })
    })

    // this makes date axis labels which are at equal minutes to be rotated
    dateAxis.renderer.labels.template.adapter.add("rotation", (rotation: any, target: any) => {
      let dataItem = target.dataItem;
      if (dataItem.date && dataItem.date.getTime() == am4core.time.round(new Date(dataItem.date.getTime()), "minute", 0).getTime()) {
        target.verticalCenter = "middle";
        target.horizontalCenter = "left";
        return -90;
      }
      else {
        target.verticalCenter = "bottom";
        target.horizontalCenter = "middle";
        return 0;
      }
    })

    // bullet at the front of the line
    let bullet = series.createChild(am4charts.CircleBullet);
    bullet.circle.radius = 5;
    bullet.fillOpacity = 1;
    bullet.fill = this.liveChart.colors.getIndex(0);
    bullet.isMeasured = false;

    series.events.on("validated", function () {
      bullet.moveTo(series.dataItems.last.point);
      bullet.validatePosition();
    });
  }

}
