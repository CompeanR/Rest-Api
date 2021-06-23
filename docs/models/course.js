'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    estimatedTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    materialsNeeded: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'user id',
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