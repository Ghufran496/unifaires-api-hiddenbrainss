const bcrypt = require("bcryptjs");

const {
  User,
  Role,
  Education,
  ProfessionalCertificate,
  Social,
  WorkExperience,
  UserLicense,
  Contact,
  UserLanguage,
} = require("../models");
const { Op } = require("sequelize");

function generateFilterValue(query) {
  let filterValue = {
    [Op.or]: [],
  };

  for (let key in query) {
    if (key !== "offset" && key !== "limit") {
      if (User.getAttributes()[key] !== undefined) {
        if (Array.isArray(query[key])) {
          // If the query parameter is an array, use Op.or to filter for any of the values
          filterValue[Op.or].push({
            [key]: {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%{value}%`,
              })),
            },
          });
        } else {
          // If the query parameter is a single value, filter normally
          filterValue[Op.or].push({
            [key]: {
              [Op.like]: `%${query[key]}%`,
            },
          });
        }
      }
    }
  }

  // Add the logic to combine firstname and lastname filters
  let nameFilters = [];
  if (query.firstname) {
    nameFilters.push({
      firstname: {
        [Op.like]: `%${query.firstname}%`,
      },
    });
  }
  if (query.lastname) {
    nameFilters.push({
      lastname: {
        [Op.like]: `%${query.lastname}%`,
      },
    });
  }
  if (nameFilters.length > 0) {
    filterValue[Op.or].push(...nameFilters);
  }

  // If the Op.or array is empty, remove it to avoid unnecessary filtering
  if (filterValue[Op.or].length === 0) {
    delete filterValue[Op.or];
  }

  return filterValue;
}

const getUserIncludes = () => [
  {
    model: Contact,
    as: "userContacts",
  },
  {
    model: Education,
  },
  {
    model: ProfessionalCertificate,
  },
  {
    model: Social,
    as: "userSocials",
  },
  {
    model: WorkExperience,
  },
  {
    model: UserLicense,
  },
  {
    model: UserLanguage,
  },
];

class UsersServices {
  async getAllUser(data, options = {}) {
    return await User.findAndCountAll({ ...data, ...options, distinct: true });
  }

  async getUserById(id, options = {}) {
    return User.findOne({
      where: { id },
      include: getUserIncludes(),
      ...options,
    });
  }

  async findOne(id, options = {}) {
    return User.findOne({
      where: { id },
      include: getUserIncludes(),
      ...options,
    });
  }

  async findOneByEmail(email, options = {}) {
    return User.findOne({
      where: { email },
      include: getUserIncludes(),
      ...options,
    });
  }

  async findBy(by, options = {}) {
    return User.scope("withPassword").findOne({
      where: by,
      include: getUserIncludes(),
      ...options,
    });
  }

  // this login find by is in use, dont delete it
  async loginFindBy(by, options = {}) {
    return User.scope("withPassword").findOne({
      where: by,

      ...options,
    });
  }

  async findAllBy(by, options = {}) {
    return User.findAll({
      where: by,
      include: getUserIncludes(),
      ...options,
    });
  }

  async findAllByAdmin(req, by, offset, limit) {
    // add filter here
    let filterValue = generateFilterValue(req.query);

    return User.findAndCountAll({
      where: { ...by, ...filterValue },
      limit,
      offset,
      distinct: true,
    });
  }

  async getUserByEmail(email, options = {}) {
    return User.findOne({
      where: { email },
      include: getUserIncludes(),
      ...options,
    });
  }

  async createUser(req) {
    let {
      firstname,
      lastname,
      othername,
      email,
      password,
      imageUrl,
      permissionId,
      gender,
      dateOfBirth,
      roleId,
    } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = {
      firstname,
      lastname,
      othername,
      email,
      password: hashPassword,
      imageUrl,
      permissionId,
      gender,
      dateOfBirth,
      roleId,
    };

    let result = await User.create(user);

    if (result) {
      const {
        id,
        firstname,
        lastname,
        othername,
        email,
        imageUrl,
        updatedAt,
        createdAt,
      } = result;

      return {
        id,
        firstname,
        lastname,
        othername,
        email,
        imageUrl,
        updatedAt,
        createdAt,
      };
    }
  }

  async verifyEmail(email, options = {}) {
    return await User.findOne({
      where: { email },
      include: getUserIncludes(),
      ...options,
    });
  }

  async getUserRoleAndPermissions(userId) {
    return await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Role,
          required: true,
        },
      ],
    });
  }

  async updateUser(id, req, options = {}) {
    return await User.update(req.body, { where: { id }, ...options });
  }

  async update(id, req, options = {}) {
    return await User.update(req.body, { where: { id }, ...options });
  }

  async deleteUser(id, options = {}) {
    return await User.destroy({ where: { id }, ...options });
  }

  async getUserByIdWithPassword(id, options = {}) {
    return await User.scope("withPassword").findOne({
      where: { id },
      ...options,
    });
  }

  async getUserByEmailWithPassword(email, options = {}) {
    return await User.scope("withPassword").findOne({
      where: { email },
      ...options,
    });
  }

  async getUserByRole(id, options = {}) {
    return await User.findOne({
      where: { id },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "othername",
        "email",
        "status",
        "imageUrl",
      ],
      include: Role,
      ...options,
    });
  }

  async getRolesUser(id, options = {}) {
    return await Role.findAll({
      where: { id },
      include: {
        model: User,
        attributes: [
          "id",
          "firstname",
          "lastname",
          "othername",
          "email",
          "status",
          "imageUrl",
        ],
      },
      ...options,
    });
  }

  async findOrCreate(email, value, options = {}) {
    return await User.findOrCreate({
      where: { email },
      defaults: value,
      ...options,
    });
  }
  async updateUserBalance(id, balance, options = {}) {
    return await User.update({ balance }, { where: { id }, ...options });
  }

  async updateUserBalanceByEmail(email, balance, options = {}) {
    return await User.update({ balance }, { where: { email }, ...options });
  }

  async getUserBalanceByEmail(email, options = {}) {
    const user = await User.findOne({
      where: { email },
      attributes: ["balance"],
      ...options,
    });
    return user ? user.balance : null;
  }
  async getUserBalanceById(id, options = {}) {
    const user = await User.findOne({
      where: { id },
      attributes: ["balance"],
      ...options,
    });
    return user ? user.balance : null;
  }
}

module.exports = new UsersServices();
