import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MyDataPageComponent } from './components/my-data-page/my-data-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { MenuPageComponent } from './components/menu-page/menu-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'home', component: HomeComponent},
    {path: 'my-data-page', component: MyDataPageComponent},
    {path: 'login-page', component: LoginPageComponent},
    {path: 'register-page', component: RegisterPageComponent},
    {path: 'menu-page', component: MenuPageComponent}
];
