import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';
import Books from './BookModel.js';

const { DataTypes } = Sequelize;

const Carts = db.define(
  'carts',
  {},
  {
    freezeTableName: true,
  }
);

export default Carts;
