import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../shared/models/dashboard.model';
import { PermissionService } from '../../core/services/permission.service';
import { PatientFormComponent } from '../patients/patient-form/patient-form.component';
import { MedecinFormComponent } from '../medecins/medecin-form/medecin-form.component';
import { RdvFormComponent } from '../rendez-vous/rdv-form/rdv-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientFormComponent, MedecinFormComponent, RdvFormComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  permissionService = inject(PermissionService);

  stats: DashboardStats | null = null;
  isLoading = true;
  error = '';
  
  showPatientModal = false;
  showMedecinModal = false;
  showRdvModal = false;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des statistiques';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  get rdvStatutData() {
    if (!this.stats) return [];
    return [
      { label: 'En attente', value: this.stats.rdvParStatut.EN_ATTENTE, color: 'bg-yellow-500' },
      { label: 'Confirmé', value: this.stats.rdvParStatut.CONFIRME, color: 'bg-blue-500' },
      { label: 'Terminé', value: this.stats.rdvParStatut.TERMINE, color: 'bg-green-500' },
      { label: 'Annulé', value: this.stats.rdvParStatut.ANNULE, color: 'bg-red-500' }
    ];
  }

  getPercentage(value: number): number {
    if (!this.stats) return 0;
    const total = this.stats.totalRendezVous;
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  openPatientModal(): void {
    if (this.permissionService.canCreatePatient()) {
      this.showPatientModal = true;
    } else {
      this.router.navigate(['/patients']);
    }
  }

  closePatientModal(): void {
    this.showPatientModal = false;
  }

  onPatientAdded(): void {
    this.loadStats();
  }

  openMedecinModal(): void {
    if (this.permissionService.canCreateMedecin()) {
      this.showMedecinModal = true;
    } else {
      this.router.navigate(['/medecins']);
    }
  }

  closeMedecinModal(): void {
    this.showMedecinModal = false;
  }

  onMedecinAdded(): void {
    this.loadStats();
  }

  openRdvModal(): void {
    if (this.permissionService.canCreateRendezVous()) {
      this.showRdvModal = true;
    } else {
      this.router.navigate(['/rendez-vous']);
    }
  }

  closeRdvModal(): void {
    this.showRdvModal = false;
  }

  onRdvAdded(): void {
    this.loadStats();
  }
}
