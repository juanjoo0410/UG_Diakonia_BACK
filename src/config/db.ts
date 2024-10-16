import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'mysql',
    timezone: process.env.DB_TIMEZONE,
    port: parseInt(process.env.DB_PORT!, 10),
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export const connectDB = async () => {
    try {
      await sequelize.authenticate();
      //await sequelize.sync({ alter: true });
      console.log('Conexión a la base de datos establecida con éxit');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  };

export default sequelize;