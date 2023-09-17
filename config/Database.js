import { Sequelize } from 'sequelize';

const db = new Sequelize('perpustakaan', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
