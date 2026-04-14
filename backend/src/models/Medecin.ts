import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface MedecinAttributes {
  id?: number;
  nom: string;
  prenom: string;
  specialite: string;
  email: string;
  telephone: string;
  matricule: string;
  disponible: boolean;
}

class Medecin extends Model<MedecinAttributes> implements MedecinAttributes {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public specialite!: string;
  public email!: string;
  public telephone!: string;
  public matricule!: string;
  public disponible!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Medecin.init(
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
    specialite: {
      type: DataTypes.STRING(100),
      allowNull: false
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
    matricule: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'medecins'
  }
);

export default Medecin;
