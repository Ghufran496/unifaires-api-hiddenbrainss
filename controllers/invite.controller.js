const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

const inviteService = require("../services/invite.services");
const userServices = require("../services/users.services");
const businessServices = require("../services/business.services");
const crypto = require("crypto");

const { calculatePagination } = require("../helpers/paginate.helper");

const {
  setOwnerInfo,
  handleExistingEntity,
  handleNewEntity,
  validatePermissions,
  validateRoles,
} = require("../helpers/invite.helper");

const ndigit = require("n-digit-token");
const sendgridServices = require("../services/sendgrid.services");

const { User } = require("../models");

exports.index = useAsync(async (req, res, next) => {
  try {
    // invites
    const invites = await inviteService.all();

    return res.status(200).json(JParser("ok-response", true, invites));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const results = [];

    const { invites } = req.body;

    for (const invite of invites) {
      const { email, invitedUserType, roleIds, permissionIds } = invite;

      if (roleIds && !(await validateRoles(roleIds))) {
        return res
          .status(404)
          .json(JParser("Invalid role passed", false, null));
      }

      if (permissionIds && !(await validatePermissions(permissionIds))) {
        return res
          .status(404)
          .json(JParser("Invalid permission passed", false, null));
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

      if (entityData?.response) {
        return res
          .status(entityData?.status)
          .json(JParser(entityData?.response, true, null));
      }

      invite[`${invitedUserType}Id`] = entityData.id;

      const token = crypto.randomBytes(30).toString("hex");

      invite.token = token;

      setOwnerInfo(req, invite);

      const data = {
        body: {
          ...invite,
          ownerType: "user",
          ownersId: req.user.id,
        },
      };

      const creationResult = await inviteService.store(data);

      if (!creationResult) {
        return res
          .status(500)
          .json(JParser("Something went wrong", true, creationResult));
      }

      // store the transaction records for every invite

      const acceptLink = `${process.env.FRONT_APP_URL}/accept-invite/${token}?email=${invite.email}`;

      // mail the token
      await sendgridServices.inviteUserMail({
        email: invite.email,
        acceptLink,
        companyName: req.user.firstname + req.user.lastname,
      });

      results.push(creationResult);
    }

    return res.status(201).json(JParser("ok-response", true, results));
  } catch (error) {
    console.error(error);
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const invite = await inviteService.findOne(id);

    if (!invite) {
      return res.status(404).json(JParser("invite not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, invite));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check if invites exist

    const invite = await inviteService.findOne(id);

    if (invite) {
      const update = await inviteService.update(id, req);

      if (update) {
        const invite = await inviteService.findOne(id);

        return res.status(200).json(JParser("ok-response", true, invite));
      }
    } else {
      return res.status(404).json(JParser("invite not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const invite = await inviteService.findOne(id);

    if (!invite) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await inviteService.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

// accept invite
exports.accept_invite = useAsync(async (req, res, next) => {
  try {
    const { email, token } = req.body;
    const user = await User.scope("withPassword").findOne({
      where: { email: email },
    });
    const isUserExist =
      typeof user?.password === "string" &&
      user.password.toLowerCase().trim() !== "default" &&
      user?.isEmailVerify;
    const isToken = await inviteService.findBy({ token });
    if (!isToken) {
      return res
        .status(400)
        .json(JParser("invalid token supply", false, { isUserExist }));
    } else if (isToken?.status === "accepted") {
      return res
        .status(409)
        .json(JParser("invite already accepted", false, { isUserExist }));
    }

    if (isToken?.userId) {
      const user1 = await userServices.findOne(isToken?.userId);

      if (
        typeof email === "string" &&
        typeof user1?.email === "string" &&
        user1.email.toLowerCase().trim() !== email.toLocaleLowerCase().trim()
      ) {
        return res
          .status(400)
          .json(JParser("invalid user details", false, { isUserExist }));
      }
    }

    if (isToken.businessId) {
      const business = await businessServices.findOne(isToken?.businessId);

      if (
        typeof business?.email === "string" &&
        typeof email === "string" &&
        business.email.toLowerCase().trim() !== email.toLowerCase().trim()
      ) {
        return res
          .status(400)
          .json(JParser("invalid business details", false, { isUserExist }));
      }
    }

    // change the status to accepted
    const update = await inviteService.update(isToken?.id, {
      body: {
        status: "accepted",
      },
    });

    if (!user?.isEmailVerify) {
      await userServices.update(isToken?.userId, {
        body: {
          isEmailVerify: 1,
        },
      });
    }

    if (update) {
      return res
        .status(200)
        .json(JParser("invite accepted", true, { isUserExist }));
    }
  } catch (error) {
    next(error);
  }
});

// reject invite
exports.reject_invite = useAsync(async (req, res, next) => {
  try {
    const { email, token } = req.body;

    // get the token

    const isToken = await inviteService.findBy({ token });

    if (!isToken) {
      return res.status(400).json(JParser("invalid token supply", false, null));
    }

    if (isToken.status === "declined") {
      return res
        .status(409)
        .json(JParser("invite already rejected", false, null));
    }

    if (isToken.userId) {
      const user = await userServices.findOne(isToken.userId);

      if (user.email !== email) {
        return res
          .status(400)
          .json(JParser("invalid user details", true, null));
      }
    }

    if (isToken.businessId) {
      const business = await businessServices.findOne(isToken.businessId);

      if (business.email !== email) {
        return res
          .status(400)
          .json(JParser("invalid business details", true, null));
      }
    }

    // change the status to accepted
    const update = await inviteService.update(isToken.id, {
      body: {
        status: "declined",
      },
    });

    //  verify the user or business

    if (update) {
      return res.status(200).json(JParser("invite rejected", true, []));
    }
  } catch (error) {
    next(error);
  }
});

exports.my_invites_business = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    const { id } = req.business;

    let { count, rows } = await inviteService.findUserInvites(
      req,
      {
        ownersId: id,
        ownerType: "business",
      },
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        invites: rows,
        currentPage: page,
        limit,
        totalItem: count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.my_invites_user = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);
    const { id } = req.user;

    const { count, rows } = await inviteService.findUserInvites(
      req,
      {
        ownersId: id,
        ownerType: "user",
      },
      offset,
      limit
    );

    if (rows) {
      return res.status(200).json({
        status: true,
        message: "Invites retrieved successfully",
        data: {
          invites: rows,
          currentPage: page,
          limit,
          totalItem: count,
          pages: Math.ceil(count / limit),
        },
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No invites found",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error in my_invites_user:", error);
    next(error);
  }
});

exports.my_access_business = useAsync(async (req, res, next) => {
  try {
    const { id } = req.business;

    const all = await inviteService.findAllBy({
      businessId: id,
      invitedUserType: "business",
    });

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});
exports.my_access_user = useAsync(async (req, res, next) => {
  try {
    const { id } = req.user;

    const all = await inviteService.findAllBy({
      userId: id,
      invitedUserType: "user",
    });

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});
