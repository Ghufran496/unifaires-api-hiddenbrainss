const paymentServices = require("../services/payment.services");
const associatePricingServices = require("../services/associate.pricing.services");
const userServices = require("../services/users.services");
const businessServices = require("../services/business.services");
const associateUserServices = require("../services/associate.user.services");
const roleServices = require("../services/role.service");
const associateTransactionServices = require("../services/associate.transaction.services");
const sendgridServices = require("../services/sendgrid.services");
const transactionServices = require("../services/transactions.services");
const invitePaymentTypeServices = require("../services/invite.payment.type.services");
const inviteCountryPricingServices = require("../services/invite.country.pricing.services");
const inviteBusinessPricingServices = require("../services/invite.business.pricing.services");
const taxServices = require("../services/tax.services");

const crypto = require("crypto");

const inviteService = require("../services/invite.services");

const sha1 = require("sha1");
const { User, Business } = require("./../models");

const { JParser } = require("../core/core.utils");
const { useAsync } = require("../core");
const { generateUnique10CharacterUUID } = require("../helpers/voucher"); // Import the function
const enrolCourseServices = require("../services/course/enrol.courses.services");

const fundingServices = require("../services/funding.services");

const fundingPaymentTypeServices = require("../services/funding.payment.type.services");

const fundingBusinessPlanServices = require("../services/funding.business.pricing.services");

const fundingCountryPlanServices = require("../services/funding.country.pricing.services");

// jobs services
const jobServices = require("../services/jobs.services");
const jobBusinessPricingServices = require("../services/job.business.pricing.services");
const jobCountryPricingServices = require("../services/job.country.pricings.services");
const jobPaymentTypeServices = require("../services/jobs.payment.type.services");

// free business course payment
const courseServices = require("../services/course/course.services");
const courseCountryPricingServices = require("../services/course.country.pricing.services");
const courseBussinessPricingServices = require("../services/course.business.pricing.services");
const coursePaymentTypeServices = require("../services/course.payment.type.services");
const pricingServices = require("../services/course/pricing.services");

const {
  setOwnerInfo,
  handleExistingEntity,
  handleNewEntity,
  validatePermissions,
  validateRoles,
} = require("../helpers/invite.helper");

// add card
exports.add_card = useAsync(async (req, res, next) => {
  try {
    let email;
    let fullname;

    if (req.user) {
      email = req.user.email;

      fullname = req.user.firstname + req.user.lastname;
    } else if (req.business) {
      email = req.business.email;

      fullname = req.business.firstname + req.business.lastname;
    }
    // const { email, fullname } = req.user;
    const { exp_month, exp_year, number, cvc } = req.body;

    const card = { exp_month, exp_year, number, cvc };

    const isStripe = await paymentServices.getCustomerByEmail(email);

    let customerId;
    if (!isStripe || isStripe.data.length === 0) {
      req.body.name = fullname;
      req.body.email = email;

      const data = {
        name: fullname,
        email,
      };

      const customer = await paymentServices.createCustomer(data);

      customerId = customer.id;
    } else {
      const customerInfo = await paymentServices.getCustomerByEmail(email);
      customerId = customerInfo.data[0].id;
    }

    card.customer = customerId;

    const addCard = await paymentServices.addStripeCard(card);

    if (addCard) {
      await paymentServices.addCardToCustomer({
        customer_id: card.customer,
        token_id: addCard.id,
      });

      const customerCards = await paymentServices.getCustomerCards(
        card.customer
      );

      return res
        .status(201)
        .json(JParser("Card added successfully", true, customerCards));
    } else {
      return res.status(400).json(JParser("Something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});

// remove card
exports.remove_card = useAsync(async (req, res, next) => {
  try {
    const { cardId } = req.body;

    let email;
    if (req.user) {
      email = req.user.email;
    } else if (req.business) {
      email = req.business.email;
    }

    const customerInfo = await paymentServices.getCustomerByEmail(email);

    if (customerInfo) {
      const { id: customerId } = customerInfo.data[0];

      const removeCard = await paymentServices.removeStripeCard(
        customerId,
        cardId
      );

      if (removeCard) {
        const customer = await paymentServices.getCustomerByEmail(email);
        return res
          .status(200)
          .json(JParser("Card removed successfully", true, customer));
      } else {
        return res
          .status(400)
          .json(JParser("Something went wrong", false, null));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.create_stripe_customer = useAsync(async (req, res, next) => {
  try {
    // check if the email or id exist

    // search account with the email

    req.body["email"] = req.user.email;
    req.body["name"] = req.user.fullname;

    const query = `email:'${req.user.email}'`;

    const search = await paymentServices.searchStripeAccount(query);

    if (search && search.data.length > 0) {
      return res
        .status(200)
        .json(JParser("customer account already exist", true, search));
    } else {
      const create = await paymentServices.createCustomer(req.body);

      if (create) {
        return res
          .status(200)
          .json(JParser("customer account created successfully", true, create));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.get_all_stripe_customer = useAsync(async (req, res, next) => {
  try {
    const customer = await paymentServices.getAllCustomer();

    return res.json(JParser("customer account fetched", true, customer));
  } catch (error) {
    next(error);
  }
});

exports.update_stripe_customer = useAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await paymentServices.updateCustomerDetails(id, req.body);

    return res
      .status(200)
      .json(JParser("customer updated successfully", true, customer));
  } catch (error) {
    next(error);
  }
});

exports.get_stripe_customer_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.body;
    const customer = paymentServices.getCustomerById(id);

    return res.status(200).json(JParser("record fetch", true, customer));
  } catch (error) {
    next(error);
  }
});

exports.get_stripe_customer_by_email = useAsync(async (req, res, next) => {
  try {
    const { email } = req.body;
    const customer = paymentServices.getCustomerByEmail(email);

    return res.status(200).json(JParser("record fetch", true, customer));
  } catch (error) {
    next(error);
  }
});

exports.create_stripe_customer_token = useAsync(async (req, res, next) => {
  try {
    const data = ({ number: number, exp_month, exp_year, cvc } = req.body);

    const token = await paymentServices.createStripeToken(data);

    return res.status(200).json(JParser("token created", true, token));
  } catch (error) {
    next(error);
  }
});

exports.add_card_to_customer_stripe = useAsync(async (req, res, next) => {
  try {
    const data = ({ customer_id, card_token } = req.body);

    const create_card = await paymentServices.addCardToCustomer(data);

    return res.status(200).json(JParser("card created", true, create_card));
  } catch (error) {
    next(error);
  }
});

exports.stripe_charge_customer = useAsync(async (req, res, next) => {
  try {
    // get the customer or create
    const isCustomer = await paymentServices.getCustomerByEmail(req.user.email);

    let customer_id = null;
    if (isCustomer && isCustomer.data.length > 0) {
      customer_id = isCustomer.data[0].id;
    } else {
      req.body["email"] = req.user.email;
      req.body["name"] = req.user.firstname + req.user.lastname;
      // create account and get the id
      const createCustomer = await paymentServices.createCustomer(req.body);

      customer_id = createCustomer.id;
    }
    // create or get token

    // charge account
    if (req.user) {
      req.body.metadata["userId"] = req.user.id;
    } else if (req.business) {
      req.body.metadata["businessId"] = req.business.id;
    }

    const data = {
      amount: req.body.amount,
      currency: req.body.currency,
      customer: customer_id,
      description: req.body.description,
      metadata: req.body.metadata,
    };

    const charge_customer = await paymentServices.chargeStripeCustomer(data);

    return res.status(200).json(JParser("ok-response", true, charge_customer));
  } catch (error) {
    next(error);
  }
});

exports.get_all_stripe_customer_charges = useAsync(async (req, res, next) => {
  try {
    const charges = paymentServices.allStripeCharges();

    return res.status(200).json(JParser("ok-response", true, charges));
  } catch (error) {
    next(error);
  }
});

exports.get_all_stripe_transaction = useAsync(async (req, res, next) => {
  try {
    const charges = await paymentServices.allStripeCharges();

    return res.status(200).json(JParser("ok-response", true, charges));
  } catch (error) {
    next(error);
  }
});

exports.stripe_refund = useAsync(async (req, res, next) => {
  try {
    const { charge_id } = req.body;

    const refund = await paymentServices.refundStripeCharge(charge_id);

    return res.status(200).json(JParser("ok-response", true, refund));
  } catch (error) {
    next(error);
  }
});

exports.get_all_refunds = useAsync(async (req, res, next) => {
  try {
    const refunds = await paymentServices.getAllRefundCharges();

    return res.status(200).json(JParser("ok-response", true, refunds));
  } catch (error) {
    next(error);
  }
});

// get cards
exports.get_cards = useAsync(async (req, res, next) => {
  try {
    let query;

    if (req.user) {
      req.body["email"] = req.user.email;

      query = `email:'${req.user.email}'`;
    } else if (req.business) {
      req.body["email"] = req.business.email;

      query = `email:'${req.business.email}'`;
    }

    const search = await paymentServices.searchStripeAccount(query);

    if (search && search.data.length > 0) {
      const { id: customerID } = search.data[0];

      const cards = await paymentServices.findStripeCard(customerID);

      return res.status(200).json(JParser("success", true, cards));
    } else {
      return res
        .status(404)
        .json(JParser("no card available for this user ", true, null));
    }
  } catch (error) {
    next(error);
  }
});

// charge for associate payment
exports.associate_payment = useAsync(async (req, res, next) => {
  try {
    let email, firstname, lastname, userQuery;

    if (req.user) {
      email = req.user.email;
      firstname = req.user.firstname;
      lastname = req.user.lastname;
      userQuery = { userId: req.user.id, roleId: req.user.roleId };
    } else if (req.business) {
      email = req.business.email;
      firstname = req.business.firstname;
      lastname = req.business.lastname;
      userQuery = { businessId: req.business.id, roleId: req.business.roleId };
    }

    // check the payload and see if this user have already added this email to his associate

    fullname = firstname + lastname;

    async function calculatePaymentAmount(associates, pricing) {
      let totalYears = 0;
      let price = pricing[0].price;

      for (let associate of associates) {
        let startDate = new Date(associate.startDate);
        let endDate = new Date(associate.endDate);

        let yearDifference = endDate.getFullYear() - startDate.getFullYear();

        if (
          endDate.getMonth() < startDate.getMonth() ||
          (endDate.getMonth() === startDate.getMonth() &&
            endDate.getDate() < startDate.getDate())
        ) {
          yearDifference--;
        }

        totalYears += yearDifference;

        let monthDifference = endDate.getMonth() - startDate.getMonth();

        if (monthDifference >= 1) {
          totalYears++;
        }
      }

      return totalYears * price * 100;
    }

    async function getOrCreateCustomer(req, paymentServices) {
      let query = `email:'${email}'`;
      let search = await paymentServices.searchStripeAccount(query);

      if (search && search.data.length > 0) {
        return search.data[0];
      } else {
        let create = await paymentServices.createCustomer({
          email,
          name: fullname,
        });

        if (create) {
          return create;
        } else {
          throw new Error("Failed to create a customer");
        }
      }
    }

    async function chargeCustomer(
      req,
      res,
      next,
      paymentServices,
      customer,
      data
    ) {
      let pay = await paymentServices.chargeStripeCustomer(data);

      if (pay.paid) {
        // check the type of user to charge

        // store it to associate transactions
        let qty = JSON.parse(data.metadata.associates).length;

        let roleQuery = {};

        if (req.user) {
          roleQuery = { roleId: req.user.roleId };
        } else if (req.business) {
          roleQuery = { roleId: req.business.roleId };
        }

        let payload = {
          paymentId: pay.id,
          status: true,
          ...userQuery,
          amount: pay.amount,
          unitCost: pay.amount,
          qty,
          ...roleQuery,
          method: "stripe",
          cost: pay.amount,
        };

        let newPayload = { body: null };
        newPayload.body = payload;
        let associateTransaction = await associateTransactionServices.store(
          newPayload
        );

        let associates = JSON.parse(pay.metadata.associates);

        // check if user email aready exist

        // get role id of user
        associates.forEach(async (associate) => {
          let { email } = associate;

          let isUser = await userServices.findBy({ email });

          let voucher = generateUnique10CharacterUUID();

          if (isUser) {
            // save the user record to voucher table
            req.body = {
              ...userQuery,
              associateId: isUser.id,
              voucher,
              startAt: associate.startDate,
              endAt: associate.endDate,
              transactionId: associateTransaction.id,
            };

            let create = await associateUserServices.store(req);

            if (create) {
              await sendgridServices.voucher({ email, voucher });
            }

            // send mail
          } else {
            req.body = {
              firstname: associate.firstname,
              lastname: associate.lastname,
              email: associate.email,

              // password: associate.email,
            };

            // Generate username
            let username = `${firstname}-${lastname}`.toLowerCase();

            username = username.replace(/[^\w-]/g, "").replace(/\s+/g, "-");

            // If username starts with a number, remove the number
            if (/^\d/.test(username)) {
              username = username.replace(/^\d+/, "");
            }

            let isUsernameTaken = true;
            let counter = 1;

            while (isUsernameTaken) {
              const potentialUsername =
                counter === 1 ? username : `${username}${counter}`;
              const isUser = await userServices.findBy({
                username: potentialUsername,
              });

              if (!isUser) {
                req.body.username = potentialUsername;
                isUsernameTaken = false;
              } else {
                counter++;
              }
            }

            let value = req.body;

            // Rebuild user object
            value.apiKey = sha1(value.email + new Date().toISOString);
            value.token = sha1(value.email + new Date().toISOString);
            // value.password = sha1(value.password);

            if (!value.roleId) {
              // get the user role id
              let role = await roleServices.findBy({ title: "user" });

              value.roleId = role.id;
            }
            let [user, created] = await User.findOrCreate({
              where: { email: value.email },
              defaults: value,
            });

            // Indicate if the user is new

            if (created) {
              req.body = {
                ...userQuery,
                associateId: user.id,
                voucher,
                startAt: associate.startDate,
                endAt: associate.endDate,
                transactionId: associateTransaction.id,
              };

              let store = await associateUserServices.store(req);

              if (store) {
                const { email } = associate;

                await sendgridServices.voucher({ email, voucher });
              }
            }
          }
        });

        return res
          .status(201)
          .json(JParser("Ok! created successfully", true, null));
      } else {
        return res.status(400).json({
          message: "Payment failed",
          success: false,
          data: null,
        });
      }
    }

    let { associates } = req.body;

    // check if any of the email already exist in my database then remote it from list of associates to be billed
    let pricing = await associatePricingServices.all();

    if (pricing && pricing.length > 0) {
      let amount = await calculatePaymentAmount(associates, pricing);
      let customer = await getOrCreateCustomer(req, paymentServices);

      // amount is already multipy by *100 in calculatePaymentAmount
      let finalAmount = amount;

      const tax = await taxServices.findBy({
        country,
      });

      if (tax) {
        const { tax: vat } = tax.dataValues;

        finalAmount = finalAmount + (vat * finalAmount) / 100;
      }

      let data = {
        amount: finalAmount,
        currency: "usd",
        customer: customer.id,
        description: "add associate user payment",
        metadata: {
          associates: JSON.stringify(associates),
          ...userQuery,
        },
      };

      if (req.body.card) {
        data.source = req.body.card.id;
      }

      await chargeCustomer(req, res, next, paymentServices, customer, data);
    } else {
      return res.status(400).json({
        message: "Can't initiate payment, contact admin for support",
        success: false,
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

// stripe funding payment
exports.stripe_funding = useAsync(async (req, res, next) => {
  try {
    const { fundingId, fundingPaymentTypeId, country, currency } = req.body;

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
        .status(409)
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

    const { price } = fundingPlan.dataValues;

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

    // get country tax
    const tax = await taxServices.findBy({
      country,
    });

    let finalAmount = amount * 100;

    if (tax) {
      const { tax: vat } = tax.dataValues;

      finalAmount = finalAmount + (vat * finalAmount) / 100;
    }

    //  get or create customer
    const customer = await paymentServices.getOrCreateCustomer(email, fullname);

    const chargeData = {
      amount: +finalAmount,
      currency,
      customer: customer.id,
      description: "funding payment",
      metadata: { businessId },
    };

    const charge_customer = await paymentServices.chargeStripeCustomer(
      chargeData
    );

    if (!charge_customer.paid) {
      return res.status(400).json(JParser("Payment failed", false, null));
    }

    const createTransaction = await transactionServices.store({
      body: {
        paymentId: charge_customer.id,
        paidFor: "funding",
        paidForId: fundingId,
        method: "stripe",
        amount,
        cost: amount,
        status: true,
        businessId,
      },
    });

    if (createTransaction) {
      // change the job status to open

      const updateFunding = await fundingServices.update(fundingId, {
        body: {
          status: "active",
          businessId,
        },
      });

      if (updateFunding) {
        return res
          .status(201)
          .json(JParser("ok-response", true, createTransaction));
      }
    }
    //
  } catch (error) {
    next(error);
  }
});

// job funding payment
exports.stripe_jobs = useAsync(async (req, res, next) => {
  try {
    const { jobId, jobPaymentTypeId, country, currency } = req.body;

    // get the business id,
    const { id: businessId, email, companyName } = req.business;

    const fullname = companyName;

    const isJob = await jobServices.findOne(jobId);

    let amount;
    // Check if all jobId are valid

    if (!isJob) {
      return res.status(404).json(JParser("job deos not exist", false, null));
    }

    //  check the payment plan

    // check if user have already paid for this jobs

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
    // get if business have paid for this jobs

    const jobPlan = await jobPaymentTypeServices.findOne(jobPaymentTypeId);

    if (!jobPlan) {
      return res
        .status(404)
        .json(JParser("jobs plan does not exist", false, null));
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
      const isCountry = await jobCountryPricingServices.findBy({
        country,
      });

      if (isCountry) {
        const { discount } = isCountry;
        amount = price - (discount * price) / 100;
      } else {
        amount = price;
      }
    }

    // get country tax

    const tax = await taxServices.findBy({
      country,
    });

    let finalAmount = amount * 100;

    if (tax) {
      const { tax: vat } = tax.dataValues;

      finalAmount = finalAmount + (vat * finalAmount) / 100;
    }

    //  get or create customer
    const customer = await paymentServices.getOrCreateCustomer(email, fullname);

    const chargeData = {
      amount: finalAmount,
      currency,
      customer: customer.id,
      description: "jobs payment",
      metadata: { businessId },
    };

    const charge_customer = await paymentServices.chargeStripeCustomer(
      chargeData
    );

    if (!charge_customer.paid) {
      return res.status(400).json(JParser("Payment failed", false, null));
    }

    const createTransaction = await transactionServices.store({
      body: {
        paymentId: charge_customer.id,
        paidFor: "jobs",
        paidForId: jobId,
        method: "stripe",
        amount,
        cost: amount,
        status: true,
        businessId,
      },
    });

    if (createTransaction) {
      // change the job status to open

      const updateJobs = await jobServices.update(jobId, {
        body: {
          status: "opened",
          businessId,
        },
      });

      if (updateJobs) {
        return res
          .status(201)
          .json(JParser("ok-response", true, createTransaction));
      }
    }
    //
  } catch (error) {
    next(error);
  }
});

// invite payments

exports.stripe_invite = useAsync(async (req, res, next) => {
  try {
    const { invites, invitePaymentTypeId, country, currency } = req.body;

    const { id: businessId, email, companyName: fullname } = req.business;

    const isPaymentType = await invitePaymentTypeServices.findOne(
      invitePaymentTypeId
    );

    if (!isPaymentType) {
      return res.status(404).json(JParser("Invalid payment type", false, null));
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

    // get country tax
    const tax = await taxServices.findBy({
      country,
    });

    let finalAmount = amount * 100;

    if (tax) {
      const { tax: vat } = tax.dataValues;

      finalAmount = finalAmount + (vat * finalAmount) / 100;
    }

    //  get or create customer
    const customer = await paymentServices.getOrCreateCustomer(email, fullname);

    const chargeData = {
      amount: finalAmount,
      currency,
      customer: customer.id,
      description: "invite payment",
      metadata: { invites: JSON.stringify(invites) },
    };

    const charge_customer = await paymentServices.chargeStripeCustomer(
      chargeData
    );

    if (!charge_customer.paid) {
      return res.status(400).json(JParser("Payment failed", false, null));
    }

    const results = [];

    for (const invite of invites) {
      const { email, invitedUserType, roleIds, permissionIds } = invite;

      if (
        !(await validateRoles(roleIds)) ||
        !(await validatePermissions(permissionIds))
      ) {
        return res
          .status(404)
          .json(JParser("Invalid role or permission passed", false, null));
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
          ownerType: "business",
          ownersId: req.business.id,
        },
      };

      const creationResult = await inviteService.store(data);

      if (!creationResult) {
        return res
          .status(500)
          .json(JParser("Something went wrong", true, creationResult));
      }

      // store the transaction records for every invite

      const createTransaction = await transactionServices.store({
        body: {
          paymentId: charge_customer.id,
          paidFor: "invites",
          paidForId: creationResult.id,
          method: "stripe",
          amount,
          cost: amount,
          status: true,
          businessId,
        },
      });

      if (createTransaction) {
      }

      const acceptLink = `${process.env.APP_URL}/accept-invite/${token}?email=${invite.email}`;

      // mail the token
      await sendgridServices.inviteUserMail({
        email: invite.email,
        acceptLink,
        companyName: req.business.companyName,
      });

      results.push(creationResult);
    }

    return res.status(201).json(JParser("ok-response", true, results));
  } catch (error) {
    next(error);
  }
});

// business free course payment
exports.stripe_business_free_course_posting = useAsync(
  async (req, res, next) => {
    try {
      const { courseId, coursePaymentTypeId, country, currency } = req.body;

      // get the business id,
      const { id: businessId, email, companyName } = req.business;

      const fullname = companyName;

      const isCourse = await courseServices.findOne(courseId);

      let amount;
      // Check if all courseId are valid

      if (!isCourse) {
        return res.status(404).json(JParser("course not found", false, null));
      }

      //  check the payment plan

      // check if user have already paid for this courses

      const isPaid = await transactionServices.findBy({
        businessId,
        paidForId: courseId,
        paidFor: "free-business-course",
      });

      if (isPaid) {
        return res
          .status(409)
          .json(JParser("you've already paid for this course", true, isPaid));
      }

      const coursePlan = await coursePaymentTypeServices.findOne(
        coursePaymentTypeId
      );

      if (!coursePlan) {
        return res
          .status(404)
          .json(JParser("payment plan not-found", false, null));
      }

      const { price } = coursePlan;

      const isBusinessPlan = await courseBussinessPricingServices.findBy({
        businessId,
      });

      if (isBusinessPlan) {
        const { discount } = isBusinessPlan;
        amount = price - (discount * price) / 100;
        // set the amount
      } else {
        // check the country
        const isCountry = await courseCountryPricingServices.findBy({
          country,
        });

        if (isCountry) {
          const { discount } = isCountry;
          amount = price - (discount * price) / 100;
        } else {
          amount = price;
        }
      }

      // get country tax
      const tax = await taxServices.findBy({
        country,
      });

      let finalAmount = amount * 100;

      if (tax) {
        const { tax: vat } = tax.dataValues;

        finalAmount = finalAmount + (vat * finalAmount) / 100;
      }

      //  get or create customer
      const customer = await paymentServices.getOrCreateCustomer(
        email,
        fullname
      );

      const chargeData = {
        amount: finalAmount,
        currency,
        customer: customer.id,
        description: "free course payment payment",
        metadata: { businessId },
      };

      const charge_customer = await paymentServices.chargeStripeCustomer(
        chargeData
      );

      if (!charge_customer.paid) {
        return res.status(400).json(JParser("Payment failed", false, null));
      }

      const createTransaction = await transactionServices.store({
        body: {
          paymentId: charge_customer.id,
          paidFor: "free-business-course",
          paidForId: courseId,
          method: "stripe",
          amount,
          cost: amount,
          status: true,
          businessId,
        },
      });

      if (createTransaction) {
        // check if pricing already exist
        const isPricing = await pricingServices.getCoursePricingById(courseId);

        if (!isPricing) {
          const data = {
            body: {
              courseId: courseId,
              type: "free",
              currency,
              amount: 0,
              discount: 100,
            },
          };

          // create pricing
          const create = await pricingServices.store(data);

          if (create) {
            // update course status
            await courseServices.update(courseId, {
              body: {
                status: "active",
              },
            });

            return res.status(201).json(JParser("ok-response", true, create));
          }
        } else {
          const data = {
            body: {
              type: "free",
              currency,
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
    } catch (error) {
      next(error);
    }
  }
);
