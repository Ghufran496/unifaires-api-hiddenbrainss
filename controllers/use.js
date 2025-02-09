exports.store = useAsync(async (req, res, next) => {
  try {
    const { courseIds } = req.body;

    const { id: userId, email, firstname, lastname } = req.user;
    const fullname = firstname + lastname;

    // Check if the courses exist and get pricing information
    const courses = await courseServices.coursePrices(courseIds);

    // Filter out courses with no pricing information
    const validCourses = courses.filter((course) => course.pricing !== null);

    const enrollments = await Promise.all(
      validCourses.map(async (course) => {
        const { id: courseId, pricing } = course;

        const isUserEnrolled = await enrolCourseServices.findBy({
          userId,
          courseId,
        });

        if (isUserEnrolled) {
          return {
            courseId,
            success: false,
            message: "User is already enrolled in this course",
            enrollment: isUserEnrolled,
          };
        }

        if (pricing.type === "free") {
          // Enroll user into the free course
          req.body.userId = userId;
          req.body.courseId = courseId;
          req.body.paymentPlatform = "free";
          req.body.paymentId = "free";

          return {
            courseId,
            success: true,
            message: "Course enrollment successful (Free)",
            enrollment: await enrolCourseServices.store(req),
          };
        } else {
          // Charge customer for the paid course
          const customer = await paymentServices.getOrCreateCustomer(
            email,
            fullname
          );
          const { amount: pricingAmount, currency, discount } = pricing;
          const amount = +pricingAmount - +discount;

          const chargeData = {
            amount,
            currency,
            customer: customer.id,
            description: "course payment",
            metadata: { userId },
          };

          const charge_customer = await paymentServices.chargeStripeCustomer(
            chargeData
          );

          if (!charge_customer.paid) {
            return {
              courseId,
              success: false,
              message: "Payment failed",
              enrollment: null,
            };
          }

          await Transactions.create({
            paymentId: charge_customer.id,
            paidFor: "course",
            paidForId: courseId,
            method: "stripe",
            amount,
            cost: pricingAmount,
            status: true,
            userId,
          });

          // Enroll user into the paid course
          req.body.userId = userId;
          req.body.courseId = courseId;
          req.body.paymentPlatform = "stripe";
          req.body.paymentId = charge_customer.id;

          // store the transactions

          return {
            courseId,
            success: true,
            message: "Payment and course enrollment successful",
            enrollment: await enrolCourseServices.store(req),
          };
        }
      })
    );

    return res
      .status(201)
      .json(JParser("course(s) enrolled successfully", true, enrollments));
  } catch (error) {
    next(error);
  }
});
