import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-detail.component.html'
})
export class PatientDetailComponent implements OnChanges {
  @Input() patientId: number | null = null;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  private patientService = inject(PatientService);

  patient: Patient | null = null;
  isLoading = false;
  error = '';

  ngOnChanges(): void {
    if (this.show && this.patientId) {
      this.loadPatient();
    }
  }

  loadPatient(): void {
    if (!this.patientId) return;
    
    this.isLoading = true;
    this.error = '';

    this.patientService.getById(this.patientId).subscribe({
      next: (data) => {
        this.patient = data;
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
    this.patient = null;
    this.close.emit();
  }

  calculateAge(dateNaissance: string): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
