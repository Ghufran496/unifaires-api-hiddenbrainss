module.exports = function (app) {
  // all routes controllers

  let indexRouter = require("../routes/index");
  let frontendRouter = require("../routes/route.front");
  let authRouter = require("../routes/route.auth");
  let usersRouter = require("../routes/route.user");
  let adminRouter = require("../routes/route.admin");

  // imported routes
  const roles = require("../routes/roles");
  const accessroles = require("../routes/access.role.routes");
  const accessrolepermissions = require("../routes/access.role.permission.routes");

  const permissions = require("../routes/permissions");
  const accesspermissions = require("../routes/access.permission.routes");
  const users = require("../routes/users");
  const business = require("../routes/business");
  const address = require("../routes/address");
  const industry = require("../routes/industry.routes");
  const category = require("../routes/category");
  const jobcategory = require("../routes/job.category.routes");
  const fundingcategory = require("../routes/funding.category.routes");

  const auth = require("../routes/auth");
  const media = require("../routes/media");
  const message = require("../routes/message");
  const voucher = require("../routes/voucher");
  const jobs = require("../routes/jobs");
  const jobPaymentType = require("../routes/jobs.payment.type");

  const event = require("../routes/event");
  const languages = require("../routes/languages");
  const help = require("../routes/help");
  const helpTrack = require("../routes/help.track");

  // Course Routes
  const course = require("../routes/course/course");
  const coursecertificate = require("../routes/course.certificate.routes");
  const questionAnswer = require("../routes/course/question_answer");
  const enrolcourse = require("../routes/course/enrol.courses");

  const instructor = require("../routes/course/instructor");
  const test = require("../routes/course/test");
  const pricing = require("../routes/course/pricing");
  const section = require("../routes/course/section");
  const lecture = require("../routes/course/lecture");
  const lecture_content = require("../routes/course/lecture.content");
  const lecture_resource = require("../routes/course/lecture.resourse");

  const assignment = require("../routes/course/assignment");
  const section_resources = require("../routes/course/section.resources");
  const quiz = require("../routes/course/quiz");
  const quiz_question = require("../routes/course/quiz.question");
  const lecture_quiz = require("../routes/course/lecture.quiz");

  // verify
  const verify = require("../routes/verify");
  const payment = require("../routes/payment");
  const invite = require("../routes/invite");
  const invitePricing = require("../routes/invite.pricings.route");

  const team = require("../routes/team");
  const teammember = require("../routes/team.member");
  const jobwish = require("../routes/job.wish");
  const fundingwish = require("../routes/funding.wishes.routes");
  const coursewish = require("../routes/course.wish");

  const jobenrol = require("../routes/job.enrol");
  const jobarchieve = require("../routes/job.archieve");
  const coursearchieve = require("../routes/course.archieve");

  const skills = require("../routes/skills");
  const transactions = require("../routes/transaction");
  const associateTransaction = require("../routes/associate.transactions");
  const associatePricing = require("../routes/associate.pricing");
  const associateUser = require("../routes/associate.user");

  const subscriptionPlan = require("../routes/subscription.plan");
  const subscription = require("../routes/subscription");

  const tax = require("../routes/tax");
  const courseprogress = require("../routes/course.progress.route");

  const coursepaymenttype = require("../routes/course.payment.type.routes");
  const coursecountrypricing = require("../routes/course.country.pricing.routes");
  const coursebusinesspricing = require("../routes/course.business.pricing.routes");

  const cart = require("../routes/cart.routes");
  const socials = require("../routes/social.routes");
  const adminsocials = require("../routes/admin.social.routes");
  const contact = require("../routes/contact.routes");
  const workexperience = require("../routes/work.experience.routes");
  const education = require("../routes/education.routes");
  const userlanguage = require("../routes/user.language.routes");
  const userlicense = require("../routes/user.licence.routes");
  const profession = require("../routes/professional.certificate.routes");
  const drivinglicense = require("../routes/driving.license.route");

  const countries = require("../routes/countries");

  const jobbusinesspricing = require("../routes/job.business.pricing.routes");
  const jobcountrypricing = require("../routes/job.country.pricing.routes");

  const fundingbusinesspricing = require("../routes/funding.business.pricing.routes");
  const fundingcountrypricing = require("../routes/funding.country.pricing.routes");
  const fundingpaymenttypes = require("../routes/funding.payment.type.routes");

  const associatebusinesspricing = require("../routes/associate.business.pricing.routes");
  const associatecountrypricing = require("../routes/associate.country.pricing.routes");
  const subscriptioncountrypricing = require("../routes/subscription.country.pricing.routes");
  const associatepaymenttypes = require("../routes/associate.payment.type.routes");

  const invitebusinesspricing = require("../routes/invite.business.pricing.routes");
  const invitecountrypricing = require("../routes/invite.country.pricing.routes");
  const invitepaymenttypes = require("../routes/invite.payment.type.routes");

  const funding = require("../routes/funding.routes");
  const fundingenrol = require("../routes/funding.enrol.routes");

  const usersskills = require("../routes/users.skills.routes");
  const usersindustries = require("../routes/users.industries.routes");

  // flutterwave route
  const flutterwave = require("../routes/flutterwave.routes");

  const manageaccountroutes = require("./manage.routes");
  const chatsroutes = require("./chats.routes");
  const coursesreviews = require("../routes/courses.reviews.routes");
  const couponsroutes = require("../routes/coupon.routes");
  const mentorshiproutes = require("../routes/mentorship.routes");
  const helpchat = require("../routes/help.chat.routes");
  const general = require("../routes/general.routes");
  const stats = require("../routes/stats.routes");
  const lecturearticle = require("../routes/lecture.article.routes");
  const courseannouncement = require("../routes/course.announcement.routes");
  const virtualaccount = require("../routes/virtual.account.routes");
  const newslettertype = require("../routes/newsletter.type.routes");
  const newslettersubscriber = require("../routes/newsletter.subscriber.routes");
  const generalcoursepayout = require("../routes/general.course.payout.routes");
  const businesscoursepayout = require("../routes/business.course.payout.routes");
  const refunds = require("../routes/refund.routes");
  const earnings = require("../routes/earnings.routes");

  const stripePaymentRoutes = require("../routes/stripe.payment.routes");
  /**
   * list of routes
   */

  app.use("/api/v1/", indexRouter);
  app.use("/api/v1/front", frontendRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", usersRouter);
  app.use("/api/v1/admin", adminRouter);

  //CoursePayment Route
  app.use("/api/v1/payment", stripePaymentRoutes);

  //countries states and cities
  ///api/v1/csc -- gets countries
  //csc/cities/:stateCode -- gets cities by state code or state name
  // csc/states/:countryCode --- gets the
  app.use("/api/v1/csc", countries);

  app.use("/api/v1/roles", roles);
  app.use("/api/v1/access-roles", accessroles);
  app.use("/api/v1/access-roles-permissions", accessrolepermissions);

  app.use("/api/v1/permissions", permissions);
  app.use("/api/v1/access-permissions", accesspermissions);

  app.use("/api/v1/users", users);
  app.use("/api/v1/business", business);
  app.use("/api/v1/address", address);
  app.use("/api/v1/industry", industry);
  app.use("/api/v1/category", category);
  app.use("/api/v1/job-category", jobcategory);
  app.use("/api/v1/funding-category", fundingcategory);
  app.use("/api/v1/auth", auth);

  app.use("/api/v1/media", media);
  app.use("/api/v1/message", message);
  app.use("/api/v1/voucher", voucher);
  app.use("/api/v1/jobs", jobs);
  app.use("/api/v1/jobs-payment-type", jobPaymentType);

  app.use("/api/v1/event", event);
  app.use("/api/v1/languages", languages);
  app.use("/api/v1/help", help);
  app.use("/api/v1/help-track", helpTrack);

  // Course Routes
  app.use(
    "/api/v1/course",

    course
  );
  app.use("/api/v1/course-payment-type", coursepaymenttype);
  app.use("/api/v1/course-country-pricing", coursecountrypricing);
  app.use("/api/v1/course-business-pricing", coursebusinesspricing);
  app.use("/api/v1/course-certificate", coursecertificate);

  //course question and answer
  app.use("/api/v1/course-qa", questionAnswer);
  app.use("/api/v1/enrol-course", enrolcourse);

  app.use("/api/v1/instructor", instructor);
  app.use("/api/v1/test", test);
  app.use("/api/v1/pricing", pricing);
  app.use("/api/v1/section", section);
  app.use("/api/v1/lecture", lecture);
  app.use("/api/v1/lecture-content", lecture_content);
  app.use("/api/v1/lecture-resources", lecture_resource);

  app.use("/api/v1/assignment", assignment);
  app.use("/api/v1/section-resource", section_resources);
  app.use("/api/v1/quiz", quiz);
  app.use("/api/v1/question", quiz_question);
  app.use("/api/v1/lecture-quiz", lecture_quiz);

  // verification
  app.use("/api/v1/verify", verify);
  app.use("/api/v1/payment", payment);
  app.use("/api/v1/invite", invite);
  app.use("/api/v1/invite-pricings", invitePricing);
  app.use("/api/v1/team", team);
  app.use("/api/v1/team-member", teammember);

  // user

  app.use("/api/v1/job-wish", jobwish);
  app.use("/api/v1/course-wish", coursewish);

  // enrol job
  app.use("/api/v1/enrol-job", jobenrol);
  app.use("/api/v1/archieve-job", jobarchieve);
  app.use("/api/v1/archieve-course", coursearchieve);

  app.use("/api/v1/skills", skills);

  app.use("/api/v1/transactions", transactions);
  app.use("/api/v1/associate-pricing", associatePricing);
  app.use("/api/v1/associate-transactions", associateTransaction);
  app.use("/api/v1/associate-user", associateUser);
  app.use("/api/v1/subscription-plan", subscriptionPlan);
  app.use("/api/v1/subscription", subscription);

  app.use("/api/v1/tax", tax);
  app.use("/api/v1/course-progress", courseprogress);
  app.use("/api/v1/cart", cart);

  app.use("/api/v1/socials", socials);
  app.use("/api/v1/admin-socials", adminsocials);
  app.use("/api/v1/contact", contact);
  app.use("/api/v1/work-experience", workexperience);
  app.use("/api/v1/education", education);
  app.use("/api/v1/user-language", userlanguage);
  app.use("/api/v1/user-licence", userlicense);
  app.use("/api/v1/professional-certificate", profession);
  app.use("/api/v1/driving-license", drivinglicense);

  // flutterwave endpoints
  app.use("/api/v1/ng-payment", flutterwave);

  // job pricings
  app.use("/api/v1/job-country-pricing", jobcountrypricing);
  app.use("/api/v1/job-business-pricing", jobbusinesspricing);

  app.use("/api/v1/users-skills", usersskills);
  app.use("/api/v1/users-industries", usersindustries);

  app.use("/api/v1/associate-payment-type", associatepaymenttypes);
  app.use("/api/v1/associate-business-pricing", associatebusinesspricing);
  app.use("/api/v1/associate-country-pricing", associatecountrypricing);

  /* subscription country pricing */
  app.use("/api/v1/subscription-country-pricing", subscriptioncountrypricing);

  app.use("/api/v1/invite-payment-type", invitepaymenttypes);
  app.use("/api/v1/invite-business-pricing", invitebusinesspricing);
  app.use("/api/v1/invite-country-pricing", invitecountrypricing);

  app.use("/api/v1/funding", funding);
  app.use("/api/v1/funding-wish", fundingwish);
  app.use("/api/v1/enrol-funding", fundingenrol);
  app.use("/api/v1/funding-country-pricing", fundingcountrypricing);
  app.use("/api/v1/funding-business-pricing", fundingbusinesspricing);
  app.use("/api/v1/funding-payment-type", fundingpaymenttypes);
  app.use("/api/v1/courses-reviews", coursesreviews);
  app.use("/api/v1/coupons", couponsroutes);
  app.use("/api/v1/mentorships", mentorshiproutes);

  app.use("/api/v1/help-chat", helpchat);
  app.use("/api/v1/general", general);
  app.use("/api/v1/stats", stats);
  app.use("/api/v1/lecture-article", lecturearticle);
  app.use("/api/v1/course-announcement", courseannouncement);
  app.use("/api/v1/virtual-account", virtualaccount);
  app.use("/api/v1/newsletter-type", newslettertype);
  app.use("/api/v1/newsletter-subscriber", newslettersubscriber);
  app.use("/api/v1/general-course-payout", generalcoursepayout);
  app.use("/api/v1/business-course-payout", businesscoursepayout);
  app.use("/api/v1/refund", refunds);
  app.use("/api/v1/earnings", earnings);

  /* help chat */

  /*
    manage routes
  */
  app.use("/api/v1", manageaccountroutes);
  app.use("/api/v1", chatsroutes);
};
