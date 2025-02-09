const { Quiz } = require("../../models");

class QuizServices {
  async getAllQuiz() {
    return await Quiz.findAll();
  }
  async getAllQuizById(id) {
    return await Quiz.findOne({ where: { id } });
  }
  async storeQuiz(req) {
    return await Quiz.create(req.body);
  }
  async updateQuiz(id, req) {
    return await Quiz.update(req.body, { where: { id } });
  }
  async deleteQuiz(id) {
    return await Quiz.destroy({ where: { id } });
  }
}

module.exports = new QuizServices();
