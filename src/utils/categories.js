exports.allowedCategories = ["oauth", "oidc", "email", "adapter", "others"];

/**
 * 
 * @param {*} category 
 * @returns "OAuth", "OIDC", "Email", "Adapter", or "Others"
 */
exports.isValidCategory = (category) => {
  if (category === "oauth") {
    return "OAuth";
  } else if (category === "oidc") {
    return "OIDC";
  } else if (category === "email") {
    return "Email";
  } else if (category === "adapter") {
    return "Adapter";
  } else if (category === "others") {
    return "Others";
  }
};
