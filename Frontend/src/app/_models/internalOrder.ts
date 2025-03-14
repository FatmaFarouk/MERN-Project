export interface Product {
    productId: string;
    quantity: number;
  }
  
  export interface internalOrder {
    _id:string;
    branchId: string;
    requestedBy: string;
    status: 'Pending' | 'Approved';
    products: Product[];
    createdAt?: Date;
    updatedAt?: Date;
  }