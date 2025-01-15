"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Egreso = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const tipoTransaccionModel_1 = require("./tipoTransaccionModel");
class Egreso extends sequelize_1.Model {
}
exports.Egreso = Egreso;
Egreso.init({
    idEgreso: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idTipoTransaccion: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'tipos_transaccion',
            key: 'idTipoTransaccion'
        }
    },
    descripcion: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
    idBeneficiario: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, },
    totalPeso: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    fecha: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW, },
}, {
    sequelize: db_1.default,
    tableName: 'egresos',
    timestamps: false
});
Egreso.belongsTo(tipoTransaccionModel_1.TipoTransaccion, {
    foreignKey: 'idTipoTransaccion',
    as: 'tipoTransaccion'
});
