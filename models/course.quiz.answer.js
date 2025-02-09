import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize'; // Your Sequelize instance

const User = require("./user");

class Question extends Model {}

Question.init(
  {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category:{
        type: DataTypes.STRING,
       allowNull:true 
    }
  },
  {
    sequelize,
    modelName: 'Question',
  }
);

class Answer extends Model {}

Answer.init(
  {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Answer',
  }
);

// Associations
User.hasMany(Question);
Question.belongsTo(User);

User.hasMany(Answer);
Answer.belongsTo(User);

Question.hasMany(Answer);
Answer.belongsTo(Question);

// You can add additional methods or hooks as needed

export { User, Question, Answer };