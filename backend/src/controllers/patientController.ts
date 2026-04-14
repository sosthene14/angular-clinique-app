import { Response } from 'express';
import { Op } from 'sequelize';
import Patient from '../models/Patient';
import { AuthRequest } from '../middleware/auth';

export const getAllPatients = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'nom';

    const { count, rows } = await Patient.findAndCountAll({
      limit: size,
      offset: page * size,
      order: [[sortBy, 'ASC']]
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

export const searchPatients = async (req: AuthRequest, res: Response) => {
  try {
    const keyword = req.query.keyword as string || '';
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;

    const { count, rows } = await Patient.findAndCountAll({
      where: {
        [Op.or]: [
          { nom: { [Op.like]: `%${keyword}%` } },
          { prenom: { [Op.like]: `%${keyword}%` } },
          { cin: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } }
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

export const getPatientById = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    res.json(patient);
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

export const createPatient = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error: any) {
    res.status(400).json({ message: 'Erreur de validation', error: error.message });
  }
};

export const updatePatient = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    await patient.update(req.body);
    res.json(patient);
  } catch (error: any) {
    res.status(400).json({ message: 'Erreur de validation', error: error.message });
  }
};

export const deletePatient = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    await patient.destroy();
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
