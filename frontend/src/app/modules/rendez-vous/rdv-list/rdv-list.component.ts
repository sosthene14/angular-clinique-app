import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../../core/services/rdv.service';
import { RendezVous, StatutRdv } from '../../../shared/models/rendez-vous.model';
import { Page } from '../../../shared/models/page.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { RdvFormComponent } from '../rdv-form/rdv-form.component';
import { RdvDetailComponent } from '../rdv-detail/rdv-detail.component';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-rdv-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RdvFormComponent, RdvDetailComponent],
  templateUrl: './rdv-list.component.html'
})
export class RdvListComponent implements OnInit {
  private rdvService = inject(RdvService);
  permissionService = inject(PermissionService);

  rendezVous: RendezVous[] = [];
  pageData: Page<RendezVous> | null = null;
  currentPage = 0;
  pageSize = 10;
  selectedStatut: StatutRdv | '' = '';
  isLoading = false;
  error = '';
  showDeleteModal = false;
  rdvToDelete: RendezVous | null = null;
  showAddModal = false;
  showDetailModal = false;
  selectedRdvId: number | null = null;
  showEditModal = false;
  rdvToEdit: RendezVous | null = null;

  statuts: { value: StatutRdv | '', label: string }[] = [
    { value: '', label: 'Tous les statuts' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'CONFIRME', label: 'Confirmé' },
    { value: 'TERMINE', label: 'Terminé' },
    { value: 'ANNULE', label: 'Annulé' }
  ];

  ngOnInit(): void {
    this.loadRendezVous();
  }

  loadRendezVous(): void {
    this.isLoading = true;
    this.error = '';

    const statut = this.selectedStatut || undefined;
    
    this.rdvService.getAll(this.currentPage, this.pageSize, statut as StatutRdv).subscribe({
      next: (data) => {
        this.pageData = data;
        this.rendezVous = data.content;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des rendez-vous';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onStatutChange(): void {
    this.currentPage = 0;
    this.loadRendezVous();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRendezVous();
  }

  confirmDelete(rdv: RendezVous): void {
    this.rdvToDelete = rdv;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.rdvToDelete = null;
  }

  deleteRendezVous(): void {
    if (this.rdvToDelete?.id) {
      this.rdvService.delete(this.rdvToDelete.id).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.rdvToDelete = null;
          this.loadRendezVous();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }

  getStatutBadgeClass(statut: StatutRdv): string {
    const classes: { [key in StatutRdv]: string } = {
      'EN_ATTENTE': 'badge-warning',
      'CONFIRME': 'badge-info',
      'TERMINE': 'badge-success',
      'ANNULE': 'badge-danger'
    };
    return classes[statut];
  }

  getStatutLabel(statut: StatutRdv): string {
    const labels: { [key in StatutRdv]: string } = {
      'EN_ATTENTE': 'En attente',
      'CONFIRME': 'Confirmé',
      'TERMINE': 'Terminé',
      'ANNULE': 'Annulé'
    };
    return labels[statut];
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isUpcoming(dateTime: string): boolean {
    return new Date(dateTime) > new Date();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  onRdvAdded(): void {
    this.loadRendezVous();
  }

  viewRdv(rdv: RendezVous): void {
    this.selectedRdvId = rdv.id ?? null;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedRdvId = null;
  }

  editRdv(rdv: RendezVous): void {
    this.rdvToEdit = rdv;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.rdvToEdit = null;
  }

  onRdvEdited(): void {
    this.loadRendezVous();
  }
}
