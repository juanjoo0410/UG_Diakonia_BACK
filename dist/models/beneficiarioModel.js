"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beneficiario = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const tipoOrgModel_1 = require("./tipoOrgModel");
const tipoPoblacionModel_1 = require("./tipoPoblacionModel");
const clasificacionModel_1 = require("./clasificacionModel");
class Beneficiario extends sequelize_1.Model {
}
exports.Beneficiario = Beneficiario;
Beneficiario.init({
    idBeneficiario: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(9), allowNull: false },
    identificacion: { type: sequelize_1.DataTypes.STRING(15), allowNull: false },
    nombre: { type: sequelize_1.DataTypes.STRING(150), allowNull: false },
    tipoBeneficiario: { type: sequelize_1.DataTypes.STRING(15), allowNull: false },
    idTipoOrg: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'tipos_org',
            key: 'idTipoOrg'
        }
    },
    idTipoPoblacion: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'tipos_poblacion',
            key: 'idTipoPoblacion'
        }
    },
    idClasificacion: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'clasificacion',
            key: 'idClasificacion'
        }
    },
    actividad: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    totalBeneficiarios: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    direccion: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
    telefono: { type: sequelize_1.DataTypes.STRING(25), allowNull: false },
    correo: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    nombreContacto: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'beneficiarios',
    timestamps: true
});
Beneficiario.belongsTo(tipoOrgModel_1.TipoOrg, {
    foreignKey: 'idTipoOrg',
    as: 'tipoOrg'
});
Beneficiario.belongsTo(tipoPoblacionModel_1.TipoPoblacion, {
    foreignKey: 'idTipoPoblacion',
    as: 'tipoPoblacion'
});
Beneficiario.belongsTo(clasificacionModel_1.Clasificacion, {
    foreignKey: 'idClasificacion',
    as: 'clasificacion'
});
