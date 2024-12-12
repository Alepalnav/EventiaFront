import { Routes } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { UsersComponent } from "./users/users.component";

export const routes: Routes = [

    {path:'', component: LoginComponent},
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    {path:'users', component: UsersComponent},

]