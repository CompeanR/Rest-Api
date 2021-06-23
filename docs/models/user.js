'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A name is required'
        },
        notEmpty: {
          msg: 'Please provide a name'
        }
      }
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A email address is required'
        },
        notEmpty: {
          msg: 'Please provide a email address'
        }
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        len: {
          args: [8, 20],
          msg: 'The password should be between 8 and 20 characters in length'
        }
      }
    },
    confirmedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if( val === this.password ) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('confirmedPassword', hashedPassword);
        }
      },
      validate: {
        notNull: {
          msg: 'Both passwords must match'
        }
      }
    }
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'course',
      foreignKey: {
        fieldName: 'Course Id',
        allowNull: false,
      },
    });
  };

  return User;
};

