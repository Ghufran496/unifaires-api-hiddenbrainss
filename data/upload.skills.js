const skills = require("./skills.json");
const skillsServices = require("../services/skills.services");

async function uploadSkills(skills) {
  for (const skill of skills) {
    const subcategoryName = skill.Subcategory;
    const skillName = skill["Topic, Specialization, Job Title & Skills"];

    try {
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
      }
    } catch (error) {
      console.error(`Error processing skill '${skillName}':`, error);
    }
  }
}

uploadSkills(skills).catch(console.error);
