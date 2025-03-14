import { Routes } from '@angular/router';
import { CashierHomeComponent } from '../Cashier/cashier-home/cashier-home.component';
import { CeckoutComponent } from '../Cashier/ceckout/ceckout.component';

const routes: Routes = [
    { path: '', component: CashierHomeComponent },
    {path:'checkout',component:CeckoutComponent}
];

export default routes;