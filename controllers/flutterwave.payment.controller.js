// flutterwave controller
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

const flutterwaveServices = require("../payment/flutterwave.services");
const virtualAccountServices = require("../services/virtual.account.services");
const courseServices = require("../services/course/course.services");
const { flw: flutterwave } = require("../config/flutterwave");
const usersServices = require("../services/users.services");
const courseEnrolServices = require("../services/course/enrol.courses.services");
const transactionServices = require("../services/transactions.services");
const jobServices = require("../services/jobs.services");
const jobPaymentTypeServices = require("../services/jobs.payment.type.services");
const jobCountryPricingServices = require("../services/job.country.pricings.services");
const jobBusinessPricingServices = require("../services/job.business.pricing.services");
const businessServices = require("../services/business.services");
const fundingServices = require("../services/funding.services");
const fundingPaymentTypeServices = require("../services/funding.payment.type.services");
const fundingBusinessPlanServices = require("../services/funding.business.pricing.services");
const fundingCountryPlanServices = require("../services/funding.country.pricing.services");

const invitePaymentTypeServices = require("../services/invite.payment.type.services");
const inviteCountryPricingServices = require("../services/invite.country.pricing.services");
const inviteBusinessPricingServices = require("../services/invite.business.pricing.services");
const crypto = require("crypto");

const inviteService = require("../services/invite.services");
const userServices = require("../services/users.services");
const taxServices = require("../services/tax.services");

/* free course payment */

const courseCountryPricingServices = require("../services/course.country.pricing.services");
const courseBussinessPricingServices = require("../services/course.business.pricing.services");
const coursePaymentTypeServices = require("../services/course.payment.type.services");
const pricingServices = require("../services/course/pricing.services");

const {
  setOwnerInfo,
  constructNewEntity,
  generateUsername,
  handleExistingEntity,
  handleNewEntity,
  validatePermissions,
  validateRoles,
} = require("../helpers/invite.helper");
const sendgridServices = require("../services/sendgrid.services");

exports.create_user_virtual_account = useAsync(async (req, res, next) => {
  try {
    // Determine the user or business details
    let userId, businessId, email;
    if (req.user) {
      ({ id: userId, email } = req.user);
    } else if (req.business) {
      ({ id: businessId, email } = req.business);
    }

    // Check if this user or business already has an account
    const accountId = userId || businessId;

    const find = await virtualAccountServices.findBy({
      userId: userId || businessId,
    });

    if (find) {
      return res.status(200).json(JParser("already exist", true, find));
    }

    const data = {
      email,
      tx_ref: accountId,
      is_permanent: true,
      bvn: req.body.bvn,
    };

    const create = await flutterwaveServices.createVirtualAccount(data);

    if (create) {
      const {
        account_number: accountNumber,
        bank_name: bankName,
        account_status: status,
        order_ref: orderRef,
      } = create.data;

      const storeAccount = await virtualAccountServices.store({
        body: {
          accountNumber,
          bankName,
          status,
          userId: req.user ? userId : null,
          businessId: req.business ? businessId : null,
          platform: "flutterwave",
          meta: JSON.stringify({ orderRef }),
        },
      });

      if (storeAccount) {
        return res
          .status(201)
          .json(JParser("ok-response!", true, { storeAccount, create }));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.create_business_virtual_account = useAsync(async (req, res, next) => {
  try {
    // check if email already have an account

    const { id: businessId, email } = req.business;

    // check if this user have an account,
    const find = await virtualAccountServices.findBy({ userId });

    if (!find) {
      const data = {
        email,
        tx_ref: businessId,
        is_permanent: true,
        bvn: req.body.bvn,
      };

      const create = await flutterwaveServices.createVirtualAccount(data);

      if (create) {
        // store the account number and the bank name bank account record
        const {
          account_number: accountNumber,
          bank_name: bankName,
          account_status: status,
          order_ref: orderRef,
        } = create.data;

        const storeAccount = await virtualAccountServices.store({
          body: {
            accountNumber,
            bankName,
            status,
            businessId,

            platform: "flutterwave",
            meta: JSON.stringify({
              orderRef,
            }),
          },
        });

        if (storeAccount) {
          return res
            .status(201)
            .json(JParser("ok-response!", true, storeAccount));
        }
      }
    } else {
      return res
        .status(200)
        .json(JParser("virtual account already exist", true, find));
    }
  } catch (error) {
    next(error);
  }
});

// get a virtual account
exports.get_virtual_account = useAsync(async (req, res, next) => {
  try {
    // use order ref
    const { orderRef } = req.params;

    const account = await flutterwaveServices.getVirtualAccount(orderRef);

    // get the data from this account
    const { data, status } = account;

    if (status === "error") {
      return res.status(400).json(JParser("failed", false, account.message));
    } else {
      return res.status(200).json(JParser("ok-response", true, account));
    }
  } catch (error) {
    next(error);
  }
});

/*
  Billers
*/

// airtime billers
exports.get_airtime_billers = useAsync(async (req, res, next) => {
  try {
    const biller = await flutterwaveServices.getBillers({
      airtime: 1,
      country: "NG",
    });

    const { status, message } = biller;

    if (status === "success") {
      const { data } = biller;
      return res.status(200).json(JParser("ok-response", true, data));
    } else {
      return res
        .status(400)
        .json(JParser("something went wrong", false, message));
    }
  } catch (error) {
    next(error);
  }
});

// data billers
exports.get_data_billers = useAsync(async (req, res, next) => {
  try {
    const biller = await flutterwaveServices.getBillers({
      data_bundle: 1,
      country: "NG",
    });

    const { status, message } = biller;

    if (status === "success") {
      const { data } = biller;
      return res.status(200).json(JParser("ok-response", true, data));
    } else {
      return res
        .status(400)
        .json(JParser("something went wrong", false, message));
    }
  } catch (error) {
    next(error);
  }
});

// power billers
exports.get_power_billers = useAsync(async (req, res, next) => {
  try {
    const biller = await flutterwaveServices.getBillers({
      power: 1,
      country: "NG",
    });

    const { status, message } = biller;

    if (status === "success") {
      const { data } = biller;
      return res.status(200).json(JParser("ok-response", true, data));
    } else {
      return res.status(400).json(JParser("error-response", false, message));
    }
  } catch (error) {
    next(error);
  }
});

// cable network billers
exports.get_cable_billers = useAsync(async (req, res, next) => {
  try {
    const biller = await flutterwaveServices.getBillers({
      cable: 1,
      country: "NG",
    });

    const { status, message } = biller;

    if (status === "success") {
      const { data } = biller;
      return res.status(200).json(JParser("ok-response", true, data));
    } else {
      return res.status(400).json(JParser("error-response", false, message));
    }
  } catch (error) {
    next(error);
  }
});

// validate bill
exports.validate_bill = useAsync(async (req, res, next) => {
  try {
    //  get the item code

    const { customer, itemCode, billerCode } = req.body;
    const payload = {
      item_code: itemCode,
      code: billerCode,
      customer,
    };

    const validate = await flutterwaveServices.validateBill({ ...payload });

    const { status, data } = validate;

    if (status !== "error") {
      return res.status(200).json(JParser("ok-response", true, validate));
    } else {
      return res.status(400).json(JParser("invalid bill", false, null));
    }
  } catch (error) {
    next(error);
  }
});

// course payments
exports.flutterwave_course_card = useAsync(async (req, res, next) => {
  try {
    const {
      cardNumber: card_number,
      cvv,
      expiryYear: expiry_year,
      expiryMonth: expiry_month,
      courseIds,
    } = req.body;

    const { fullname, id, email } = req.user;

    // Validate all the courses
    const courses = await Promise.all(
      courseIds.map((courseId) => courseServices.findOne(courseId))
    );

    // Check if all courseIds are valid
    if (courses.every((course) => course)) {
      const totalAmount = courses.reduce((total, course) => {
        const { amount, discount } = course.pricing;
        return (
          total + (Number(amount) - (Number(discount) * Number(amount)) / 100)
        );
      }, 0);

      const tx_ref = `course|${courseIds.join("|")}|${Date.now()}`;

      let finalAmount = totalAmount;

      const tax = await taxServices.findBy({
        country: "nigeria",
      });

      if (tax) {
        const { vat } = tax;

        finalAmount = finalAmount + (vat * finalAmount) / 100;
      }

      const details = {
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        currency: "NGN",
        amount: finalAmount,
        fullname,
        email,
        tx_ref,
        enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
        meta: {
          course: courseIds,
        },
      };

      const charge = await flutterwave.Charge.card(details);

      // Check if payment is successful
      if (charge && charge.status && charge.status === "successful") {
        // Record the payment details
        return res.status(200).json(JParser("Paid successfully", true, charge));
      } else if (charge && charge.status && charge.status === "success") {
        const { mode, fields } = charge.meta.authorization;

        const data = {
          mode,
          fields,
          redirect_url: charge.meta.authorization || null,
        };
        return res
          .status(202)
          .json(JParser("Authorization required", true, data));
      } else {
        return res.status(400).json(JParser("Invalid details ", false, charge));
      }
    } else {
      // If any courseId is invalid, return 404
      return res
        .status(404)
        .json(JParser("One or more courses do not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

// course authorize
exports.flutterwave_authorize_course_card = useAsync(async (req, res, next) => {
  try {
    const {
      cardNumber: card_number,
      cvv,
      expiryYear: expiry_year,
      expiryMonth: expiry_month,
      courseIds,
    } = req.body;

    const { fullname, id, email } = req.user;

    // Validate all the courses
    const courses = await Promise.all(
      courseIds.map((courseId) => courseServices.findOne(courseId))
    );

    // Check if all courseIds are valid
    if (courses.every((course) => course)) {
      const tx_ref = `course|${courseIds.join("|")}|` + Date.now();

      // Calculate total amount
      const totalAmount = courses.reduce((total, course) => {
        const { amount, discount } = course.pricing;
        return (
          total + (Number(amount) - (Number(discount) * Number(amount)) / 100)
        );
      }, 0);

      const metas = courses.map((course) => ({
        courseId: course.id,
        price: course.pricing.amount,
        discount: course.pricing.discount,
      }));

      let finalAmount = totalAmount;

      const tax = await taxServices.findBy({
        country: "nigeria",
      });

      if (tax) {
        const { vat } = tax;

        finalAmount = finalAmount + (vat * finalAmount) / 100;
      }

      const details = {
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        currency: "NGN",
        amount: finalAmount,
        fullname,
        email,
        tx_ref,
        enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
        authorization: {
          mode: req.body.authorization.mode,
          pin: req.body.authorization.pin,
        },
        meta: {
          courses: JSON.stringify(metas),
        },
      };

      const charge = await flutterwave.Charge.card(details);

      // Check if payment is successful
      if (charge && charge.status && charge.data.status === "pending") {
        const { mode, fields } = charge.meta.authorization;
        const data = {
          mode,
          fields,
          tx_ref: charge.data.flw_ref,
        };
        return res
          .status(202)
          .json(JParser("Authorization needed", true, data));
      } else if (charge && charge.status && charge.status === "successful") {
        // enrol the course details
        return res
          .status(200)
          .json(JParser("Charged successfully", true, charge));
      } else {
        return res.status(400).json(JParser("Invalid details", false, null));
      }
    } else {
      // If any courseId is invalid, return 404
      return res
        .status(404)
        .json(JParser("One or more courses do not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

// course otp
exports.flutterwave_card_otp = useAsync(async (req, res, next) => {
  try {
    // the payload
    const { otp, txRef: tx_ref } = req.body;

    const response = await flutterwave.Charge.validate({
      otp,
      flw_ref: tx_ref,
    });

    if (response.data && response.data.status === "successful") {
      const data = response.data;

      // verify the transactions

      const verifyCourseTransaction = await flutterwave.Transaction.verify({
        id: data.id,
      });

      // check if the verification is successful

      if (
        verifyCourseTransaction.status === "success" &&
        verifyCourseTransaction.data.status === "successful"
      ) {
        // get the meta

        let courses = JSON.parse(verifyCourseTransaction.data.meta.courses);

        const { status, amount } = response.data;

        // store the transaction into database
        const { email } = data.customer;

        const user = await usersServices.findBy({ email });

        // the transaction needs to be stored based on course ids

        const enrolledCourses = [];

        const tax = await taxServices.findBy({
          country: "nigeria",
        });

        for (const course of courses) {
          const totalAmount =
            course.price - (course.discount * course.price) / 100;

          let finalAmount = totalAmount;

          if (tax) {
            const { vat } = tax;

            finalAmount = finalAmount + (vat * finalAmount) / 100;
          }

          const transactionData = {
            body: {
              paymentId: data.id,
              paidFor: "course",
              paidForId: data.tx_ref,
              method: "flutterwave",
              amount: finalAmount,
              cost: course.price,
              courseId: course.courseId,
              status,
              userId: user.id,
            },
          };

          await transactionServices.store(transactionData);

          req.body.userId = user.id;
          req.body.courseId = course.courseId;
          req.body.paymentPlatform = "flutterwave";
          req.body.paymentId = data.id;

          const enrollment = await courseEnrolServices.store(req);

          enrolledCourses.push(enrollment);
        }

        return res
          .status(201)
          .json(JParser("ok-response", true, enrolledCourses));
      }
    } else {
      return res.status(400).json(JParser(response.message, false, null));
    }
  } catch (error) {
    next(error);
  }
});

/*
  - job posting payment 
  - jobs payment 
  - job authorization 
  - job otp
*/

exports.flutterwave_business_job_posting_card = useAsync(
  async (req, res, next) => {
    try {
      const {
        cardNumber: card_number,
        cvv,
        expiryYear: expiry_year,
        expiryMonth: expiry_month,
        jobId,
        jobPaymentTypeId,
        country,
      } = req.body;

      // get the business id,
      const { id: businessId, email, companyName } = req.business;

      const fullname = companyName;

      const isJob = await jobServices.findOne(jobId);

      let amount;
      // Check if all jobId are valid
      if (isJob) {
        //  check the payment plan

        // check if user have already paid for this job

        const isPaid = await transactionServices.findBy({
          businessId,
          paidForId: jobId,
          paidFor: "jobs",
        });

        if (isPaid) {
          return res
            .status(200)
            .json(JParser("you've already paid for this job", true, isPaid));
        }
        // get if business have paid for this job

        const jobPlan = await jobPaymentTypeServices.findOne(jobPaymentTypeId);

        if (!jobPlan) {
          return res
            .status(404)
            .json(JParser("job plan does not exist", false, null));
        }

        const { price } = jobPlan;

        const isBusinessPlan = await jobBusinessPricingServices.findBy({
          businessId,
        });

        if (isBusinessPlan) {
          const { discount } = isBusinessPlan;
          amount = price - (discount * price) / 100;
          // set the amount
        } else {
          // check the country
          const isCountry = await jobCountryPricingServices.findBy({ country });
          const { discount } = isCountry;
          amount = price - (discount * price) / 100;
        }

        const tx_ref = `job|${jobId}|${Date.now()}`;

        const details = {
          card_number,
          cvv,
          expiry_month,
          expiry_year,
          currency: "NGN",
          amount,
          fullname,
          email,
          tx_ref,
          enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
          meta: {
            job: jobId,
          },
        };

        const charge = await flutterwave.Charge.card(details);

        // Check if payment is successful
        if (charge && charge.status && charge.status === "successful") {
          // Record the payment details
          const { mode, fields } = charge.meta.authorization;

          const data = {
            mode,
            fields,
            tx_ref: charge.data.flw_ref,
          };
          return res
            .status(202)
            .json(JParser("Authorization needed", true, data));
        } else if (charge && charge.status && charge.status === "success") {
          const { mode, fields } = charge.meta.authorization;

          const data = {
            mode,
            fields,
            redirect_url: charge.meta.authorization || null,
          };
          return res
            .status(202)
            .json(JParser("Authorization required", true, data));
        } else {
          return res
            .status(400)
            .json(JParser("Invalid details ", false, charge));
        }
      } else {
        return res.status(404).json(JParser("job does not exist", false, null));
      }
    } catch (error) {
      next(error);
    }
  }
);

exports.flutterwave_business_job_posting_authorize_card = useAsync(
  async (req, res, next) => {
    try {
      const {
        cardNumber: card_number,
        cvv,
        expiryYear: expiry_year,
        expiryMonth: expiry_month,
        jobId,
        jobPaymentTypeId,
        country,
      } = req.body;

      // get the business id,
      const { id: businessId, email, companyName } = req.business;

      const fullname = companyName;

      const isJob = await jobServices.findOne(jobId);

      let amount;
      // Check if all jobId are valid
      if (isJob) {
        //  check the payment plan

        const isPaid = await transactionServices.findBy({
          businessId,
          paidForId: jobId,
          paidFor: "jobs",
        });

        if (isPaid) {
          return res
            .status(200)
            .json(JParser("you've already paid for this job", true, isPaid));
        }

        const jobPlan = await jobPaymentTypeServices.findOne(jobPaymentTypeId);

        if (!jobPlan) {
          return res
            .status(404)
            .json(JParser("job plan does not exist", false, null));
        }

        const { price } = jobPlan;

        const isBusinessPlan = await jobBusinessPricingServices.findBy({
          businessId,
        });

        if (isBusinessPlan) {
          const { discount } = isBusinessPlan;
          amount = price - (discount * price) / 100;
          // set the amount
        } else {
          // check the country
          const isCountry = await jobCountryPricingServices.findBy({ country });
          const { discount } = isCountry;
          amount = price - (discount * price) / 100;
        }

        const tx_ref = `job|${jobId}|${Date.now()}`;

        const details = {
          card_number,
          cvv,
          expiry_month,
          expiry_year,
          currency: "NGN",
          amount,
          fullname,
          email,
          tx_ref,
          enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
          meta: {
            job: jobId,
          },
          authorization: {
            mode: req.body.authorization.mode,
            pin: req.body.authorization.pin,
          },
        };

        const charge = await flutterwave.Charge.card(details);

        // Check if payment is successful
        if (charge && charge.status && charge.status === "successful") {
          // Record the payment details
          const { mode, fields } = charge.meta.authorization;
          const data = {
            mode,
            fields,
            tx_ref: charge.data.flw_ref,
          };

          // insert the record into the db and change the job status
          return res
            .status(201)
            .json(JParser("job paid successfully", true, data));
        } else if (charge && charge.status && charge.status === "success") {
          const { mode, fields } = charge.meta.authorization;
          const data = {
            mode,
            fields,
            tx_ref: charge.data.flw_ref,
          };
          return res
            .status(202)
            .json(JParser("Authorization needed", true, data));
        } else {
          return res
            .status(400)
            .json(JParser("Invalid details ", false, charge));
        }
      } else {
        return res.status(404).json(JParser("job does not exist", false, null));
      }
    } catch (error) {
      next(error);
    }
  }
);

exports.flutterwave_business_job_posting_authorize_otp = useAsync(
  async (req, res, next) => {
    try {
      // the payload
      const { otp, txRef: tx_ref } = req.body;

      await flutterwave.Charge.validate({
        otp,
        flw_ref: tx_ref,
      }).then(async (response) => {
        if (response.data && response.data.status === "successful") {
          const data = response.data;
          const { amount } = response.data;

          // store the transaction into database

          const { email } = data.customer;

          const business = await businessServices.findBy({ email });

          const jobId = data.tx_ref.split("|").slice(1, -1);

          const transactionData = {
            body: {
              paymentId: data.id,
              paidFor: "jobs",
              paidForId: jobId[0],
              method: "flutterwave",
              amount,
              cost: amount,
              status: true,
              businessId: business.id,
            },
          };

          const createTransaction = await transactionServices.store(
            transactionData
          );

          if (createTransaction) {
            // change the job status to open

            const updateJob = await jobServices.update(jobId, {
              body: {
                status: "opened",
                businessId: business.id,
              },
            });

            if (updateJob) {
              return res
                .status(201)
                .json(JParser("ok-response", true, createTransaction));
            }
          }
        } else {
          return res.status(400).json(JParser(response.message, false, null));
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
  - funding posting payment 
  - funding payment 
  - funding authorization 
  - funding otp
*/

exports.flutterwave_business_funding_posting_card = useAsync(
  async (req, res, next) => {
    try {
      const {
        cardNumber: card_number,
        cvv,
        expiryYear: expiry_year,
        expiryMonth: expiry_month,
        fundingId,
        fundingPaymentTypeId,
        country,
      } = req.body;

      // get the business id,
      const { id: businessId, email, companyName } = req.business;

      const fullname = companyName;

      const isFunding = await fundingServices.findOne(fundingId);

      let amount;
      // Check if all fundingId are valid

      if (!isFunding) {
        return res
          .status(404)
          .json(JParser("funding deos not exist", false, null));
      }

      //  check the payment plan

      // check if user have already paid for this funding

      const isPaid = await transactionServices.findBy({
        businessId,
        paidForId: fundingId,
        paidFor: "funding",
      });

      if (isPaid) {
        return res
          .status(200)
          .json(JParser("you've already paid for this funding", true, isPaid));
      }
      // get if business have paid for this funding

      const fundingPlan = await fundingPaymentTypeServices.findOne(
        fundingPaymentTypeId
      );

      if (!fundingPlan) {
        return res
          .status(404)
          .json(JParser("funding plan does not exist", false, null));
      }

      const { price } = fundingPlan;

      const isBusinessPlan = await fundingBusinessPlanServices.findBy({
        businessId,
      });

      if (isBusinessPlan) {
        const { discount } = isBusinessPlan;
        amount = price - (discount * price) / 100;
        // set the amount
      } else {
        // check the country
        const isCountry = await fundingCountryPlanServices.findBy({
          country,
        });

        if (isCountry) {
          const { discount } = isCountry;
          amount = price - (discount * price) / 100;
        } else {
          amount = price;
        }
      }

      const tx_ref = `funding|${fundingId}|${Date.now()}`;

      const details = {
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        currency: "NGN",
        amount,
        fullname,
        email,
        tx_ref,
        enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
        meta: {
          funding: fundingId,
        },
      };

      const charge = await flutterwave.Charge.card(details);

      // Check if payment is successful
      if (charge && charge.status && charge.status === "successful") {
        // Record the payment details
        const { mode, fields } = charge.meta.authorization;

        const data = {
          mode,
          fields,
          tx_ref: charge.data.flw_ref,
        };
        return res
          .status(202)
          .json(JParser("Authorization needed", true, data));
      } else if (charge && charge.status && charge.status === "success") {
        const { mode, fields } = charge.meta.authorization;

        const data = {
          mode,
          fields,
          redirect_url: charge.meta.authorization || null,
        };
        return res
          .status(202)
          .json(JParser("Authorization required", true, data));
      } else {
        return res.status(400).json(JParser("Invalid details ", false, charge));
      }
    } catch (error) {
      next(error);
    }
  }
);

exports.flutterwave_business_funding_posting_authorize_card = useAsync(
  async (req, res, next) => {
    try {
      const {
        cardNumber: card_number,
        cvv,
        expiryYear: expiry_year,
        expiryMonth: expiry_month,
        fundingId,
        fundingPaymentTypeId,
        country,
      } = req.body;

      // get the business id,
      const { id: businessId, email, companyName } = req.business;

      const fullname = companyName;

      const isFuding = await fundingServices.findOne(fundingId);

      let amount;

      // Check if all fundingId are valid

      if (!isFuding) {
        return res
          .status(404)
          .json(JParser("funding does not exist", false, null));
      }

      //  check the payment plan

      const isPaid = await transactionServices.findBy({
        businessId,
        paidForId: fundingId,
        paidFor: "funding",
      });

      if (isPaid) {
        return res
          .status(200)
          .json(JParser("you've already paid for this funding", true, isPaid));
      }

      const fundingPlan = await fundingPaymentTypeServices.findOne(
        fundingPaymentTypeId
      );

      if (!fundingPlan) {
        return res
          .status(404)
          .json(JParser("funding plan does not exist", false, null));
      }

      const { price } = fundingPlan;

      const isBusinessPlan = await fundingBusinessPlanServices.findBy({
        businessId,
      });

      if (isBusinessPlan) {
        const { discount } = isBusinessPlan;
        amount = price - (discount * price) / 100;
        // set the amount
      } else {
        // check the country
        const isCountry = await fundingCountryPlanServices.findBy({
          country,
        });

        if (isCountry) {
          const { discount } = isCountry;
          amount = price - (discount * price) / 100;
        } else {
          amount = price;
        }
      }

      const tx_ref = `funding|${fundingId}|${Date.now()}`;

      const details = {
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        currency: "NGN",
        amount,
        fullname,
        email,
        tx_ref,
        enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
        meta: {
          funding: fundingId,
        },
        authorization: {
          mode: req.body.authorization.mode,
          pin: req.body.authorization.pin,
        },
      };

      const charge = await flutterwave.Charge.card(details);

      // Check if payment is successful
      if (charge && charge.status && charge.status === "successful") {
        // Record the payment details
        const { mode, fields } = charge.meta.authorization;
        const data = {
          mode,
          fields,
          tx_ref: charge.data.flw_ref,
        };

        // insert the record into the db and change the job status
        return res
          .status(201)
          .json(JParser("funding paid successfully", true, data));
      } else if (charge && charge.status && charge.status === "success") {
        const { mode, fields } = charge.meta.authorization;
        const data = {
          mode,
          fields,
          tx_ref: charge.data.flw_ref,
        };
        return res
          .status(202)
          .json(JParser("Authorization needed", true, data));
      } else {
        return res.status(400).json(JParser("Invalid details ", false, charge));
      }
    } catch (error) {
      next(error);
    }
  }
);

exports.flutterwave_business_funding_posting_authorize_otp = useAsync(
  async (req, res, next) => {
    try {
      // the payload
      const { otp, txRef: tx_ref } = req.body;

      await flutterwave.Charge.validate({
        otp,
        flw_ref: tx_ref,
      }).then(async (response) => {
        if (response.data && response.data.status === "successful") {
          const data = response.data;
          const { amount } = response.data;

          // store the transaction into database

          const { email } = data.customer;

          const business = await businessServices.findBy({ email });

          const fundingId = data.tx_ref.split("|").slice(1, -1);

          const transactionData = {
            body: {
              paymentId: data.id,
              paidFor: "funding",
              paidForId: fundingId[0],
              method: "flutterwave",
              amount,
              cost: amount,
              status: true,
              businessId: business.id,
            },
          };

          const createTransaction = await transactionServices.store(
            transactionData
          );

          if (createTransaction) {
            // change the job status to open

            const updateFunding = await fundingServices.update(fundingId, {
              body: {
                status: "active",
                businessId: business.id,
              },
            });

            if (updateFunding) {
              return res
                .status(201)
                .json(JParser("ok-response", true, createTransaction));
            }
          }
        } else {
          return res.status(400).json(JParser(response.message, false, null));
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
  invite payment controllers
*/

function generateInviteTxRef(invites, req) {
  const timestamp = new Date().toISOString();
  return `invites|${req.business.id}|${timestamp}`;
}

exports.flutterwave_business_invite_posting_card = useAsync(
  async (req, res, next) => {
    try {
      const {
        cardNumber: card_number,
        cvv,
        expiryYear: expiry_year,
        expiryMonth: expiry_month,
        invites,
        invitePaymentTypeId,
        country,
      } = req.body;

      const { id: businessId, email, companyName: fullname } = req.business;

      const isPaymentType = await invitePaymentTypeServices.findOne(
        invitePaymentTypeId
      );
      if (!isPaymentType) {
        return res
          .status(404)
          .json(JParser("Invalid payment type", false, null));
      }

      const { price } = isPaymentType;
      let amount = price;

      const isBusinessPlan = await inviteBusinessPricingServices.findBy({
        businessId,
      });

      if (isBusinessPlan) {
        amount -= (isBusinessPlan.discount * price) / 100;
      } else {
        const isCountry = await inviteCountryPricingServices.findBy({
          country,
        });

        amount = isCountry ? price - (isCountry.discount * price) / 100 : price;
      }

      const tx_ref = generateInviteTxRef(invites, req);

      let finalAmount = amount * invites.length;

      const tax = await taxServices.findBy({
        country: "nigeria",
      });

      if (tax) {
        const { vat } = tax;

        finalAmount = finalAmount + (vat * finalAmount) / 100;
      }

      const details = {
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        currency: "NGN",
        amount: finalAmount,
        fullname,
        email,
        tx_ref,
        enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
        meta: { invites },
      };

      const charge = await flutterwave.Charge.card(details);

      if (
        charge &&
        charge.status &&
        ["successful", "success"].includes(charge.status)
      ) {
        const { mode, fields } = charge.meta.authorization;

        const data = {
          mode,
          fields,
          redirect_url: charge.meta.authorization?.redirect_url || null,
        };

        return res
          .status(202)
          .json(JParser("Authorization required", true, data));
      } else {
        return res
          .status(400)
          .json(JParser("Charge failed", false, charge.message));
      }
    } catch (error) {
      next(error);
    }
  }
);

exports.flutterwave_business_invite_posting_authorize_card = useAsync(
  async (req, res, next) => {
    try {
      const {
        cardNumber: card_number,
        cvv,
        expiryYear: expiry_year,
        expiryMonth: expiry_month,
        invites,
        invitePaymentTypeId,
        country,
      } = req.body;

      const { id: businessId, email, companyName: fullname } = req.business;

      const isPaymentType = await invitePaymentTypeServices.findOne(
        invitePaymentTypeId
      );
      if (!isPaymentType) {
        return res
          .status(404)
          .json(JParser("Invalid payment type", false, null));
      }

      const { price } = isPaymentType;
      let amount = price;

      const isBusinessPlan = await inviteBusinessPricingServices.findBy({
        businessId,
      });

      if (isBusinessPlan) {
        amount -= (isBusinessPlan.discount * price) / 100;
      } else {
        const isCountry = await inviteCountryPricingServices.findBy({
          country,
        });

        amount = isCountry ? price - (isCountry.discount * price) / 100 : price;
      }

      const tx_ref = generateInviteTxRef(invites, req);

      const details = {
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        currency: "NGN",
        amount,
        fullname,
        email,
        tx_ref,
        enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
        meta: { invites: JSON.stringify(invites) },
        authorization: {
          mode: req.body.authorization.mode,
          pin: req.body.authorization.pin,
        },
      };

      const charge = await flutterwave.Charge.card(details);
      return handleChargeResponse(charge, res);
    } catch (error) {
      next(error);
    }
  }
);

function handleChargeResponse(charge, res) {
  if (charge && ["successful", "success"].includes(charge.status)) {
    const { mode, fields } = charge.meta.authorization;
    const data = {
      mode: mode,
      fields: fields,
      tx_ref: charge.data.flw_ref,
      redirect_url: charge.meta.authorization?.redirect_url || null,
    };
    const status = charge.status === "successful" ? 201 : 202;
    const message =
      charge.status === "successful"
        ? "Invite paid successfully"
        : "Authorization needed";

    return res.status(status).json(JParser(message, true, data));
  } else {
    return res.status(400).json(JParser("Charge failed", false, charge));
  }
}

exports.flutterwave_business_invite_posting_authorize_otp = useAsync(
  async (req, res, next) => {
    try {
      const { otp, txRef: tx_ref } = req.body;

      const response = await flutterwave.Charge.validate({
        otp,
        flw_ref: tx_ref,
      });

      if (response.data && response.data.status === "successful") {
        // store the transaction

        const { data } = response;
        const { id, amount } = data;

        // store the transaction into database

        const { email } = data.customer;

        const business = await businessServices.findBy({ email });

        const verifyTransaction = await flutterwave.Transaction.verify({
          id,
        });

        // check if the verification is successful

        if (
          verifyTransaction.status === "success" &&
          verifyTransaction.data.status === "successful"
        ) {
          let invites = JSON.parse(verifyTransaction.data.meta.invites);

          const results = [];

          for (const invite of invites) {
            const { email, invitedUserType, roleIds, permissionIds } = invite;

            if (
              !(await validateRoles(roleIds)) ||
              !(await validatePermissions(permissionIds))
            ) {
              return res
                .status(404)
                .json(
                  JParser("Invalid role or permission passed", false, null)
                );
            }

            const invitedEntityType =
              invitedUserType === "user"
                ? {
                    service: userServices,
                    roleTitle: "user",
                    idFieldName: "userId",
                  }
                : {
                    service: businessServices,
                    roleTitle: "business",
                    idFieldName: "businessId",
                  };

            const existingEntity = await invitedEntityType.service.findBy({
              email,
            });

            let entityData = {};

            if (existingEntity) {
              // remove the invite from the invite list

              entityData = await handleExistingEntity(
                res,
                req,
                existingEntity,
                invitedEntityType.service,
                invitedEntityType.idFieldName
              );
            } else {
              entityData = await handleNewEntity(res, email, invitedEntityType);
            }

            if (entityData.response) {
              return res.status(entityData.status).json(entityData.response);
            }

            invite[`${invitedUserType}Id`] = entityData.id;
            const token = crypto.randomBytes(30).toString("hex");
            invite.token = token;
            setOwnerInfo(req, invite);

            const data = {
              body: {
                ...invite,
                ownerType: req.user ? "user" : "business",
                ownersId: req.user ? req.user.id : req.business.id,
              },
            };
            const creationResult = await inviteService.store(data);

            if (!creationResult) {
              return res
                .status(500)
                .json(JParser("Something went wrong", true, creationResult));
            }

            // store the transaction records for every invite
            const transactionData = {
              body: {
                paymentId: id,
                paidFor: "invites",
                paidForId: creationResult.id,
                method: "flutterwave",
                amount,
                cost: amount,
                status: true,
                businessId: business.id,
              },
            };

            await transactionServices.store(transactionData);

            const acceptLink = `${process.env.APP_URL}/accept-invite/${token}?email=${invite.email}`;
            // mail the token
            await sendgridServices.inviteUserMail({
              email: invite.email,
              acceptLink,
              companyName: req.business.companyName,
            });

            results.push(creationResult);
          }

          return res
            .status(201)
            .json(JParser("Invites created successfully", true, results));
        }
      } else {
        return res.status(400).json(JParser(response.message, false, null));
      }
    } catch (error) {
      next(error);
    }
  }
);

/*
  - payment for free course payment 
*/

exports.free_course_posting_payment = useAsync(async (req, res, next) => {
  try {
    const {
      cardNumber: card_number,
      cvv,
      expiryYear: expiry_year,
      expiryMonth: expiry_month,
      coursePaymentTypeId,
      courseId,
      country,
    } = req.body;

    const { id: businessId, email, companyName: fullname } = req.business;

    // validate the course
    const isCourse = await courseServices.findOne(courseId);

    if (!isCourse) {
      return res
        .status(400)
        .json(JParser("course does not exist", false, null));
    }

    // get the course pricing,
    const isPaymentType = await coursePaymentTypeServices.findOne(
      coursePaymentTypeId
    );

    if (!isPaymentType) {
      return res.status(404).json(JParser("Invalid payment type", false, null));
    }

    const { price } = isPaymentType;
    let amount = price;

    const isBusinessPlan = await courseBussinessPricingServices.findBy({
      businessId,
    });

    if (isBusinessPlan) {
      amount -= (isBusinessPlan.discount * price) / 100;
    } else {
      const isCountry = await courseCountryPricingServices.findBy({
        country,
      });

      amount = isCountry ? price - (isCountry.discount * price) / 100 : price;
    }

    // generate the tx_ref
    const tx_ref = `business-free-course|${courseId}|${Date.now()}`;

    let finalAmount = amount;

    const tax = await taxServices.findBy({
      country: "nigeria",
    });

    if (tax) {
      const { vat } = tax;

      finalAmount = finalAmount + (vat * finalAmount) / 100;
    }

    const details = {
      card_number,
      cvv,
      expiry_month,
      expiry_year,
      currency: "NGN",
      amount: finalAmount,
      fullname,
      email,
      tx_ref,
      enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
      meta: { courseId },
    };

    const charge = await flutterwave.Charge.card(details);

    if (
      charge &&
      charge.status &&
      ["successful", "success"].includes(charge.status)
    ) {
      const { mode, fields } = charge.meta.authorization;

      const data = {
        mode,
        fields,
        redirect_url: charge.meta.authorization?.redirect_url || null,
      };

      return res
        .status(202)
        .json(JParser("Authorization required", true, data));
    } else {
      return res
        .status(400)
        .json(JParser("Charge failed", false, charge.message));
    }
  } catch (error) {
    next(error);
  }
});

exports.free_course_posting_card_authorize = useAsync(
  async (req, res, next) => {
    try {
      const {
        cardNumber: card_number,
        cvv,
        expiryYear: expiry_year,
        expiryMonth: expiry_month,
        coursePaymentTypeId,
        courseId,
        country,
      } = req.body;

      const { id: businessId, email, companyName: fullname } = req.business;

      // validate the course
      const isCourse = await courseServices.findOne(courseId);

      if (!isCourse) {
        return res
          .status(400)
          .json(JParser("course does not exist", false, null));
      }

      // get the course pricing,
      const isPaymentType = await coursePaymentTypeServices.findOne(
        coursePaymentTypeId
      );

      if (!isPaymentType) {
        return res
          .status(404)
          .json(JParser("Invalid payment type", false, null));
      }

      const { price } = isPaymentType;
      let amount = price;

      const isBusinessPlan = await courseBussinessPricingServices.findBy({
        businessId,
      });

      if (isBusinessPlan) {
        amount -= (isBusinessPlan.discount * price) / 100;
      } else {
        const isCountry = await courseCountryPricingServices.findBy({
          country,
        });

        amount = isCountry ? price - (isCountry.discount * price) / 100 : price;
      }

      // generate the tx_ref
      const tx_ref = `business-free-course|${courseId}|${Date.now()}`;

      let finalAmount = amount;

      const tax = await taxServices.findBy({
        country: "nigeria",
      });

      if (tax) {
        const { vat } = tax;

        finalAmount = finalAmount + (vat * finalAmount) / 100;
      }

      const details = {
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        currency: "NGN",
        amount: finalAmount,
        fullname,
        email,
        tx_ref,
        enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
        meta: { courseId },
        authorization: {
          mode: req.body.authorization.mode,
          pin: req.body.authorization.pin,
        },
      };

      const charge = await flutterwave.Charge.card(details);

      if (charge && charge.status && charge.status === "successful") {
        const { mode, fields } = charge.meta.authorization;

        const data = {
          mode,
          fields,
          tx_ref: charge.data.flw_ref,
        };

        // insert the record into the db and change the job status
        return res.status(201).json(JParser("ok-response", true, data));
      } else if (charge && charge.status && charge.status === "success") {
        const { mode, fields } = charge.meta.authorization;
        const data = {
          mode,
          fields,
          tx_ref: charge.data.flw_ref,
        };
        return res
          .status(202)
          .json(JParser("Authorization needed", true, data));
      } else {
        return res.status(400).json(JParser("Invalid details ", false, charge));
      }
    } catch (error) {
      next(error);
    }
  }
);

exports.free_course_posting_card_authorize_otp = useAsync(
  async (req, res, next) => {
    try {
      // the payload
      const { otp, txRef: tx_ref } = req.body;

      await flutterwave.Charge.validate({
        otp,
        flw_ref: tx_ref,
      }).then(async (response) => {
        if (response.data && response.data.status === "successful") {
          const data = response.data;
          const { amount } = response.data;

          // store the transaction into database

          const { email } = data.customer;

          const business = await businessServices.findBy({ email });

          const courseId = data.tx_ref.split("|").slice(1, -1);

          const transactionData = {
            body: {
              paymentId: data.id,
              paidFor: "free-business-course",
              paidForId: courseId[0],
              method: "flutterwave",
              amount,
              cost: amount,
              status: true,
              businessId: business.id,
            },
          };

          const createTransaction = await transactionServices.store(
            transactionData
          );

          if (createTransaction) {
            // create the pricing

            // check if pricing already exist
            const isPricing = await pricingServices.getCoursePricingById(
              courseId[0]
            );

            if (!isPricing) {
              const data = {
                body: {
                  courseId: courseId[0],
                  type: "free",
                  currency: "ngn",
                  amount: 0,
                  discount: 100,
                },
              };

              const storePricing = await pricingServices.store(data);

              if (storePricing) {
                return res
                  .status(201)
                  .json(JParser("payment successful", true, storePricing));
              }
            } else {
              const data = {
                body: {
                  type: "free",
                  currency: "ngn",
                  amount: 0,
                  discount: 100,
                },
              };
              const update = await pricingServices.update(isPricing.id, data);

              if (update) {
                // get the updated pricing
                const pricing = await pricingServices.findBy({ courseId });

                return res
                  .status(200)
                  .json(JParser("pricing updated", true, pricing));
              }
            }
          }
        } else {
          return res.status(400).json(JParser(response.message, false, null));
        }
      });
    } catch (error) {
      next(error);
    }
  }
);
