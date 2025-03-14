export class User {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role?: string;
    isActive?: number;
    
    constructor(
        firstName: string = '',
        lastName: string = '',
        email: string = '',
        password: string = '',
        role: string = 'customer',
        isActive: number = 1
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isActive = isActive;
    }
}
      
