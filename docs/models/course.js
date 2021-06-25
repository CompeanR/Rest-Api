'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required'
        },
        notEmpty: {
          msg: 'Please provide a title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A description is required'
        },
        notEmpty: {
          msg: 'Please provide a description'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user', // alias.
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return Course;
};


// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Course extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   Course.init({
//     title: DataTypes.STRING,
//     description: DataTypes.TEXT,
//     estimatedTime: DataTypes.STRING,
//     materialsNeeded: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Course',
//   });

//   Course.associate = (models) => {
//     Course.belongsTo(models.User, {
//       as: 'user',
//       foreignKey: {
//         fieldName: 'userId',
//         allowNull: false
//       }
//     });
//   };

//   return Course;
// };