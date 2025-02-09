const eventServices = require("../services/event.services");
const { getTokenObject } = require("../helpers/token");
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

exports.index = useAsync(async (req, res, next) => {
  try {
    const events = await eventServices.getAllEvent();

    if (events) {
      return res
        .status(200)
        .json(JParser("event fetch successfully", true, events));
    } else {
      return res.status(400).json(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { userId } = await getTokenObject(req);

    req.body.userId = userId;

    const createEvent = await eventServices.storeEvent(req);

    if (createEvent) {
      const event = await eventServices.getEventById(createEvent.id);
      return res.status(201).json("event created successfully", true, event);
    } else {
      return res.status(400).json(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    // check if the event exist
    const { id } = req.params;

    const event = await eventServices.getEventById(id);

    if (event) {
      return res
        .status(200)
        .json(JParser("event fetch successfully", true, event));
    } else {
      return res.status(400).json(JParser("invalid event", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    // check if id exist
    const { id } = req.params;

    const isEvent = await eventServices.getEventById(id);

    if (isEvent) {
      if (isEvent.userId === req.user.id) {
        const updateEvent = await eventServices.updateEvent(id, req);

        if (updateEvent) {
          const event = await eventServices.getEventById(id);
          return res
            .status(200)
            .json(JParser("event updated successfully", true, event));
        } else {
          return res.status(400).json(JParser("something went wrong"));
        }
      } else {
        return res.status(403).json(JParser("unauthorized"));
      }
    } else {
      return res.status(400).json(JParser("event does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isEvent = await eventServices.getEventById(id);

    if (isEvent) {
      // check delete ownership
      if (isEvent.userId === req.user.id) {
        const deleteEvent = await eventServices.deleteEvent(id);

        if (deleteEvent) {
          return res
            .status(204)
            .json(JParser("event deleted successfully ", true, null));
        }
      } else {
        return res.status(403).json(JParser("unauthorized", false, null));
      }
    } else {
      return res.status(400).json(JParser("event not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
