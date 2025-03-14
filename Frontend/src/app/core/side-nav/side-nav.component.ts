import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {OrderService} from '../../_services/cashierOrder.service'
import { Staff } from '../../_models/staff';


@Component({
  selector: 'app-side-nav',
  standalone: true, // Mark the component as standalone
  imports: [
    CommonModule,
    MatToolbarModule, 
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit {
  isSideNavOpen = true; 
  cashierData?:Staff ;

  constructor(private cashierService:OrderService){}

  ngOnInit(): void {
   const cashierId = localStorage.getItem('StaffId') || '';
    this.getCashierData(cashierId)
  }

  getCashierData(cashierId:string){
    this.cashierService.getCashier(cashierId).subscribe({
      next:(data)=>{
        this.cashierData=data;
      },
      error:(err)=>{
        console.log('Error fetching cashier data:', err);
      }
    });
  }

  logout()
  {
    localStorage.clear();
  }

}
