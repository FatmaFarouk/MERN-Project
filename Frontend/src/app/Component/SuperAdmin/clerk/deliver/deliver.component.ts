import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../../core/side-bar/side-bar.component';
import {internalOrder} from '../../../../_models/internalOrder'
import { BranchService } from '../../../../_services/branch.service';
import { getData } from '../../../../_services/getData.service';
@Component({
  selector: 'app-deliver',
  imports: [SideBarComponent],
  templateUrl: './deliver.component.html',
  styleUrl: './deliver.component.css'
})
export class DeliverComponent implements OnInit{

  orders:internalOrder[]=[];
  user:string="67c0e2eacd9ee525f3d92d89";
  constructor(private branchService:BranchService ,private getdata:getData){}
ngOnInit(): void {
  this.getAllorders();

}

getAllorders(){
  const user =this.getdata.getCustomerId();
this.branchService.getAllorders(this.user!).subscribe(
  (response) => {
    this.orders=response;
    console.log(this.orders);
    console.log('Order submitted successfully:', response);
    // Handle success (e.g., show a success message)
  },
  (error) => {
    console.error('Error submitting order:', error);
    // Handle error (e.g., show an error message)
  }
)
}

Confirm(order:string){}

}
