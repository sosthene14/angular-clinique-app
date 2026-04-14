import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedecinService } from '../../../core/services/medecin.service';
import { Medecin } from '../../../shared/models/medecin.model';
import { Page } from '../../../shared/models/page.model';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { MedecinFormComponent } from '../medecin-form/medecin-form.component';
import { MedecinDetailComponent } from '../medecin-detail/medecin-detail.component';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-medecin-list',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, PaginationComponent, MedecinFormComponent, MedecinDetailComponent],
  templateUrl: './medecin-list.component.html'
})
export class MedecinListComponent implements OnInit {
  private medecinService = inject(MedecinService);
  permissionService = inject(PermissionService);

  medecins: Medecin[] = [];
  pageData: Page<Medecin> | null = null;
  currentPage = 0;
  pageSize = 10;
  searchKeyword = '';
  isLoading = false;
  error = '';
  showDeleteModal = false;
  medecinToDelete: Medecin | null = null;
  showAddModal = false;
  showDetailModal = false;
  selectedMedecinId: number | null = null;
  showEditModal = false;
  medecinToEdit: Medecin | null = null;

  ngOnInit(): void {
    this.loadMedecins();
  }

  loadMedecins(): void {
    this.isLoading = true;
    this.error = '';

    const request = this.searchKeyword
      ? this.medecinService.search(this.searchKeyword, this.currentPage, this.pageSize)
      : this.medecinService.getAll(this.currentPage, this.pageSize);

    request.subscribe({
      next: (data) => {
        this.pageData = data;
        this.medecins = data.content;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des médecins';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSearch(keyword: string): void {
    this.searchKeyword = keyword;
    this.currentPage = 0;
    this.loadMedecins();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMedecins();
  }

  confirmDelete(medecin: Medecin): void {
    this.medecinToDelete = medecin;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.medecinToDelete = null;
  }

  deleteMedecin(): void {
    if (this.medecinToDelete?.id) {
      this.medecinService.delete(this.medecinToDelete.id).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.medecinToDelete = null;
          this.loadMedecins();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }

  getSpecialiteColor(specialite: string): string {
    const colors: { [key: string]: string } = {
      'Cardiologie': 'badge-danger',
      'Dermatologie': 'badge-warning',
      'Pédiatrie': 'badge-info',
      'Neurologie': 'badge-success',
      'Orthopédie': 'badge-warning',
      'Gynécologie': 'badge-info'
    };
    return colors[specialite] || 'badge-info';
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  onMedecinAdded(): void {
    this.loadMedecins();
  }

  viewMedecin(medecin: Medecin): void {
    this.selectedMedecinId = medecin.id ?? null;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedMedecinId = null;
  }

  editMedecin(medecin: Medecin): void {
    this.medecinToEdit = medecin;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.medecinToEdit = null;
  }

  onMedecinEdited(): void {
    this.loadMedecins();
  }
}
