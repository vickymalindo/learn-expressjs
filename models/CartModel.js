import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const Carts = db.define(
  'carts',
  {},
  {
    freezeTableName: true,
  }
);

export default Carts;
