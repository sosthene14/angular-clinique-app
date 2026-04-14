import { Patient } from './patient.model';
import { Medecin } from './medecin.model';

export type StatutRdv = 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | 'TERMINE';

export interface RendezVous {
  id?: number;
  dateHeure: string;
  statut: StatutRdv;
  motif: string;
  notes?: string;
  patientId: number;
  medecinId: number;
  patient?: Patient;
  medecin?: Medecin;
  createdAt?: string;
  updatedAt?: string;
}
