import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedecinService } from '../../../core/services/medecin.service';
import { Medecin } from '../../../shared/models/medecin.model';

@Component({
  selector: 'app-medecin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medecin-form.component.html'
})
export class MedecinFormComponent implements OnChanges {
  @Input() show = false;
  @Input() medecin: Medecin | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private medecinService = inject(MedecinService);

  medecinForm: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    specialite: ['', [Validators.required]],
    email: ['', [Validators.email]],
    telephone: ['', [Validators.required]],
    matricule: ['', [Validators.required, Validators.minLength(3)]],
    disponible: [true]
  });

  specialites = [
    'Cardiologie',
    'Dermatologie',
    'Pédiatrie',
    'Gynécologie',
    'Neurologie',
    'Ophtalmologie',
    'ORL',
    'Psychiatrie',
    'Radiologie',
    'Chirurgie générale',
    'Médecine générale',
    'Autre'
  ];

  errorMessage = '';
  isLoading = false;

  ngOnChanges(): void {
    if (this.show && this.medecin) {
      this.medecinForm.patchValue(this.medecin);
    } else if (this.show && !this.medecin) {
      this.medecinForm.reset({ disponible: true });
    }
  }

  get isEditMode(): boolean {
    return !!this.medecin;
  }

  onSubmit(): void {
    if (this.medecinForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const request = this.isEditMode && this.medecin?.id
        ? this.medecinService.update(this.medecin.id, this.medecinForm.value)
        : this.medecinService.create(this.medecinForm.value);

      request.subscribe({
        next: () => {
          this.isLoading = false;
          this.medecinForm.reset({ disponible: true });
          this.success.emit();
          this.onClose();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de l\'opération';
          this.isLoading = false;
        }
      });
    }
  }

  onClose(): void {
    this.medecinForm.reset({ disponible: true });
    this.errorMessage = '';
    this.close.emit();
  }
}
