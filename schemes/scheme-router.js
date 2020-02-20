const express = require("express");

const Schemes = require("./scheme-model.js");

const router = express.Router();

// This GET retrieves all schemes
// Schemes.find()
router.get("/", (req, res) => {
  Schemes.find()
    .then(schemes => {
      res.json(schemes);
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get schemes" });
    });
});

// This GET retrieves a specified scheme
// Schemes.findById(id)
router.get("/:id", validateSchemeId, (req, res) => {
  const { id } = req.params;

  Schemes.findById(id)
    .then(scheme => {
      if (scheme) {
        res.json(scheme);
      } else {
        res
          .status(404)
          .json({ message: "Could not find scheme with given id." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get schemes" });
    });
});

// This GET retrieves the steps for a specified scheme
// Schemes.findSteps(id)
router.get("/:id/steps", validateSchemeId, (req, res) => {
  const { id } = req.params;

  Schemes.findSteps(id)
    .then(steps => {
      if (steps.length) {
        res.json(steps);
      } else {
        res
          .status(404)
          .json({ message: "Could not find steps for given scheme" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get steps" });
    });
});

// This POST creates a new scheme
// Schemes.add(req.body)
router.post("/", (req, res) => {
  const schemeData = req.body;

  Schemes.add(schemeData)
    .then(ids => {
      return Schemes.findById(ids[0]).then(inserted => {
        res.status(201).json(inserted);
      });
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to create new scheme" });
    });
});

// This POST adds a step for a specified scheme
// Schemes.addStep(req.body, req.params.id)
router.post("/:id/steps", validateSchemeId, (req, res) => {
  const stepData = req.body;
  const { id } = req.params;

  Schemes.findById(id)
    .then(scheme => {
      if (scheme) {
        Schemes.addStep(stepData, id).then(step => {
          res.status(201).json(step);
        });
      } else {
        res
          .status(404)
          .json({ message: "Could not find scheme with given id." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to create new step" });
    });
});

// This PUT updates a specified scheme
// Schemes.findById(id)
router.put("/:id", validateSchemeId, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Schemes.findById(id)
    .then(scheme => {
      if (scheme) {
        Schemes.update(changes, id).then(scheme => {
          return Schemes.findById(id).then(inserted => {
            res.status(201).json(inserted);
          });
        });
      } else {
        res
          .status(404)
          .json({ message: "Could not find scheme with given id" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to update scheme" });
    });
});

// This DELETE nukes a specified scheme
// Schemes.remove(id)
router.delete("/:id", validateSchemeId, (req, res) => {
  const { id } = req.params;

  Schemes.remove(id)
    .then(deleted => {
      if (deleted) {
        res.json({ removed: deleted });
      } else {
        res
          .status(404)
          .json({ message: "Could not find scheme with given id" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to delete scheme" });
    });
});

module.exports = router;

// This middlware validates the schemeID and stores the object associated with the ID in req.scheme
function validateSchemeId(req, res, next) {
  const { id } = req.params;
  console.log("This is id in validateSchemeId(): ", id);
  Schemes.findById(id)
    .then(schemeFound => {
      console.log("This is schemeFound in validateSchemeId(): ", schemeFound);
      if (schemeFound && schemeFound !== undefined) {
        req.scheme = schemeFound;
        console.log("This is req.scheme in validateSchemeId(): ", req.scheme);
        next();
      } else {
        res.status(400).json(null);
      }
    })
    .catch(error => {
      console.log("This is error in validateSchemeId(): ", error);
      res.status(500).json({ error: "Error validating scheme ID" });
    });
}
