const roles = require("./roles.json");
const roleServices = require("../services/role.service");

async function uploadRoles(roles) {
  for (const role of roles) {
    try {
      const roleData = await roleServices.findBy({ name: role.name });
      if (!roleData) {
        const newRole = await roleServices.store({ body: role });
        if (newRole) {
          console.log(`Role '${role.name}' created successfully.`);
        } else {
          console.error(`Failed to create role '${role.name}'.`);
        }
      } else {
        console.log(`Role '${role.name}' already exists.`);
      }
    } catch (error) {
      console.error(`Error processing role '${role.name}':`, error);
    }
  }
}

uploadRoles(roles).catch(console.error);
