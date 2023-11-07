import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

import Carts from './CartModel.js';
import Books from './BookModel.js';

const { DataTypes } = Sequelize;

const Users = db.define(
  'users',
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    verify_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.belongsToMany(Books, { through: Carts });
Books.belongsToMany(Users, { through: Carts });

export default Users;
