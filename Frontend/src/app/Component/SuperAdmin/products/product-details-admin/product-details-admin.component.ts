import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../../core/side-bar/side-bar.component';
import { Product } from '../../../../_models/product';
import { ProductAnalysis } from '../../../../_models/Analysis';
import { AnalysisService } from '../../../../_services/analysis.service';
import ApexCharts from 'apexcharts';


@Component({
  selector: 'app-product-details-admin',
  imports: [SideBarComponent],
  templateUrl: './product-details-admin.component.html',
  styleUrl: './product-details-admin.component.css'
})
export class ProductDetailsAdminComponent implements OnInit {

  product?:Product;
  Analysis?:ProductAnalysis;
  Allsold?:number;

  constructor(private analysisService:AnalysisService){}
  ngOnInit(): void {
    
    this.product=history.state.product;

    this.analysisService.getProductAnalysis(this.product?._id!).subscribe(

      (response) => {
        this.Analysis=response;
        this.Allsold = this.Analysis?.RevenueAnalysis.ProductRevenueBranches.reduce((acc, curr) => acc + curr, 0);
        this.renderChart1();
        this.renderChart2();
      },
      (error) => {
        console.error('Error submitting order:', error);
        // Handle error (e.g., show an error message)
      }

    )
    //this.Allsold = this.Analysis?.RevenueAnalysis.ProductRevenueBranches.reduce((acc, curr) => acc + curr, 0);
  }

  renderChart2(): void {
    const options = {
      series: [
        {
          name: 'Orders',
          data: this.Analysis?.RevenueAnalysis.ProductRevenueBranches,
        },
      ],
      chart: {
        height: 200, // Increase height to accommodate y-axis labels
        type: 'area',
        sparkline: {
          enabled: false, // Disable sparkline to show full chart
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
        curve: 'smooth',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#17ad37'],
          shadeIntensity: 1,
          type: 'vertical',
          opacityFrom: 0.7,
          opacityTo: 0.0,
        },
      },
      colors: ['#98ec2d'],
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false,
        },
        x: {
          show: true, // Show x-axis tooltip
        },
        y: {
          title: {
            formatter: function (e: string) {
              return '';
            },
          },
        },
        marker: {
          show: false,
        },
      },
      xaxis: {
        categories: this.Analysis?.StockAnalysis.BranchesNames,
        labels: {
          show: true, // Ensure x-axis labels are visible
          style: {
            colors: '#ffffff', // Set label color
            fontSize: '12px', // Set label font size
          },
        },
        axisBorder: {
          show: true, // Show x-axis border
        },
        axisTicks: {
          show: true, // Show x-axis ticks
        },
      },
      yaxis: {
        labels: {
          show: true, // Ensure y-axis labels are visible
          style: {
            colors: '#ffffff', // Set label color
            fontSize: '12px', // Set label font size
          },
          formatter: function (value: number) {
            return value.toFixed(0); // Format y-axis labels (e.g., remove decimals)
          },
        },
        axisBorder: {
          show: true, // Show y-axis border
        },
        axisTicks: {
          show: true, // Show y-axis ticks
        },
      },
    };
  
    const chart = new ApexCharts(document.querySelector('#chart2'), options);
    chart.render();
  }

  renderChart1(): void {
    const options = {
      series: [
        {
          name: 'Net Sales',
          data: this.Analysis?.StockAnalysis.ProductStockBranches,
        },
      ],
      chart: {
        height: 200, // Increase height to accommodate y-axis labels
        type: 'area',
        sparkline: {
          enabled: false, // Disable sparkline to show full chart
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
          show: true, // Show x-axis tooltip
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
        categories: this.Analysis?.StockAnalysis.BranchesNames,
        labels: {
          show: true, // Ensure x-axis labels are visible
          style: {
            colors: '#ffffff', // Set label color
            fontSize: '12px', // Set label font size
          },
        },
        axisBorder: {
          show: true, // Show x-axis border
        },
        axisTicks: {
          show: true, // Show x-axis ticks
        },
      },
      yaxis: {
        labels: {
          show: true, // Ensure y-axis labels are visible
          style: {
            colors: '#ffffff', // Set label color
            fontSize: '12px', // Set label font size
          },
          formatter: function (value: number) {
            return value.toFixed(0); // Format y-axis labels (e.g., remove decimals)
          },
        },
        axisBorder: {
          show: true, // Show y-axis border
        },
        axisTicks: {
          show: true, // Show y-axis ticks
        },
      },
    };
  
    const chart = new ApexCharts(document.querySelector('#chart1'), options);
    chart.render();
  }


  
  
}
