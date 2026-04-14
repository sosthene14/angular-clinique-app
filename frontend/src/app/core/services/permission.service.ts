import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

export type UserRole = 'ADMIN' | 'MEDECIN' | 'USER';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private authService = inject(AuthService);

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: UserRole): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === role;
  }

  // Vérifier si l'utilisateur a l'un des rôles
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.authService.getCurrentUser();
    return user ? roles.includes(user.role as UserRole) : false;
  }

  // Permissions spécifiques
  canManagePatients(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN']);
  }

  canManageMedecins(): boolean {
    return this.hasRole('ADMIN');
  }

  canManageRendezVous(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN', 'USER']);
  }

  canDeletePatient(): boolean {
    return this.hasRole('ADMIN');
  }

  canDeleteMedecin(): boolean {
    return this.hasRole('ADMIN');
  }

  canDeleteRendezVous(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN']);
  }

  canViewDashboard(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN']);
  }

  canCreatePatient(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN']);
  }

  canCreateMedecin(): boolean {
    return this.hasRole('ADMIN');
  }

  canCreateRendezVous(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN', 'USER']);
  }

  canEditPatient(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN']);
  }

  canEditMedecin(): boolean {
    return this.hasRole('ADMIN');
  }

  canEditRendezVous(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN']);
  }

  // Permissions de lecture
  canViewPatients(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN', 'USER']);
  }

  canViewMedecins(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN', 'USER']);
  }

  canViewRendezVous(): boolean {
    return this.hasAnyRole(['ADMIN', 'MEDECIN', 'USER']);
  }

  // Obtenir le rôle actuel
  getCurrentRole(): UserRole | null {
    const user = this.authService.getCurrentUser();
    return user?.role as UserRole || null;
  }

  // Vérifier si c'est un admin
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  // Vérifier si c'est un médecin
  isMedecin(): boolean {
    return this.hasRole('MEDECIN');
  }

  // Vérifier si c'est un utilisateur simple
  isUser(): boolean {
    return this.hasRole('USER');
  }
}
