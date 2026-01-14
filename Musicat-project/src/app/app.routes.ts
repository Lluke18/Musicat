import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { PlayerComponent } from './components/player/player';
import { App } from './app';


export const routes: Routes = [
    {path: '', component: PlayerComponent}, //playerComponent is used as HomeComponent, in the future 
    //create a dedicated HomeComponent
    { path: 'auth', component: UserProfileComponent },
   // {path: '', component: PlayerComponent},
    //{ path: 'auth', component: UserProfile }
];
