const courses = require('./courses.json');
const categoryServices = require('../services/category.services');

function createHierarchicalJson(data) {
  const result = [];

  return result;
}

exports.uploadCourseCategory = async function () {
  try {
    const hierarchicalJson = [];

    // Helper function to find or create the node
    function findOrCreateNode(array, key, value) {
      let node = array.find((item) => item.Category === value);
      if (!node) {
        node = { Category: value, Subcategory: [] };
        array.push(node);
      }
      return node;
    }

    courses.forEach((item) => {
      // Step 1: Find or create "Main" level
      const mainNode = findOrCreateNode(
        hierarchicalJson,
        'Category',
        item.Main
      );

      // Step 2: Find or create "Major" level under "Main"
      const majorNode = findOrCreateNode(
        mainNode.Subcategory,
        'Category',
        item.Major
      );

      // Step 3: Find or create "Category" level under "Major"
      const categoryNode = findOrCreateNode(
        majorNode.Subcategory,
        'Category',
        item.Category
      );

      // Step 4: Add "Subcategory" under "Category" level
      categoryNode.Subcategory.push({
        Category: item.Subcategory,
        hierarchyLevel: 3,
      });
    });
    console.log('Hierarchical JSON:', hierarchicalJson);
    return hierarchicalJson;
  } catch (error) {
    console.error('Error processing courses category:', error);
    return [];
  }
  // for (const course of courses) {
  //   const categoryName = course.Category;
  //   const subcategoryName = course.Subcategory;

  //   try {
  //     // Find or create the category
  //     let category = await categoryServices.findBy({ name: categoryName });
  //     if (!category) {
  //       category = await categoryServices.store({
  //         body: { name: categoryName },
  //       });
  //       if (category) {
  //         console.log(`Category '${categoryName}' created successfully.`);
  //       } else {
  //         console.error(`Failed to create category '${categoryName}'.`);
  //         continue; // Skip to the next iteration if the category creation failed
  //       }
  //     }

  //     // Find or create the subcategory under the category
  //     let subcategory = await categoryServices.findBy({
  //       name: subcategoryName,
  //       parentId: category.id,
  //     });
  //     if (!subcategory) {
  //       subcategory = await categoryServices.store({
  //         body: { name: subcategoryName, parentId: category.id },
  //       });
  //       if (subcategory) {
  //         console.log(
  //           `Subcategory '${subcategoryName}' created successfully under '${categoryName}'.`
  //         );
  //       } else {
  //         console.error(
  //           `Failed to create subcategory '${subcategoryName}' under '${categoryName}'.`
  //         );
  //         continue;
  //       }
  //     } else {
  //       console.log(
  //         `Subcategory '${subcategoryName}' already exists under '${categoryName}' with ID: ${subcategory.id}.`
  //       );
  //     }
  //   } catch (error) {
  //     console.error(
  //       `Error processing subcategory '${subcategoryName}':`,
  //       error
  //     );
  //   }
  // }
};

// uploadCourseCategory(courses).catch(console.error);
