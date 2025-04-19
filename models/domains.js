const mongoose = require("mongoose");

const domainsSchema = new mongoose.Schema({
  domainName: { type: String, required: true, unique: true }, // Name of the domain
  documents: [{ type: String }], // Array of document strings
});

const Domain = mongoose.model("Domain", domainsSchema);
module.exports = Domain;