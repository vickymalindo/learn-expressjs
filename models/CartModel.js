import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Carts = db.define(
  'carts',
  {},
  {
    freezeTableName: true,
  }
);

export default Carts;
