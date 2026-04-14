import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface PatientAttributes {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  cin: string;
  email: string;
  telephone: string;
  sexe: 'M' | 'F';
  groupeSanguin?: string;
  antecedents?: string;
}

class Patient extends Model<PatientAttributes> implements PatientAttributes {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public dateNaissance!: Date;
  public cin!: string;
  public email!: string;
  public telephone!: string;
  public sexe!: 'M' | 'F';
  public groupeSanguin?: string;
  public antecedents?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dateNaissance: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cin: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    sexe: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: false
    },
    groupeSanguin: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    antecedents: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'patients'
  }
);

export default Patient;
