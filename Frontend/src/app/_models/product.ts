export class Product {
    constructor(
        public _id: string, 
        public name: string, 
        public description : string, 
        public price: number, 
        public category: string, 
        public images: [string], 
        public stockQuantity: number, 
        public stockId: string,
        public branchLocation: string,
        public createdAt: string  = "",
        public isBestSeller: boolean,
        public salesCount: number,
        public SellerInfo: {_id: number, name: string},
        public isActive?: boolean,
        public productId?:string,
    ) {}
} 