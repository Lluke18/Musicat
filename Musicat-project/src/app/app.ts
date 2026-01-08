import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from './audio-player.component';
// 1. IMPORT THE PLAYER


@Component({
  selector: 'app-root',
  standalone: true,
  // 2. ADD IT TO THIS LIST SO THE HTML CAN USE IT
  imports: [RouterOutlet, AudioPlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css' // Note: verify if your file is app.css or app.scss

})
export class App {
  title = 'my-music-app';
}                                         