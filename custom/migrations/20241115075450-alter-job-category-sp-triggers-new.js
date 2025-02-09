'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the existing stored procedure if it exists
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS \`recalculate_totalJobCount\`;`);

    // Create the stored procedure `recalculate_totalJobCount`
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE \`recalculate_totalJobCount\`(IN category_id CHAR(36))
      BEGIN
          DECLARE current_id CHAR(36);
          DECLARE parent_id CHAR(36);
          DECLARE direct_jobCount INT DEFAULT 0;
          DECLARE children_totalJobCount INT DEFAULT 0;

          -- Initialize the current category ID
          SET current_id = category_id;

          -- Loop to calculate totalJobCount for each category from bottom to top
          WHILE current_id IS NOT NULL DO
              -- Get the actual jobCount for the current category (no accumulation from children)
              SET direct_jobCount = (SELECT jobCount FROM jobcategories WHERE id = current_id);

              -- Calculate the total job count of all direct children
              SET children_totalJobCount = (SELECT COALESCE(SUM(totalJobCount), 0) FROM jobcategories WHERE parentId = current_id);

              -- Update totalJobCount for the current category
              UPDATE jobcategories
              SET totalJobCount = direct_jobCount + children_totalJobCount
              WHERE id = current_id;

              -- Move up to the parent category
              SET parent_id = (SELECT parentId FROM jobcategories WHERE id = current_id);
              SET current_id = parent_id;
          END WHILE;
      END;
    `);

    // Drop and recreate triggers
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS \`update_jobcount_on_delete\`;`);
    await queryInterface.sequelize.query(`
      CREATE TRIGGER \`update_jobcount_on_delete\` AFTER DELETE ON \`jobs\`
      FOR EACH ROW BEGIN
          IF (SELECT COUNT(*) FROM jobcategories WHERE id = OLD.jobcategoryId) > 0 THEN
              UPDATE jobcategories
              SET jobCount = GREATEST(jobCount - 1, 0)
              WHERE id = OLD.jobcategoryId;

              CALL recalculate_totalJobCount(OLD.jobcategoryId);
          END IF;
      END;
    `);

    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS \`update_jobcount_on_insert\`;`);
    await queryInterface.sequelize.query(`
      CREATE TRIGGER \`update_jobcount_on_insert\` AFTER INSERT ON \`jobs\`
      FOR EACH ROW BEGIN
          IF (SELECT COUNT(*) FROM jobcategories WHERE id = NEW.jobcategoryId) > 0 THEN
              UPDATE jobcategories
              SET jobCount = jobCount + 1
              WHERE id = NEW.jobcategoryId;

              CALL recalculate_totalJobCount(NEW.jobcategoryId);
          END IF;
      END;
    `);

    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS \`update_jobcount_on_update\`;`);
    await queryInterface.sequelize.query(`
      CREATE TRIGGER \`update_jobcount_on_update\` AFTER UPDATE ON \`jobs\`
      FOR EACH ROW BEGIN
          IF OLD.jobcategoryId != NEW.jobcategoryId THEN
              IF (SELECT COUNT(*) FROM jobcategories WHERE id = OLD.jobcategoryId) > 0 THEN
                  UPDATE jobcategories
                  SET jobCount = GREATEST(jobCount - 1, 0)
                  WHERE id = OLD.jobcategoryId;

                  CALL recalculate_totalJobCount(OLD.jobcategoryId);
              END IF;

              IF (SELECT COUNT(*) FROM jobcategories WHERE id = NEW.jobcategoryId) > 0 THEN
                  UPDATE jobcategories
                  SET jobCount = jobCount + 1
                  WHERE id = NEW.jobcategoryId;

                  CALL recalculate_totalJobCount(NEW.jobcategoryId);
              END IF;
          END IF;
      END;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop triggers
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS \`update_jobcount_on_delete\`;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS \`update_jobcount_on_insert\`;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS \`update_jobcount_on_update\`;`);

    // Drop the stored procedure
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS \`recalculate_totalJobCount\`;`);
  }
};
