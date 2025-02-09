const { QuizQuestion } = require("../../models");

class QuizQuestionServices {
  async getAllQuizQuestion() {
    return await QuizQuestion.findAll();
  }
  async getAllQuizQuestionById(id) {
    return await QuizQuestion.findOne({ where: { id } });
  }
  async storeQuizQuestion(req) {
    return await QuizQuestion.create(req.body);
  }
  async updateQuizQuestion(id, req) {
    return await QuizQuestion.update(req.body, { where: { id } });
  }
  async deleteQuizQuestion(id) {
    return await QuizQuestion.destroy({ where: { id } });
  }
}

module.exports = new QuizQuestionServices();
