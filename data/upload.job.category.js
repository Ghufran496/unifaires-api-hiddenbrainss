const jobs = require("./jobs.json");
const jobCategoryServices = require("../services/job.category.services");

async function uploadJobsCategory(jobs) {
  for (const job of jobs) {
    const categoryName = job.Category;
    const subcategoryName = job.Subcategory;

    try {
      // Find or create the category
      let category = await jobCategoryServices.findBy({ name: categoryName });
      if (!category) {
        category = await jobCategoryServices.store({
          body: { name: categoryName },
        });
        if (category) {
          console.log(`Category '${categoryName}' created successfully.`);
        } else {
          console.error(`Failed to create category '${categoryName}'.`);
          continue;
        }
      }

      // Find or create the subcategory under the category
      let subcategory = await jobCategoryServices.findBy({
        name: subcategoryName,
        parentId: category.id,
      });
      if (!subcategory) {
        subcategory = await jobCategoryServices.store({
          body: { name: subcategoryName, parentId: category.id },
        });
        if (subcategory) {
          console.log(
            `Subcategory '${subcategoryName}' created successfully under '${categoryName}'.`
          );
        } else {
          console.error(
            `Failed to create subcategory '${subcategoryName}' under '${categoryName}'.`
          );
          continue;
        }
      } else {
        console.log(
          `Subcategory '${subcategoryName}' already exists under '${categoryName}' with ID: ${subcategory.id}.`
        );
      }
    } catch (error) {
      console.error(
        `Error processing subcategory '${subcategoryName}':`,
        error
      );
    }
  }
}

uploadJobsCategory(jobs).catch(console.error);
