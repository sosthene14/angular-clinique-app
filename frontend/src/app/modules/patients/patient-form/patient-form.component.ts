import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.component.html'
})
export class PatientFormComponent implements OnChanges {
  @Input() show = false;
  @Input() patient: Patient | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);

  patientForm: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    dateNaissance: ['', [Validators.required]],
    cin: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.email]],
    telephone: ['', [Validators.required]],
    sexe: ['M', [Validators.required]],
    groupeSanguin: [''],
    antecedents: ['']
  });

  errorMessage = '';
  isLoading = false;

  ngOnChanges(): void {
    if (this.show && this.patient) {
      this.patientForm.patchValue({
        ...this.patient,
        dateNaissance: this.patient.dateNaissance?.split('T')[0]
      });
    } else if (this.show && !this.patient) {
      this.patientForm.reset({ sexe: 'M' });
    }
  }

  get isEditMode(): boolean {
    return !!this.patient;
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const request = this.isEditMode && this.patient?.id
        ? this.patientService.update(this.patient.id, this.patientForm.value)
        : this.patientService.create(this.patientForm.value);

      request.subscribe({
        next: () => {
          this.isLoading = false;
          this.patientForm.reset({ sexe: 'M' });
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
    this.patientForm.reset({ sexe: 'M' });
    this.errorMessage = '';
    this.close.emit();
  }
}
