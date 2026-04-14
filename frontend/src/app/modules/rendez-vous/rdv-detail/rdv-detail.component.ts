import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RdvService } from '../../../core/services/rdv.service';
import { RendezVous, StatutRdv } from '../../../shared/models/rendez-vous.model';

@Component({
  selector: 'app-rdv-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rdv-detail.component.html'
})
export class RdvDetailComponent implements OnChanges {
  @Input() rdvId: number | null = null;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  private rdvService = inject(RdvService);

  rdv: RendezVous | null = null;
  isLoading = false;
  error = '';

  ngOnChanges(): void {
    if (this.show && this.rdvId) {
      this.loadRdv();
    }
  }

  loadRdv(): void {
    if (!this.rdvId) return;
    
    this.isLoading = true;
    this.error = '';

    this.rdvService.getById(this.rdvId).subscribe({
      next: (data) => {
        this.rdv = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onClose(): void {
    this.rdv = null;
    this.close.emit();
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
}
