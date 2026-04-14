import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { PermissionService } from './core/services/permission.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html'
})
export class AppComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  permissionService = inject(PermissionService);

  currentUser = this.authService.getCurrentUser();
  isDarkMode = this.themeService.isDarkMode();

  constructor() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
