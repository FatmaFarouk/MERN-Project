import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../../_services/branch.service';
import { Inventory } from '../../../../_models/Inventory';
import { SideBarComponent } from '../../core/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { InternalOrderComponent } from '../internal-order/internal-order.component';
import { Router, RouterModule } from '@angular/router';
import { getData } from '../../../../_services/getData.service';

@Component({
  selector: 'app-branches',
  imports: [SideBarComponent,CommonModule,InternalOrderComponent,RouterModule],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class BranchesComponent implements OnInit {

  branches: Inventory[] = [];
  
  constructor(private branchService: BranchService ,private router: Router ,private getdata:getData){

  }
        
  ngOnInit(): void {
    this.getAllbranches();
  }
  getAllbranches(){
    const user= this.getdata.getCustomerId
    this.branchService.getAllBranches().subscribe(
      (data) => {
        this.branches = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching branches:', error);
      }
    );
  }
 ShowBranch(branch:any){
    this.router.navigate(['SuperAdminBranches/branchDetails',branch.branchLocation], {
      state: { branch }, // Pass the branch object as state
    });
    
  }
}
