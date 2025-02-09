const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

const teamMembersServices = require("../services/team.members.services");
exports.index = useAsync(async (req, res, next) => {
  try {
    const teamMembers = await teamMembersServices.all();

    if (teamMembers) {
      return res
        .status(200)
        .json(JParser("team fetch successfully", true, teamMembers));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const created = await teamMembersServices.store(req);

    if (created) {
      return res
        .status(201)
        .json(JParser("team member created successfully", true, created));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const teamMember = await teamMembersServices.findOne(id);

    return res
      .status(200)
      .json(JParser("team memeber fetch successfully", true, teamMember));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isTeamMember = await teamMembersServices.findOne(id);

    if (isTeamMember && isTeamMember.length > 0) {
      const update = await teamMembersServices.update(id, req);

      if (update) {
        const teamMember = await teamMembersServices.findOne(id);

        return res
          .status(200)
          .json(JParser("team member updates successfully", true, teamMember));
      }
    } else {
      return res
        .status(404)
        .json(JParser("team member does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const destroy = await teamMembersServices.destroy(id);

    if (destroy) {
      return res
        .status(204)
        .json(JParser("team member deleted successfully", true, null));
    }
  } catch (error) {
    next(error);
  }
});
