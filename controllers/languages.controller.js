// services
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const languageServices = require("../services/language.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const languages = await languageServices.getAllLanguages();

    if (languages) {
      return res
        .status(200)
        .json(JParser("languages fetch successfully", true, languages));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if language exist
    const language = req.body.language.toLowerCase().trim();

    const languageExist = await languageServices.getLanguageByName(language);

    if (languageExist) {
      return res
        .status(400)
        .json(JParser("languages already exist", false, null));
    } else {
      // store the lange
      const createLanguage = await languageServices.storeLanguages(req);

      if (createLanguage) {
        // get and return the store language
        const language = await languageServices.getLanguageById(
          createLanguage.id
        );

        return res
          .status(201)
          .json(JParser("language fetch successfully", true, language));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", true, null));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const id = req.params.id;
    const languages = await languageServices.getLanguageById(id);

    if (languages) {
      return res
        .status(200)
        .json(JParser("language fetch successfully", true, languages));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    // check if languages exist
    const id = req.params.id;
    const isLanguage = languageServices.getLanguageById(id);

    if (isLanguage) {
      const updateLanguages = await languageServices.updateLanguages(id, req);

      if (updateLanguages) {
        // get the language and return it

        const language = languageServices.getLanguageById(id);

        return res
          .status(200)
          .json(JParser("language update successfully", true, language));
      }
    } else {
      return res
        .status(400)
        .json(JParser("languages does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const id = req.params.id;

    const languages = await languageServices.deleteLanguages(id);

    if (languages) {
      return res
        .status(204)
        .json(JParser("language deleted successfully", true, null));
    } else {
      return res.status(400).json(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});
