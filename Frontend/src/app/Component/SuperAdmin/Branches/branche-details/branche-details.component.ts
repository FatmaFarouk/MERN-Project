import { Component, OnDestroy, OnInit } from '@angular/core';
import { Inventory } from '../../../../_models/Inventory';
import { Analysis } from '../../../../_models/Analysis';
import { AnalysisService } from '../../../../_services/analysis.service';
import ApexCharts from 'apexcharts';
import { Router,ActivatedRoute, NavigationEnd } from '@angular/router';
import { Product } from '../../../../_models/product';
import { BranchService } from '../../../../_services/branch.service';
@Component({
  selector: 'app-branche-details',
  imports: [],
  templateUrl: './branche-details.component.html',
  styleUrl: './branche-details.component.css'
})
export class BrancheDetailsComponent implements OnInit,OnDestroy{

  branch:Inventory |null =null;
  products:Product[] |null=null;
  AllAnalysis:Analysis|null=null;


  constructor(private AnalysisService:AnalysisService ,private branchservice:BranchService,private router:Router,private route: ActivatedRoute){}
  ngOnInit(): void {

    

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentState = history.state;
        if (currentState.branch) {
          this.branch = currentState.branch; // Retrieve the branch object from state
          console.log('Branch data retrieved:', this.branch);
         this.loadBranchDetails(); // Load branch details
         this.loadProducts();
          console.log(this.AllAnalysis);
        } else {
          console.warn('Branch data not found in route state.');
        }
      } 
    });
  
    

     
    
    
    
  }

loadProducts(){
  this.branchservice.getAllProducts(this.branch?._id!).subscribe(
    (response) => {
      this.products=response;
    },
    (error) => {
      console.error('Error submitting order:', error);
      // Handle error (e.g., show an error message)
    }
  )
}

  ShowProductDetails(product:Product){
    this.router.navigate(['ProductDetails'], {
      state: { product }, // Pass the branch object as state
    });
  }


 
    loadBranchDetails(){
      if(this.branch?.branchLocation=="Online"){
        this.AnalysisService.getOnlineAnalysis().subscribe(
          (response) => {
            this.AllAnalysis=response;
            this.renderChart1();
            this.renderChart2();
          },
          (error) => {
            console.error('Error submitting order:', error);
            // Handle error (e.g., show an error message)
          }
  
        )
      }else{
        this.AnalysisService.getBranchAnalysis(this.branch?._id).subscribe(
          (response) => {
            this.AllAnalysis=response;
            this.renderChart1();
            this.renderChart2();
          },
          (error) => {
            console.error('Error submitting order:', error);
            // Handle error (e.g., show an error message)
          }
        )
      }
    }

    BranchOrder(branch:any){
      this.router.navigate(['SuperAdminBranches/internal-order'], {
        state: { branch }, // Pass the branch object as state
      });}

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
  ngOnDestroy(): void {
    console.log('ComponentOne destroyed');
  }

  loadProductDetails(){

  }
}
