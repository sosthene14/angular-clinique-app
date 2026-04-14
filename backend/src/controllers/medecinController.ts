import { Response } from 'express';
import { Op } from 'sequelize';
import Medecin from '../models/Medecin';
import { AuthRequest } from '../middleware/auth';

export const getAllMedecins = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;

    const { count, rows } = await Medecin.findAndCountAll({
      limit: size,
      offset: page * size,
      order: [['nom', 'ASC']]
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

export const searchMedecins = async (req: AuthRequest, res: Response) => {
  try {
    const keyword = req.query.keyword as string || '';
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;

    const { count, rows } = await Medecin.findAndCountAll({
      where: {
        [Op.or]: [
          { nom: { [Op.like]: `%${keyword}%` } },
          { prenom: { [Op.like]: `%${keyword}%` } },
          { specialite: { [Op.like]: `%${keyword}%` } },
          { matricule: { [Op.like]: `%${keyword}%` } }
        ]
      },
      limit: size,
      offset: page * size,
      order: [['nom', 'ASC']]
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

export const getMedecinById = async (req: AuthRequest, res: Response) => {
  try {
    const medecin = await Medecin.findByPk(req.params.id);
    if (!medecin) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }
    res.json(medecin);
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const createMedecin = async (req: AuthRequest, res: Response) => {
  try {
    const medecin = await Medecin.create(req.body);
    res.status(201).json(medecin);
  } catch (error: any) {
    res.status(400).json({ message: 'Erreur de validation', error: error.message });
  }
};

export const updateMedecin = async (req: AuthRequest, res: Response) => {
  try {
    const medecin = await Medecin.findByPk(req.params.id);
    if (!medecin) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }
    await medecin.update(req.body);
    res.json(medecin);
  } catch (error: any) {
    res.status(400).json({ message: 'Erreur de validation', error: error.message });
  }
};

export const deleteMedecin = async (req: AuthRequest, res: Response) => {
  try {
    const medecin = await Medecin.findByPk(req.params.id);
    if (!medecin) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }
    await medecin.destroy();
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
