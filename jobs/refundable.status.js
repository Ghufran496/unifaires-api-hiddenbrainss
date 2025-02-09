const cron = require("node-cron");
const {
  Earnings,
  Business,
  GeneralCoursePayout,
  BusinessCoursePayout,
  Transactions,
} = require("../models");

const sequelize = require("../database");

const dayjs = require("dayjs");
const { REFUNDABLE_DAYS } = require("../data");

const updateRefundableStatus = async () => {
  const transactions = await Transactions.findAll({
    where: {
      isRefundable: true,
      paidFor: "course",
    },
  });

  const now = dayjs();

  for (const transaction of transactions) {
    const t = await sequelize.transaction();

    try {
      const createdAt = dayjs(transaction.createdAt);
      const daysDifference = now.diff(createdAt, "day");

      if (daysDifference > REFUNDABLE_DAYS) {
        transaction.isRefundable = false;
        await transaction.save({ transaction: t });

        let EARNING_PERCENTAGE = 0;

        if (transaction.businessId) {
          // Check if special percentage is prescribed for this user
          const business = await Business.findOne({
            where: { id: transaction.businessId },
          });

          // Get the business details
          const isSpecial = await BusinessCoursePayout.findOne({
            where: { businessId: transaction.businessId },
            raw: true,
          });

          if (isSpecial) {
            EARNING_PERCENTAGE = isSpecial.businessPercentage;
          } else {
            // Get the country of the business
            const isCountry = await GeneralCoursePayout.findOne({
              where: { country: business.dataValues.country },
              raw: true,
            });

            if (isCountry) {
              EARNING_PERCENTAGE = isCountry.businessPercentage;
            }
          }
        } else if (transaction.userId) {
          // Check if special percentage is prescribed for this user
          EARNING_PERCENTAGE = 100;
        }

        // Calculate earnings based on percentage
        const earningsAmount = transaction.amount * (EARNING_PERCENTAGE / 100);

        // Create an earnings entry
        await Earnings.create(
          {
            ownerId: transaction.userId || transaction.businessId,
            ownerType: transaction.userId ? "userId" : "businessId",
            totalAmount: earningsAmount,
            transactionId: transaction.id,
          },
          { transaction: t }
        );

        // Commit the transaction
        await t.commit();
      }
    } catch (error) {
      // Rollback the transaction in case of error
      await t.rollback();
    }
  }
};

// This is scheduled to run every minute
cron.schedule("0 0 * * *", () => {
  updateRefundableStatus();
});

module.exports = { updateRefundableStatus };
