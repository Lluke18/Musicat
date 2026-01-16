import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { PlayerComponent } from './components/player/player';
import { Friendship } from './components/friendship/friendship';
import { PlaylistComponent } from './components/playlist/playlist';
import { App } from './app';


export const routes: Routes = [
    {path: '', component: PlayerComponent}, //playerComponent is used as HomeComponent, in the future 
    //create a dedicated HomeComponent
    { path: 'auth', component: UserProfileComponent },
    { path: 'friendships', component: Friendship },
    { path: 'playlists', component: PlaylistComponent },
   // {path: '', component: PlayerComponent},
    //{ path: 'auth', component: UserProfile }
];
