import { Routes } from "@angular/router";
import { ListEventsComponent } from "./list-events/list-events.component";
import { AddComponent } from "./add/add.component";
import { ListByUserComponent } from "./list-by-user/list-by-user.component";
import { EventsOrgComponent } from "./events-org/events-org.component";
import { DetailsComponent } from "./details/details.component";

export const routes: Routes = [

    {path:'', component: ListEventsComponent},
    {path:'add', component: AddComponent},
    {path:'event/:id', component: AddComponent},
    {path:'details/:id', component: DetailsComponent},
    {path:'participations', component: ListByUserComponent},
    {path:'manage', component: EventsOrgComponent},

]