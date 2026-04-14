import { Response } from 'express';
import { Op } from 'sequelize';
import RendezVous from '../models/RendezVous';
import Patient from '../models/Patient';
import Medecin from '../models/Medecin';
import { AuthRequest } from '../middleware/auth';

export const getAllRendezVous = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;
    const statut = req.query.statut as string;
    const medecinId = req.query.medecinId as string;

    const where: any = {};
    if (statut) where.statut = statut;
    if (medecinId) where.medecinId = parseInt(medecinId);

    const { count, rows } = await RendezVous.findAndCountAll({
      where,
      include: [
        { model: Patient, as: 'patient' },
        { model: Medecin, as: 'medecin' }
      ],
      limit: size,
      offset: page * size,
      order: [['dateHeure', 'DESC']]
    });

    res.json({
      content: rows,
      totalElements: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      size
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const getRendezVousById = async (req: AuthRequest, res: Response) => {
  try {
    const rdv = await RendezVous.findByPk(req.params.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Medecin, as: 'medecin' }
      ]
    });
    if (!rdv) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json(rdv);
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const createRendezVous = async (req: AuthRequest, res: Response) => {
  try {
    const rdv = await RendezVous.create(req.body);
    const rdvWithRelations = await RendezVous.findByPk(rdv.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Medecin, as: 'medecin' }
      ]
    });
    res.status(201).json(rdvWithRelations);
  } catch (error: any) {
    res.status(400).json({ message: 'Erreur de validation', error: error.message });
  }
};

export const updateRendezVous = async (req: AuthRequest, res: Response) => {
  try {
    const rdv = await RendezVous.findByPk(req.params.id);
    if (!rdv) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    await rdv.update(req.body);
    const updated = await RendezVous.findByPk(rdv.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Medecin, as: 'medecin' }
      ]
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: 'Erreur de validation', error: error.message });
  }
};

export const deleteRendezVous = async (req: AuthRequest, res: Response) => {
  try {
    const rdv = await RendezVous.findByPk(req.params.id);
    if (!rdv) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    await rdv.destroy();
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
