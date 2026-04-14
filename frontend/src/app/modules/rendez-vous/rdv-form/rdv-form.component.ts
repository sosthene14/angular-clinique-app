import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RdvService } from '../../../core/services/rdv.service';
import { PatientService } from '../../../core/services/patient.service';
import { MedecinService } from '../../../core/services/medecin.service';
import { Patient } from '../../../shared/models/patient.model';
import { Medecin } from '../../../shared/models/medecin.model';
import { RendezVous } from '../../../shared/models/rendez-vous.model';

@Component({
  selector: 'app-rdv-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rdv-form.component.html'
})
export class RdvFormComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() rdv: RendezVous | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private rdvService = inject(RdvService);
  private patientService = inject(PatientService);
  private medecinService = inject(MedecinService);

  rdvForm: FormGroup = this.fb.group({
    patientId: ['', [Validators.required]],
    medecinId: ['', [Validators.required]],
    dateHeure: ['', [Validators.required]],
    motif: ['', [Validators.required, Validators.minLength(5)]],
    notes: [''],
    statut: ['EN_ATTENTE']
  });

  patients: Patient[] = [];
  medecins: Medecin[] = [];
  errorMessage = '';
  isLoading = false;
  isLoadingData = false;

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(): void {
    if (this.show && this.rdv) {
      this.rdvForm.patchValue({
        patientId: this.rdv.patient?.id || '',
        medecinId: this.rdv.medecin?.id || '',
        dateHeure: this.rdv.dateHeure?.slice(0, 16),
        motif: this.rdv.motif,
        notes: this.rdv.notes || '',
        statut: this.rdv.statut
      });
    } else if (this.show && !this.rdv) {
      this.rdvForm.reset({ statut: 'EN_ATTENTE' });
    }
  }

  get isEditMode(): boolean {
    return !!this.rdv;
  }

  loadData(): void {
    this.isLoadingData = true;
    
    // Load patients and medecins
    this.patientService.getAll(0, 100).subscribe({
      next: (data) => {
        this.patients = data.content;
      },
      error: (err) => console.error('Error loading patients', err)
    });

    this.medecinService.getAll(0, 100).subscribe({
      next: (data) => {
        this.medecins = data.content.filter(m => m.disponible);
        this.isLoadingData = false;
      },
      error: (err) => {
        console.error('Error loading medecins', err);
        this.isLoadingData = false;
      }
    });
  }

  onSubmit(): void {
    if (this.rdvForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = {
        ...this.rdvForm.value,
        patientId: parseInt(this.rdvForm.value.patientId),
        medecinId: parseInt(this.rdvForm.value.medecinId)
      };

      const request = this.isEditMode && this.rdv?.id
        ? this.rdvService.update(this.rdv.id, formData)
        : this.rdvService.create(formData);

      request.subscribe({
        next: () => {
          this.isLoading = false;
          this.rdvForm.reset({ statut: 'EN_ATTENTE' });
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
    this.rdvForm.reset({ statut: 'EN_ATTENTE' });
    this.errorMessage = '';
    this.close.emit();
  }

  getMinDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }
}
