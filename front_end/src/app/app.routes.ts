import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { ForgotPassword } from './features/forgot-password/forgot-password';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'forgot-password', component: ForgotPassword },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];