import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Inventory } from '../../../../_models/Inventory';
import { BranchService } from '../../../../_services/branch.service';
import { Product } from '../../../../_models/product';

@Component({
  selector: 'app-internal-order',
  imports:[CommonModule,FormsModule],
  templateUrl: './internal-order.component.html',
  styleUrls: ['./internal-order.component.css'],
})
export class InternalOrderComponent implements OnInit{
  order = {
    productId: '',
    quantity: 0,
    from: '507f1f77bcf86cd799439011',
    To: '',
  };

  products:Product[]=[];

    constructor(private branchesservice:BranchService){}
  branch:Inventory |null =null;

  searchQuery: string = '';
  filteredProducts: any[] = [...this.products!];
  ngOnInit(): void {
    this.branch=history.state.branch;
    console.log(this.branch)

    this.branchesservice.getProductsInbranch(this.order.from).subscribe(
      (response) => {
       this.products=response
      },
      (error) => {
        console.error('Error submitting order:', error);
        
      }
    )
  }
  filterProducts(): void {
    if (!this.searchQuery) {
      // If the search query is empty, show all products
      this.filteredProducts = [...this.products!];
    } else {
      // Filter products by name or ID
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products?.filter((product) =>
        product._id.toLowerCase().includes(query) 
      )||[];
    }
  }


  onSubmit(): void {
    console.log(this.order.productId.trim(),this.order.quantity)
    console.log(this.branch);
    if (this.isFormValid()) {
      this.order.To=this.branch!._id;
      console.log(this.order);
      this.branchesservice.setInternalorder(this.order).subscribe(
        (response) => {
          console.log('Order submitted successfully:', response);
          
        },
        (error) => {
          console.error('Error submitting order:', error);
     
        }
      );
      this.resetForm(); 
    } else {
      console.log('Form is invalid');
      alert("enter invalid Data")
    }
  }

  
  isFormValid(): boolean {
    return (
      this.order.productId.trim() !== '' &&
      this.order.quantity > 0
    );
  }

  // Reset the form
  resetForm(): void {
    this.order = {
      productId: '',
      quantity: 0,
      from: 'MainBranch',
      To: "",
    };
  }
}
