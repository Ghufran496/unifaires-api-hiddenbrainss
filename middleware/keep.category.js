// async all(req) {
//   let filterValue = {};

//   const { query } = req;
//   for (let key in query) {
//     if (key !== "offset" && key !== "limit") {
//       if (!!Category.getAttributes()[key]) {
//         if (Array.isArray(query[key])) {
//           filterValue[key] = {
//             [Op.or]: query[key].map((value) => ({
//               [Op.like]: `%${value}%`,
//             })),
//           };
//         } else {
//           filterValue[key] = {
//             [Op.like]: `%${query[key]}%`,
//           };
//         }
//       }
//     }
//   }

//   const categories = await Category.findAll({
//     attributes: [
//       "id",
//       "parentId",
//       "name",
//       "createdAt",
//       "updatedAt",
//       "hierarchyLevel",
//       [
//         Sequelize.literal(
//           "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = category.id AND courses.status = 'active' AND pricings.id IS NOT NULL)"
//         ),
//         "courseCount",
//       ],
//     ],
//     where: {
//       // parentId: null,
//       [Sequelize.Op.and]: Sequelize.literal(
//         "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = category.id AND courses.status = 'active' AND pricings.id IS NOT NULL) > 0"
//       ),
//       ...filterValue,
//     },
//     include: [
//       {
//         model: Category,
//         as: "children",
//         attributes: [
//           "id",
//           "parentId",
//           "name",
//           "createdAt",
//           "updatedAt",
//           "hierarchyLevel",
//           [
//             Sequelize.literal(
//               "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = children.id AND courses.status = 'active' AND pricings.id IS NOT NULL)"
//             ),
//             "courseCount",
//           ],
//         ],
//         required: false,
//         where: Sequelize.literal(
//           "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = children.id AND courses.status = 'active' AND pricings.id IS NOT NULL) > 0"
//         ),
//         include: [
//           {
//             model: Category,
//             as: "children",
//             attributes: [
//               "id",
//               "parentId",
//               "name",
//               "createdAt",
//               "updatedAt",
//               "hierarchyLevel",
//               [
//                 Sequelize.literal(
//                   "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = children.id AND courses.status = 'active' AND pricings.id IS NOT NULL)"
//                 ),
//                 "courseCount",
//               ],
//             ],
//             required: false,
//             where: Sequelize.literal(
//               "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = children.id AND courses.status = 'active' AND pricings.id IS NOT NULL) > 0"
//             ),
//           },
//         ],
//       },
//       {
//         model: Category,
//         as: "ancestors",
//         attributes: [
//           "id",
//           "parentId",
//           "name",
//           "createdAt",
//           "updatedAt",
//           "hierarchyLevel",
//           [
//             Sequelize.literal(
//               "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = ancestors.id AND courses.status = 'active' AND pricings.id IS NOT NULL)"
//             ),
//             "courseCount",
//           ],
//         ],
//         required: false,
//         where: Sequelize.literal(
//           "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = ancestors.id AND courses.status = 'active' AND pricings.id IS NOT NULL) > 0"
//         ),
//       },
//     ],
//     order: [["name", "ASC"]],
//   });

//   return categories;
// }
