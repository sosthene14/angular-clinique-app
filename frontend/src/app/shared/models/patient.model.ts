export interface Patient {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  cin: string;
  email: string;
  telephone: string;
  sexe: 'M' | 'F';
  groupeSanguin?: string;
  antecedents?: string;
  createdAt?: string;
  updatedAt?: string;
}
