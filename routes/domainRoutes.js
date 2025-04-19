const express = require("express");
const router = express.Router();
const Domain = require("../models/domains"); // Update with the correct path to your model

// Route to add a domain and a document
router.post("/add", async (req, res) => {
  const { domainName, document } = req.body;

  if (!domainName || !document) {
    return res.status(400).json({ message: "Domain name and document are required." });
  }

  try {
    // Check if the domain already exists
    let domain = await Domain.findOne({ domainName });

    if (domain) {
      // If the domain exists, add the document to its array
      domain.documents.push(document);
    } else {
      // If the domain doesn't exist, create a new one
      domain = new Domain({
        domainName,
        documents: [document],
      });
    }

    // Save the updated or new domain
    await domain.save();
    res.status(200).json({ message: "Document added successfully!", domain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/search", async (req, res) => {
  console.log("Request Body:", req.body); // Log the incoming request body
  const { domainName } = req.body;

  if (!domainName) {
    return res.status(400).json({ message: "Domain name is required." });
  }

  try {
    // Use a case-insensitive regex to search for similar domain names
    const domain = await Domain.findOne({
      domainName: { $regex: domainName, $options: "i" },
    });

    if (domain) {
      // Return the documents for the matched domain
      res.status(200).json({ domainName: domain.domainName, documents: domain.documents });
    } else {
      res.status(404).json({ message: "Domain not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/all", async (req, res) => {
  try {
    // Fetch all domains from the database
    const domains = await Domain.find();

    if (domains.length === 0) {
      return res.status(404).json({ message: "No domains found." });
    }

    res.status(200).json({ domains });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;