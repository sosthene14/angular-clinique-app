import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../shared/models/patient.model';
import { Page } from '../../../shared/models/page.model';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { PatientDetailComponent } from '../patient-detail/patient-detail.component';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBarComponent, PaginationComponent, PatientFormComponent, PatientDetailComponent],
  templateUrl: './patient-list.component.html'
})
export class PatientListComponent implements OnInit {
  private patientService = inject(PatientService);
  permissionService = inject(PermissionService);

  patients: Patient[] = [];
  pageData: Page<Patient> | null = null;
  currentPage = 0;
  pageSize = 10;
  searchKeyword = '';
  isLoading = false;
  error = '';
  showDeleteModal = false;
  patientToDelete: Patient | null = null;
  showAddModal = false;
  showDetailModal = false;
  selectedPatientId: number | null = null;
  showEditModal = false;
  patientToEdit: Patient | null = null;

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;
    this.error = '';

    const request = this.searchKeyword
      ? this.patientService.search(this.searchKeyword, this.currentPage, this.pageSize)
      : this.patientService.getAll(this.currentPage, this.pageSize);

    request.subscribe({
      next: (data) => {
        this.pageData = data;
        this.patients = data.content;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des patients';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSearch(keyword: string): void {
    this.searchKeyword = keyword;
    this.currentPage = 0;
    this.loadPatients();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPatients();
  }

  confirmDelete(patient: Patient): void {
    this.patientToDelete = patient;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.patientToDelete = null;
  }

  deletePatient(): void {
    if (this.patientToDelete?.id) {
      this.patientService.delete(this.patientToDelete.id).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.patientToDelete = null;
          this.loadPatients();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
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

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  onPatientAdded(): void {
    this.loadPatients();
  }

  viewPatient(patient: Patient): void {
    this.selectedPatientId = patient.id ?? null;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedPatientId = null;
  }

  editPatient(patient: Patient): void {
    this.patientToEdit = patient;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.patientToEdit = null;
  }

  onPatientEdited(): void {
    this.loadPatients();
  }
}
