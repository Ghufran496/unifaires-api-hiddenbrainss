// Models

class Message {
  async getAllMessage() {}
  async getMessageById(id) {}
  async storeMessage(req) {}
  async updateMessage(id, req) {}

  async deleteMessage(id) {}
}

module.exports = new Message();
