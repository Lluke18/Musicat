import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkWithHref } from '@angular/router';
import { PlayerComponent } from './components/player/player';
import { UserProfileComponent } from "./components/user-profile/user-profile";
// HERE IMPORT COMPONENTS YOU WANT TO USE IN THE APP HTML


@Component({
  selector: 'app-root',
  standalone: true,
  // 2. ADD IT TO THIS LIST SO THE HTML CAN USE IT
  imports: [RouterOutlet, PlayerComponent, RouterLink, RouterLinkWithHref], //ALSO ADD HERE COMPONENTS
  templateUrl: './app.html',
  styleUrl: './app.css' // Note: verify if your file is app.css or app.scss

})
export class App {
  title = 'my-music-app';
}                                         