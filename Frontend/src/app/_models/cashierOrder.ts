export enum PaymentMethod {
    CreditCard = 'credit_card',
    DebitCard = 'debit_card',
    PayPal = 'paypal',
    BankTransfer = 'bank_transfer',
    CashOnDelivery = 'cash_on_delivery'
  }
  
  export class order {
    constructor(
      public CashierId?: string,
      public paymentMethod?: PaymentMethod, 
      public CreditCardNumber?:number,
      public ExpiryMonth?:number,
      public ExpiryYear?:number,
      public CVVCode?:number,
    ) {}
  }
  