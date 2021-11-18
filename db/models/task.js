'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    listId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    dueDate: {
      type: DataTypes.DATEONLY
    },
    estimatedTime: {
      type: DataTypes.INTEGER
    },
    importance: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    completed: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    deleted: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
  }, {});
  Task.associate = function (models) {
    Task.belongsTo(models.User, { foreignKey: 'userId' })
    Task.belongsTo(models.List, { foreignKey: 'listId' })
    Task.hasMany(models.Subtask, {
      foreignKey: 'taskId',
    })

  };
  return Task;
};
