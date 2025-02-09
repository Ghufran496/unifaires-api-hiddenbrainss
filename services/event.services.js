// Models
const { Event } = require("../models");
class EventServices {
  async getAllEvent() {
    return await Event.findAll();
  }

  async getEventById(id) {
    return await Event.findOne({ where: { id } });
  }

  async storeEvent(req) {
    return await Event.create(req.body);
  }

  async updateEvent(id, req) {
    return await Event.update(req.body, { where: { id } });
  }

  async deleteEvent(id) {
    return await Event.destroy({ where: { id } });
  }
}

module.exports = new EventServices();
