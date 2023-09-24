import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Carts = db.define(
  'carts',
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    book_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Carts;
