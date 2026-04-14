export interface DashboardStats {
  totalPatients: number;
  totalMedecins: number;
  totalRendezVous: number;
  rdvParStatut: {
    EN_ATTENTE: number;
    CONFIRME: number;
    ANNULE: number;
    TERMINE: number;
  };
  rdvAujourdhui: number;
  rdvAVenir: number;
}
