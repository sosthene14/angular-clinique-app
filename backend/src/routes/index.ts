import { Router } from 'express';
import { register, login } from '../controllers/authController';
import * as patientController from '../controllers/patientController';
import * as medecinController from '../controllers/medecinController';
import * as rdvController from '../controllers/rdvController';
import * as dashboardController from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Auth routes (public)
router.post('/auth/register', register);
router.post('/auth/login', login);

// Protected routes
router.use(authenticateToken);

// Patients
router.get('/patients', patientController.getAllPatients);
router.get('/patients/search', patientController.searchPatients);
router.get('/patients/:id', patientController.getPatientById);
router.post('/patients', patientController.createPatient);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);

// Medecins
router.get('/medecins', medecinController.getAllMedecins);
router.get('/medecins/search', medecinController.searchMedecins);
router.get('/medecins/:id', medecinController.getMedecinById);
router.post('/medecins', medecinController.createMedecin);
router.put('/medecins/:id', medecinController.updateMedecin);
router.delete('/medecins/:id', medecinController.deleteMedecin);

// Rendez-vous
router.get('/rdv', rdvController.getAllRendezVous);
router.get('/rdv/:id', rdvController.getRendezVousById);
router.post('/rdv', rdvController.createRendezVous);
router.put('/rdv/:id', rdvController.updateRendezVous);
router.delete('/rdv/:id', rdvController.deleteRendezVous);

// Dashboard
router.get('/dashboard/stats', dashboardController.getStats);

export default router;
