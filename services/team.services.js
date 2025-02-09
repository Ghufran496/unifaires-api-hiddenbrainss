const { Team, TeamMembers, User } = require("../models");

class TeamServices {
  async getAllTeam() {
    return await Team.findAll({
      include: {
        model: TeamMembers,

        include: {
          model: User,
          as: "user",
        },
      },
    });
  }
  async getAllTeamById(id) {
    return await Team.findOne({
      where: { id },
      include: {
        model: TeamMembers,

        include: {
          model: User,
        },
      },
    });
  }
  async storeTeam(req) {
    return await Team.create(req.body);
  }
  async updateTeam(id, req) {
    return await Team.update(req.body, { where: { id } });
  }
  async deleteTeam(id) {
    return await Team.destroy({ where: { id } });
  }
}

module.exports = new TeamServices();
