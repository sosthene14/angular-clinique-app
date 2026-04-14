import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Patient from './Patient';
import Medecin from './Medecin';

export interface RendezVousAttributes {
  id?: number;
  dateHeure: Date;
  statut: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | 'TERMINE';
  motif: string;
  notes?: string;
  patientId: number;
  medecinId: number;
}

class RendezVous extends Model<RendezVousAttributes> implements RendezVousAttributes {
  public id!: number;
  public dateHeure!: Date;
  public statut!: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | 'TERMINE';
  public motif!: string;
  public notes?: string;
  public patientId!: number;
  public medecinId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RendezVous.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    dateHeure: {
      type: DataTypes.DATE,
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM('EN_ATTENTE', 'CONFIRME', 'ANNULE', 'TERMINE'),
      defaultValue: 'EN_ATTENTE'
    },
    motif: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id'
      }
    },
    medecinId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'medecins',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'rendez_vous'
  }
);

// Relations
RendezVous.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
RendezVous.belongsTo(Medecin, { foreignKey: 'medecinId', as: 'medecin' });
Patient.hasMany(RendezVous, { foreignKey: 'patientId' });
Medecin.hasMany(RendezVous, { foreignKey: 'medecinId' });

export default RendezVous;
