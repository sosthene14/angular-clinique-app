import { Response } from 'express';
import { Op } from 'sequelize';
import Patient from '../models/Patient';
import Medecin from '../models/Medecin';
import RendezVous from '../models/RendezVous';
import { AuthRequest } from '../middleware/auth';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalPatients = await Patient.count();
    const totalMedecins = await Medecin.count();
    const totalRendezVous = await RendezVous.count();

    const rdvEnAttente = await RendezVous.count({ where: { statut: 'EN_ATTENTE' } });
    const rdvConfirme = await RendezVous.count({ where: { statut: 'CONFIRME' } });
    const rdvAnnule = await RendezVous.count({ where: { statut: 'ANNULE' } });
    const rdvTermine = await RendezVous.count({ where: { statut: 'TERMINE' } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const rdvAujourdhui = await RendezVous.count({
      where: {
        dateHeure: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });

    const rdvAVenir = await RendezVous.count({
      where: {
        dateHeure: { [Op.gte]: new Date() },
        statut: { [Op.in]: ['EN_ATTENTE', 'CONFIRME'] }
      }
    });

    res.json({
      totalPatients,
      totalMedecins,
      totalRendezVous,
      rdvParStatut: {
        EN_ATTENTE: rdvEnAttente,
        CONFIRME: rdvConfirme,
        ANNULE: rdvAnnule,
        TERMINE: rdvTermine
      },
      rdvAujourdhui,
      rdvAVenir
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
