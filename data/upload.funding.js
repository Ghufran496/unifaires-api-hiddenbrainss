const fundingData = require("./funding.json");
const fundingCategoryServices = require("../services/funding.category.services");

async function uploadFundingCategory(fundingData) {
  for (const funding of fundingData) {
    const subcategoryName = funding.Subcategory;
    const topicSpecializationName =
      funding["Topic, Specialization, Job Title & Skills"];

    try {
      // Find or create the subcategory
      let subcategory = await fundingCategoryServices.findBy({
        name: subcategoryName,
      });
      if (!subcategory) {
        subcategory = await fundingCategoryServices.store({
          body: { name: subcategoryName },
        });
        if (subcategory) {
          console.log(`Subcategory '${subcategoryName}' created successfully.`);
        } else {
          console.error(`Failed to create subcategory '${subcategoryName}'.`);
          continue;
        }
      }

      // Find or create the topic/specialization under the subcategory
      let topicSpecialization = await fundingCategoryServices.findBy({
        name: topicSpecializationName,
        parentId: subcategory.id,
      });
      if (!topicSpecialization) {
        topicSpecialization = await fundingCategoryServices.store({
          body: { name: topicSpecializationName, parentId: subcategory.id },
        });
        if (topicSpecialization) {
          console.log(
            `Topic/Specialization '${topicSpecializationName}' created successfully under '${subcategoryName}'.`
          );
        } else {
          console.error(
            `Failed to create Topic/Specialization '${topicSpecializationName}' under '${subcategoryName}'.`
          );
          continue;
        }
      } else {
        console.log(
          `Topic/Specialization '${topicSpecializationName}' already exists under '${subcategoryName}' with ID: ${topicSpecialization.id}.`
        );
      }
    } catch (error) {
      console.error(
        `Error processing Topic/Specialization '${topicSpecializationName}':`,
        error
      );
    }
  }
}

uploadFundingCategory(fundingData).catch(console.error);
