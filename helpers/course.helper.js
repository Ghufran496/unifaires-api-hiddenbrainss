const { CoursesReviews, EnrolCourse } = require("../models");

// Function to enhance courses

async function getEnhanceCourses(count, courses) {
  const enhancedCourses = await Promise.all(
    courses.map(async (course) => {
      const courseJson = course.toJSON();

      const student = await EnrolCourse.count({
        where: { courseId: course?.id },
      });

      courseJson.students = student;

      // Fetch and add ratings and reviews
      const ratings = await Promise.all(
        [1, 2, 3, 4, 5].map((rating) =>
          CoursesReviews.count({ where: { courseId: course?.id, rating } })
        )
      );

      const [one, two, three, four, five] = ratings;
      const totalRating = one + two + three + four + five;

      const weightedSum = one * 1 + two * 2 + three * 3 + four * 4 + five * 5;

      courseJson.ratingsCount = { one, two, three, four, five };
      courseJson.averageRating =
        totalRating > 0 ? (weightedSum / totalRating).toFixed(2) : 0;

      return courseJson;
    })
  );

  return { count, rows: enhancedCourses };
}

async function getEnhanceCourse(course) {
  const courseJson = course.toJSON();

  // Fetch and add the student count
  const studentCount = await EnrolCourse.count({
    where: { courseId: course?.id },
  });
  courseJson.students = studentCount;

  // Fetch and add ratings and reviews
  const ratings = await Promise.all(
    [1, 2, 3, 4, 5].map((rating) =>
      CoursesReviews.count({ where: { courseId: course?.id, rating } })
    )
  );

  const [one, two, three, four, five] = ratings;
  const totalRating = one + two + three + four + five;
  const weightedSum = one * 1 + two * 2 + three * 3 + four * 4 + five * 5;

  courseJson.ratingsCount = { one, two, three, four, five };
  courseJson.averageRating =
    totalRating > 0 ? (weightedSum / totalRating).toFixed(2) : 0;

  return courseJson;
}

function transformAttributeFilterData(originalData) {
  const transformed = [];

  function splitCamelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  for (const key in originalData) {
    if (originalData.hasOwnProperty(key)) {
      transformed.push({
        title: splitCamelCase(key),
        values: originalData[key].map((item) => {
          // Assuming that if there are no values, we return an empty object
          return {
            [`${key}`]: item[key] || "",
            courseCount: item.courseCount || "0",
          };
        }),
      });
    }
  }

  return transformed;
}

module.exports = {
  getEnhanceCourses,
  getEnhanceCourse,
  transformAttributeFilterData,
};
