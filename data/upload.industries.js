const industries = require("./industries.json");
const industryServices = require("../services/industry.services");

async function uploadIndustries(industries) {
  for (const industryData of industries) {
    const industryName = industryData.Industry;
    const subIndustryName = industryData["Industry Sectors"];

    try {
      // Find or create the industry
      let findIndustry = await industryServices.findBy({ name: industryName });
      if (!findIndustry) {
        findIndustry = await industryServices.store({
          body: { name: industryName },
        });
        if (findIndustry) {
          console.log(`Industry '${industryName}' created successfully.`);
        } else {
          console.error(`Failed to create industry '${industryName}'.`);
          continue; // Skip to the next iteration if the industry creation failed
        }
      }

      // Check if the sub industry already exists under this industry
      const subIndustry = await industryServices.findBy({
        name: subIndustryName,
        parentId: findIndustry.id,
      });
      if (!subIndustry) {
        // Create the sub industry
        const createdSubIndustry = await industryServices.store({
          body: { name: subIndustryName, parentId: findIndustry.id },
        });
        if (createdSubIndustry) {
          console.log(
            `Sub industry '${subIndustryName}' created successfully under '${industryName}'.`
          );
        } else {
          console.error(
            `Failed to create sub industry '${subIndustryName}' under '${industryName}'.`
          );
        }
      } else {
        console.log(
          `Sub industry '${subIndustryName}' already exists under '${industryName}' with ID: ${subIndustry.id}.`
        );
      }
    } catch (error) {
      console.error(
        `Error processing sub industries for industry '${industryName}':`,
        error
      );
    }
  }
}

uploadIndustries(industries).catch(console.error);
