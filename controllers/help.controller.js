const helpServices = require("../services/help.services");
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const helpChatsServices = require("../services/help.chats.services");

const sendgridServices = require("../services/sendgrid.services");

const { calculatePagination } = require("../helpers/paginate.helper");

exports.index = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await helpServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        help: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    let email;
    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    } else {
      email = req.body.email;
    }

    const create = await helpServices.store(req);

    if (create) {
      // Initialize the help chat with the default message
      const { description, id } = create.dataValues;

      // Create the initial help chat message
      const helpChatPayload = {
        ...req.body,
        helpId: id,
        message: description,
        type: "text",
      };
      const createHelpChat = await helpChatsServices.store({
        body: helpChatPayload,
      });

      if (createHelpChat) {
        // Send mail with the support id

        // Check if a file is present in the request body
        if (req.body.file) {
          // Add another message of type "file" to this chat
          const fileChatPayload = {
            ...req.body,
            helpId: id,
            message: req.body.file,
            type: "file",
          };
          await helpChatsServices.store({
            body: fileChatPayload,
          });
        }

        const { ticketId } = create;
        const supportLink = `${process.env.APP_URL}/tickets/${ticketId}`;

        // Check if email is sent; use the provided email or retrieve it from user or business context
        await sendgridServices.helpAndSupport({
          email,
          supportLink,
        });

        return res.status(201).json(JParser("ok-response", true, create));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isHelp = await helpServices.findOne(id);

    if (!isHelp) {
      return res.status(404).json(JParser("help doesn't exist", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, isHelp));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isHelp = await helpServices.findOne(id);

    if (!isHelp) {
      return res.status(404).json(JParser("help does not exist", false, null));
    }

    const update = await helpServices.update(id, req);

    if (update) {
      const help = await helpServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, help));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isHelp = await helpServices.findOne(id);

    if (!isHelp) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await helpServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_help_by_status = useAsync(async (req, res, next) => {
  try {
    let { status } = req.query;

    if (status === undefined) {
      status = null;
    }

    const helps = await helpServices.getAllHelpByStatus(status);

    if (!helps) {
      return res
        .status(404)
        .json(JParser("helps with passed status not found"));
    }

    return res.status(200).json(JParser("ok-response", true, helps));
  } catch (error) {
    next(error);
  }
});

/*get submitted helps*/
exports.users_helps = useAsync(async (req, res, next) => {
  try {
    let { email } = req.params;
    let query = { email };

    if (req.user) {
      query.userId = req.user.id;
    } else if (req.business) {
      query.businessId = req.business.id;
    }

    const helps = await helpServices.findAllUserHelp(req, query);

    // Respond directly within the controller method
    return res.status(200).json(JParser("ok-response", true, helps));
  } catch (error) {
    next(error);
  }
});
