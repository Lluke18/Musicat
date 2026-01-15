import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkWithHref, Router, NavigationEnd } from '@angular/router';
import { PlayerComponent } from './components/player/player';
import { UserProfileComponent } from "./components/user-profile/user-profile";
import { AuthService, User } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
// HERE IMPORT COMPONENTS YOU WANT TO USE IN THE APP HTML


@Component({
  selector: 'app-root',
  standalone: true,
  // 2. ADD IT TO THIS LIST SO THE HTML CAN USE IT
  imports: [RouterOutlet,  RouterLink, RouterLinkWithHref, CommonModule], //ALSO ADD HERE COMPONENTS
  templateUrl: './app.html',
  styleUrl: './app.css' // Note: verify if your file is app.css or app.scss

})
export class App implements OnInit, OnDestroy {
  title = 'my-music-app';
  currentUser: User | null = null;
  private routerSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check for logged in user on init
    this.currentUser = this.authService.getUserFromLocalStorage();
    
    // Listen to route changes to update user state
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentUser = this.authService.getUserFromLocalStorage();
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
    this.router.navigate(['/']);
  }
}                                         