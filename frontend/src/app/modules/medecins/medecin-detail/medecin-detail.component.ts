import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedecinService } from '../../../core/services/medecin.service';
import { Medecin } from '../../../shared/models/medecin.model';

@Component({
  selector: 'app-medecin-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medecin-detail.component.html'
})
export class MedecinDetailComponent implements OnChanges {
  @Input() medecinId: number | null = null;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  private medecinService = inject(MedecinService);

  medecin: Medecin | null = null;
  isLoading = false;
  error = '';

  ngOnChanges(): void {
    if (this.show && this.medecinId) {
      this.loadMedecin();
    }
  }

  loadMedecin(): void {
    if (!this.medecinId) return;
    
    this.isLoading = true;
    this.error = '';

    this.medecinService.getById(this.medecinId).subscribe({
      next: (data) => {
        this.medecin = data;
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
    this.medecin = null;
    this.close.emit();
  }
}
