import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RendezVous, StatutRdv } from '../../shared/models/rendez-vous.model';
import { Page } from '../../shared/models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RdvService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rdv`;

  getAll(page: number = 0, size: number = 10, statut?: StatutRdv, medecinId?: number): Observable<Page<RendezVous>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (statut) {
      params = params.set('statut', statut);
    }
    if (medecinId) {
      params = params.set('medecinId', medecinId.toString());
    }
    
    return this.http.get<Page<RendezVous>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<RendezVous> {
    return this.http.get<RendezVous>(`${this.apiUrl}/${id}`);
  }

  create(rdv: RendezVous): Observable<RendezVous> {
    return this.http.post<RendezVous>(this.apiUrl, rdv);
  }

  update(id: number, rdv: RendezVous): Observable<RendezVous> {
    return this.http.put<RendezVous>(`${this.apiUrl}/${id}`, rdv);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
