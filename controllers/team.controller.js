const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const teamServices = require("../services/team.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const teams = await teamServices.getAllTeam();

    if (teams) {
      return res
        .status(200)
        .json(JParser("teams fetch successfully", true, teams));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    }

    const create = await teamServices.storeTeam(req);

    if (create) {
      return res
        .status(201)
        .json(JParser("team created successfull", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    // get the team id

    const { id } = req.params;

    const isTeam = await teamServices.getAllTeamById(id);

    if (isTeam) {
      return res
        .status(200)
        .json(JParser("team created successfully", true, isTeam));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isTeam = await teamServices.getAllTeamById(id);

    if (isTeam) {
      const update = await teamServices.updateTeam(id, req);

      if (update) {
        const team = await teamServices.getAllTeamById(id);

        return res
          .status(200)
          .json(JParser("team updated    successfully", true, team));
      } else {
        return res
          .status(500)
          .json(JParser("something went wrong", false, null));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const destroy = await teamServices.deleteTeam(id);

    if (destroy) {
      return res
        .status(204)
        .json(JParser("team deleted successfully", true, null));
    }
  } catch (error) {
    next(error);
  }
});
