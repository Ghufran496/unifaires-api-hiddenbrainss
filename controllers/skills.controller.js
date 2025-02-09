const { useAsync } = require('../core');
const { JParser } = require('../core/core.utils');
const skillsServices = require('../services/skills.services');
const skills = require('../data/skills.json');

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await skillsServices.all();

    return res.status(200).json(JParser('ok-response', true, all));
  } catch (error) {
    next(error);
  }
});

exports.courses_skills = useAsync(async (req, res, next) => {
  try {
    const all = await skillsServices.courseSkills(req);

    return res.status(200).json(JParser('ok-response', true, all));
  } catch (error) {
    next(error);
  }
});

exports.jobs_skills = useAsync(async (req, res, next) => {
  try {
    const all = await skillsServices.jobsSkills(req);

    return res.status(200).json(JParser('ok-response', true, all));
  } catch (error) {
    next(error);
  }
});

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await skillsServices.all();

    return res.status(200).json(JParser('ok-response', true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { name } = req.body;

    const find = await skillsServices.findBy({ name });

    if (!find) {
      const create = await skillsServices.store(req);

      // get the skills
      const find = await skillsServices.findOne(create.id);

      return res.status(201).json(JParser('ok-response', true, find));
    } else {
      return res.status(200).json(JParser(`${name} already exist`, true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.store_subcategory = useAsync(async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // check if skills exist
    const find = await skillsServices.findOne(parentId);

    if (find) {
      const create = await skillsServices.storeSub(parentId, req);

      return res.status(201).json(JParser('ok-response', true, create));
    } else {
      return res.status(404).json(JParser('skills not found', false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const find = await skillsServices.findOne(id);

    if (find) {
      return res.status(200).json(JParser('ok-response', true, find));
    } else {
      return res.status(404).json(JParser('invalid skills', false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check is skills exist
    const find = await skillsServices.findOne(id);

    if (!find)
      return res.status(404).json(JParser('invalid skills', false, null));

    const update = await skillsServices.update(id, req);

    if (update) {
      const skills = await skillsServices.findOne(id);

      return res.status(200).json(JParser('ok-response', true, skills));
    } else {
      return res.status(200).json(JParser('something went wrong', false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check is skills exist
    const find = await skillsServices.findOne(id);

    if (find) {
      const destroy = await skillsServices.destroy(id);

      if (destroy) {
        return res.status(204).json(JParser('ok-response', true, null));
      }
    } else {
      return res.status(404).json(JParser('skills not found', false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_subcategory = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const find = await skillsServices.findOne(id);

    if (find) {
      return res.status(200).json(JParser('ok-response', true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_descendants = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const find = await skillsServices.findDecendant(id);

    return res.status(200).json(JParser('ok-response', true, find));
  } catch (error) {
    next(error);
  }
});

exports.get_patents = useAsync(async (req, res, next) => {
  try {
    const find = await skillsServices.allParent();

    return res.status(200).json(JParser('ok-response', true, find));
  } catch (error) {
    next(error);
  }
});

exports.bulk_store = useAsync(async (req, res, next) => {
  try {
    let { start, end } = req.query;

    const createCategory = async (categoryName) => {
      req.body.name = categoryName;

      return await skillsServices.store(req);
    };

    const createSubcategory = async (parentId, subcategoryName) => {
      req.body.name = subcategoryName;
      return await skillsServices.storeSub(parentId, req);
    };

    const createTopic = async (parentId, topicName) => {
      req.body.name = topicName;
      return await skillsServices.storeSub(parentId, req);
    };

    for (let i = +start; i < +end; i++) {
      let skills = json_category[i].Category;
      let subcategory = json_category[i].Subcategory;
      let topic = json_category[i]['Topic, Specialization, Job Title & Skills'];

      let find = await skillsServices.findBy({ name: skills });

      if (!find) {
        find = await createCategory(skills);
      }

      let isSubcategory = await skillsServices.findBy({
        name: subcategory,
      });

      if (!isSubcategory) {
        isSubcategory = await createSubcategory(find.id, subcategory);
      }

      const parentId = isSubcategory.id;

      // check if it exist also

      let isTopic = await skillsServices.findBy({ name: topic });

      if (!isTopic) {
        await createTopic(parentId, topic);
      }
    }

    return res.status(200).json(JParser('categories', true, []));
  } catch (error) {
    next(error);
  }
});

exports.seed_store = useAsync(async (req, res, next) => {
  console.log('Seeding skills...', skills.length);

  try {

    function processData(data) {
      // Create an array to store the processed data
      const result = [];
      // Create a set to track unique 'Topic, Specialization, Job Title & Skills'
      const seen = new Set();
    
      // Iterate through the data array
      data.forEach(item => {
        const key = item["Topic, Specialization, Job Title & Skills"];
        const subcategory = item["Subcategory"];
    
        // Check if the key has already been seen
        if (data.find(i => i["Topic, Specialization, Job Title & Skills"] === key)) {
          // If duplicate, modify the key by appending the subcategory
          const updatedKey = `${key} - ${subcategory}`;
          // Push the modified item to the result array
          result.push({ ...item, "Topic, Specialization, Job Title & Skills": updatedKey });
        } else {
          // If unique, push the item as is
          result.push(item);
          // Mark the key as seen
          seen.add(key);
        }
      });
    
      return result;
    }

    const skillsData = processData(skills);

    for (const skill of skillsData) {
      const subcategoryName = skill.Subcategory;
      const skillName = skill['Topic, Specialization, Job Title & Skills'];

      // Find or create the subcategory
      let subcategory = await skillsServices.findBy({ name: subcategoryName });
      if (!subcategory) {
        subcategory = await skillsServices.store({
          body: { name: subcategoryName },
        });
        if (subcategory) {
          console.log(`Subcategory '${subcategoryName}' created successfully.`);
        } else {
          console.error(`Failed to create subcategory '${subcategoryName}'.`);
          continue;
        }
      }

      // Check if the skill already exists under this subcategory
      let subSkill = await skillsServices.findBy({
        name: skillName,
        parentId: subcategory.id,
      });
      if (!subSkill) {
        subSkill = await skillsServices.store({
          body: { name: skillName, parentId: subcategory.id },
        });
        if (subSkill) {
          console.log(
            `Skill '${skillName}' created successfully under '${subcategoryName}'.`
          );
        } else {
          console.error(
            `Failed to create skill '${skillName}' under '${subcategoryName}'.`
          );
          continue;
        }
      } else {
        console.log(
          `Skill '${skillName}' already exists under '${subcategoryName}' with ID: ${subSkill.id}.`
        );
        continue;
      }
    }
    return res
      .status(200)
      .json(JParser('skills seeded successfully', true, []));
  } catch (error) {
    console.error(`Error processing skill:`, error);
    next(error);
  }
});

exports.bulk_sub_store = useAsync(async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // check if skills exist
    const find = await skillsServices.findOne(parentId);

    if (find) {
      const createSubcategory = await skillsServices.storeSub(parentId, req);

      return res
        .status(201)
        .json(JParser('ok-response', true, createSubcategory));
    } else {
      return res.status(400).json(JParser('skills not found', false, null));
    }
  } catch (error) {
    next(error);
  }
});
