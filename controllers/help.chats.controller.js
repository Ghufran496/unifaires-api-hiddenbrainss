const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const { calculatePagination } = require("../helpers/paginate.helper");
const helpChatServices = require("../services/help.chats.services");
const helpServices = require("../services/help.services");

exports.get_help_chat = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await helpChatServices.getHelpChats(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        chats: rows,
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

exports.create_user_chat = useAsync(async (req, res, next) => {
  try {
    // add course chat

    const { ticketId } = req.body;

    const find = await helpServices.findBy({ ticketId });

    if (!find) {
      return res.status(404).json(JParser("help does not exist", false, null));
    }

    req.body.helpId = find.id;

    const create = await helpChatServices.store(req);

    return res.status(201).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.create_agent_chat = useAsync(async (req, res, next) => {
  try {
    // check if help exist

    const { helpId } = req.body;

    const isHelp = await helpServices.findOne(helpId);

    // the agent id is the req.user

    req.body.agentId = req.user.id;

    if (!isHelp) {
      return res.status(400).json(JParser("help does not exist", false, null));
    }
    const create = await helpChatServices.store(req);

    return res.status(201).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isChat = await helpChatServices.findOne(id);

    if (!isChat) {
      return res.status(404).json(JParser("invalid chat", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, isChat));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isChat = await helpChatServices.findOne(id);

    if (!isChat) {
      return res.status(404).json(JParser("invalid chat", false, null));
    }

    const update = await helpChatServices.update(id, req);

    if (update) {
      const isChat = await helpChatServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, isChat));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isChat = await helpChatServices.findOne(id);

    if (!isChat) {
      return res.status(404).json(JParser("invalid chat", false, null));
    }

    const destroy = await helpChatServices.destroy(id, req);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

// get tickets chats
exports.get_ticket_chat = useAsync(async (req, res, next) => {
  try {
    let { limit, offset, page } = calculatePagination(req);

    const { ticketId } = req.params;

    // validate the ticketId
    const isTicket = await helpServices.findBy({
      ticketId,
    });

    if (!isTicket) {
      return res.status(404).json(JParser("invalid tickets", false, null));
    }

    limit = 1000;

    let { count, rows } = await helpChatServices.getTicketsChats(
      req,
      isTicket.id,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        chats: rows,
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
