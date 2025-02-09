const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const resourceService = require("../../services/course/section.resources.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const resource = await resourceService.getAllSectionResource();

    if (resource) {
      return res.status(200).json(JParser("resources fetch", true, resource));
    } else {
      return res
        .status(200)
        .json(
          JParser(
            "no resources available on the system at the moment",
            false,
            null
          )
        );
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const addResource = await resourceService.storeSectionResource(req);

    if (addResource) {
      return res
        .status(201)
        .json(
          JParser("section resources added successfully", true, addResource)
        );
    } else {
      return res.status(400).json(JParser("something went wrong"));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isResource = await resourceService.getAllSectionResourceById(id);

    if (isResource) {
      const updateResource = await resourceService.updateSectionResource(
        id,
        req
      );

      if (updateResource) {
        const resource = await resourceService.getAllSectionResourceById(id);

        return res
          .status(200)
          .json(JParser("resources updated successfully", true, resource));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", false, null));
      }
    } else {
      return res.status(404).json(JParser("resources not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteResource = await resourceService.deleteSectionResource(id);

    if (deleteResource) {
      return res.status(204).json(JParser("deleted", true, null));
    } else {
      return res.status(404).json(JParser("invalid id"));
    }
  } catch (error) {
    next(error);
  }
});
