const helptrackServices = require("../services/help.track.services");
const helpServices = require("../services/help.services");
const { response } = require("express");
const { JParser } = require("../core/core.utils");
const { useAsync } = require("../core");

exports.index = async (req, res, next) => {
  try {
    const helpTracks = await helptrackServices.all();

    return res.status(200).send(
      JParser("ok-response", true, {
        data: helpTracks,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    // validate the helptrack availability
    const { helpId } = req.body;
    const isHelp = await helpServices.findOne(helpId);

    const { id: assignById } = req.user;

    req.body.assignById = assignById;

    if (!isHelp) {
      return res.status(404).json(JParser("not found", false, null));
    }

    // send the record on the system
    const helptrack = await helptrackServices.store(req);

    if (helptrack) {
      // update help status

      await helpServices.update(helpId, {
        body: {
          status: req.body.status,
        },
      });

      return res.status(201).json(JParser("ok-response", true, helptrack));
    }
  } catch (error) {
    next(error);
  }
};

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isHelp = await helptrackServices.findOne(id);

    if (!isHelp) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, isHelp));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isHelp = await helptrackServices.findOne(id);

    if (!isHelp) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await helptrackServices.update(id, req);

    if (update) {
      const help = await helptrackServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, help));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isHelp = await helptrackServices.findOne(id);

    if (!isHelp) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await helptrackServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.change_helptracks_status = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isHelp = await helpServices.findOne(id);

    if (!isHelp) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const isTracked = await helptrackServices.getHelpTrackByHelpId(id);

    if (!isTracked) {
      return res.status(404).json(JParser("help not track", true, null));
    }

    const change = await helpServices.update(isHelp.id, {
      status: req.body.status,
    });

    if (change) {
      const help = await helpServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, help));
    }
  } catch (error) {
    next(error);
  }
});
