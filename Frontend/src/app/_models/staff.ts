export class Staff {
  constructor(
  public _id?: string,
  public firstName?: string,
  public lastName?: string,
  public email?: string,
  public branchId?: string,
  public role?: 'cashier' | 'clerk',
  public isActive?: boolean,
  ){}
}
