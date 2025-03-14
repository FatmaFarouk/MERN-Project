import { Component, OnInit } from '@angular/core';
//import { NgApexchartsModule } from 'ng-apexcharts';
import { AnalysisService } from '../../../../_services/analysis.service';
import { data } from 'jquery';
import { Analysis } from '../../../../_models/Analysis';
import ApexCharts from 'apexcharts';
import { SideBarComponent } from '../../core/side-bar/side-bar.component';

@Component({
  selector: 'app-analysis',
  imports: [SideBarComponent],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent implements OnInit
 {

  public AllAnalysis:Analysis| null =null;
  
  constructor(private analSer:AnalysisService){}

    ngOnInit(): void {

        this.analSer.getAllAnalysis().subscribe({
          next:(data)=> {this.AllAnalysis=data;
                     this.renderChart1();
                     this.renderChart2();
                     this.renderChart3();
                     this.renderChart4();
                     this.renderChart5();
                    }
        })
        
      
    }



  renderChart1(): void {
    const options = {
      series: [
        {
          name: 'Net Sales',
          data:this.AllAnalysis!.ordersanalysis.ordersallmonths,
        },
      ],
      chart: {
        height: 105,
        type: 'area',
        sparkline: {
          enabled: true,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 1.7,
        curve: 'smooth',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#02c27a'],
          shadeIntensity: 1,
          type: 'vertical',
          opacityFrom: 0.5,
          opacityTo: 0.0,
        },
      },
      colors: ['#02c27a'],
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false,
        },
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function (e: any) {
              return '';
            },
          },
        },
        marker: {
          show: false,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart1'), options);
    chart.render();
  }


  renderChart2():void{

    var options = {
      series: [
        {
          name: "Orders",
          data: this.AllAnalysis!.ordersanalysis.salesallmonths,//array 12 every index refer to the month and its value is the sales in this month 
        },
      ],
      chart: {
        //width:150,
        height: 60,
        type: "area",
        sparkline: {
          enabled: !0,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 1.5,
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#17ad37"],
          shadeIntensity: 1,
          type: "vertical",
          opacityFrom: 0.7,
          opacityTo: 0.0,
          //stops: [0, 100, 100, 100]
        },
      },
      colors: ["#98ec2d"],
      tooltip: {
        theme: "dark",
        fixed: {
          enabled: !1,
        },
        x: {
          show: !1,
        },
        y: {
          title: {
            formatter: function (e:string) {
              return "";
            },
          },
        },
        marker: {
          show: !1,
        },
      },
  
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    };
  
    var chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();
  }

  renderChart3():void{

    var options = {
      series: this.AllAnalysis?.ordersanalysis.ordersStatus,//Array of three index every index refer the number of orders in a specific status
      chart: {
        height: 290,
        type: "donut",
      },
      legend: {
        position: "bottom",
        show: !1,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#ee0979", "#17ad37", "#ec6ead"],
          shadeIntensity: 1,
          type: "vertical",
          opacityFrom: 1,
          opacityTo: 1,
          //stops: [0, 100, 100, 100]
        },
      },
      colors: ["#ff6a00", "#98ec2d", "#3494e6"],
      dataLabels: {
        enabled: !1,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "85%",
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 270,
            },
            legend: {
              position: "bottom",
              show: !1,
            },
          },
        },
      ],
    };
  
    var chart = new ApexCharts(document.querySelector("#chart6"), options);
    chart.render();
  
  }

  renderChart4():void{
    var options = {
      series: [
        {
          name: "Sales",
          data: this.AllAnalysis?.ordersanalysis.ordersallmonths,
        },
        {
          name: "profit",
          data: this.AllAnalysis?.ordersanalysis.ordersallmonths,
        },
      ],
      chart: {
        //width:150,
        foreColor: "#9ba7b2",
        height: 365,
        type: "bar",
        toolbar: {
          show: !1,
        },
        sparkline: {
          enabled: !1,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 4,
        curve: "smooth",
        colors: ["transparent"],
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#ffd200", "#00c6fb"],
          shadeIntensity: 1,
          type: "vertical",
          //opacityFrom: 0.8,
          //opacityTo: 0.1,
          stops: [0, 100, 100, 100],
        },
      },
      colors: ["#ff6a00", "#005bea"],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          borderRadiusApplication: "around",
          borderRadiusWhenStacked: "last",
          columnWidth: "55%",
        },
      },
      grid: {
        show: false,
        borderColor: "rgba(0, 0, 0, 0.15)",
        strokeDashArray: 4,
      },
      tooltip: {
        theme: "dark",
        fixed: {
          enabled: !0,
        },
        x: {
          show: !0,
        },
        y: {
          title: {
            formatter: function (e:string) {
              return "";
            },
          },
        },
        marker: {
          show: !1,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    };
  
    var chart = new ApexCharts(document.querySelector("#chart5"), options);
    chart.render();
  
  }

  renderChart5():void{
    
    var options = {
      series: [
        {
          name: "Orders",
          data: this.AllAnalysis!.UseraAnalysis.customersAllMonths,//array 12 every index refer to the month and its value is the sales in this month 
        },
      ],
      chart: {
        //width:150,
        height: 60,
        type: "area",
        sparkline: {
          enabled: !0,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 1.5,
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#17ad37"],
          shadeIntensity: 1,
          type: "vertical",
          opacityFrom: 0.7,
          opacityTo: 0.0,
          //stops: [0, 100, 100, 100]
        },
      },
      colors: ["#98ec2d"],
      tooltip: {
        theme: "dark",
        fixed: {
          enabled: !1,
        },
        x: {
          show: !1,
        },
        y: {
          title: {
            formatter: function (e:string) {
              return "";
            },
          },
        },
        marker: {
          show: !1,
        },
      },
  
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    };
  
    var chart = new ApexCharts(document.querySelector("#chart7"), options);
    chart.render();
  }

}
