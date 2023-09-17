import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Books = db.define(
  'books',
  {
    title: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Books;
