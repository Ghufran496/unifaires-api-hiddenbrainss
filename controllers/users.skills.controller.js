const { useAsync, utils } = require("./../core");
const { JParser } = require("../core/core.utils");
const usersSkillsServices = require("../services/users.skills.services");
const skillsServices = require("../services/skills.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await usersSkillsServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { skills } = req.body;
    const { id: userId } = req.user;

    req.body.userId = userId;

    const createdSkills = [];

    for (const skillId of skills) {
      const isSkill = await skillsServices.findOne(skillId);

      if (isSkill) {
        const create = await usersSkillsServices.store({
          body: { ...req.body, skillId },
        });
        createdSkills.push(create);
      }
    }

    return res.status(201).json(JParser("ok-response", true, createdSkills));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await usersSkillsServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("skills not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await usersSkillsServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("skills not found", false, null));
    }

    const update = await usersSkillsServices.update(id, req);

    if (update) {
      const find = await usersSkillsServices.findOne(id);
      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await usersSkillsServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("skills not found", false, null));
    }

    const destroy = await usersSkillsServices.destroy(id);

    if (destroy)
      return res.status(204).json(JParser("ok-response", true, null));
  } catch (error) {
    next(error);
  }
});
exports.user_skills = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const skills = await usersSkillsServices.findAllBy({ userId });

    return res.status(200).json(JParser("ok-response", true, skills));
  } catch (error) {
    next(error);
  }
});
