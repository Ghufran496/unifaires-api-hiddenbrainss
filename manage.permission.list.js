const manage = {
  permissions: [
    {
      title: "create_course",
      description: "Allows creating a new course.",
    },
    { title: "read_course", description: "Allows reading course details." },
    {
      title: "update_course",
      description: "Allows updating existing courses.",
    },
    { title: "delete_course", description: "Allows deleting a course." },

    {
      title: "create_job",
      description: "Allows creating a new job posting.",
    },
    {
      title: "read_job",
      description: "Allows reading job posting details.",
    },
    { title: "update_job", description: "Allows updating job postings." },
    { title: "delete_job", description: "Allows deleting a job posting." },
    {
      title: "read_job_user_applicant",
      description: "read job applicants",
    },
    {
      title: "read_job_business_applicant",
      description: "read job applicants",
    },
    {
      title: "read_job_user",
      description: "read job applicants",
    },

    {
      title: "create_funding",
      description: "Allows creating new funding opportunities.",
    },
    {
      title: "read_funding",
      description: "Allows reading details of funding opportunities.",
    },
    {
      title: "update_funding",
      description: "Allows updating funding opportunities.",
    },
    {
      title: "delete_funding",
      description: "Allows deleting funding opportunities.",
    },
    {
      title: "read_funding_applicant",
      description: "Allows deleting funding opportunities.",
    },
    {
      title: "read_funding_user",
      description: "Allows deleting funding opportunities.",
    },

    { title: "create_user", description: "Allows creating a new user." },
    { title: "read_user", description: "Allows reading user details." },
    {
      title: "update_user",
      description: "Allows updating user information.",
    },
    { title: "delete_user", description: "Allows deleting a user." },

    {
      title: "view_analytics",
      description: "Allows viewing analytics data.",
    },

    {
      title: "create_transaction",
      description: "Allows creating a new transaction.",
    },
    {
      title: "read_transaction",
      description: "Allows reading transaction details.",
    },
    {
      title: "update_transaction",
      description: "Allows updating transactions.",
    },
    {
      title: "delete_transaction",
      description: "Allows deleting a transaction.",
    },

    {
      title: "create_associate",
      description: "Allows creating a new associate.",
    },
    {
      title: "read_associate",
      description: "Allows reading associate details.",
    },
    {
      title: "update_associate",
      description: "Allows updating associate details.",
    },
    {
      title: "delete_associate",
      description: "Allows deleting an associate.",
    },

    {
      title: "create_invite",
      description: "Allows creating an invitation.",
    },
    {
      title: "read_invite",
      description: "Allows reading invitation details.",
    },
    {
      title: "delete_invite",
      description: "Allows deleting an invitation.",
    },
  ],
  roles: [
    {
      title: "Admin",
      description: "Full access to all system functions.",
      permissions: [
        "create_course",
        "read_course",
        "update_course",
        "delete_course",
        "create_job",
        "read_job",
        "update_job",
        "delete_job",
        "create_funding",
        "read_funding",
        "update_funding",
        "delete_funding",
        "create_user",
        "read_user",
        "update_user",
        "delete_user",
        "view_analytics",
        "create_transaction",
        "read_transaction",
        "update_transaction",
        "delete_transaction",
        "create_associate",
        "read_associate",
        "update_associate",
        "delete_associate",
        "create_invite",
        "read_invite",
        "delete_invite",
      ],
    },
    {
      title: "Editor",
      description:
        "Can edit and update information except user and transaction data.",
      permissions: [
        "create_course",
        "read_course",
        "update_course",
        "create_job",
        "read_job",
        "update_job",
        "create_funding",
        "read_funding",
        "update_funding",
        "view_analytics",
        "create_associate",
        "read_associate",
        "update_associate",
      ],
    },
    {
      title: "Viewer",
      description: "Can only view details, no modifications allowed.",
      permissions: [
        "read_course",
        "read_job",
        "read_funding",
        "read_user",
        "view_analytics",
        "read_transaction",
        "read_associate",
        "read_invite",
      ],
    },
  ],
};

module.exports = {
  permissions: manage.permissions,
  roles: manage.roles,
};
