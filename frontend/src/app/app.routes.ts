import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'patients',
    loadComponent: () => import('./modules/patients/patient-list/patient-list.component').then(m => m.PatientListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'medecins',
    loadComponent: () => import('./modules/medecins/medecin-list/medecin-list.component').then(m => m.MedecinListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'rendez-vous',
    loadComponent: () => import('./modules/rendez-vous/rdv-list/rdv-list.component').then(m => m.RdvListComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
