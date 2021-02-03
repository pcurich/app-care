const router = require("express").Router();

// Controller
const {
  showSettings,
  newSettingForm,
  newSetting,
  updateSettingForm,
  updateSetting,
  deleteSetting
} = require("../controllers/settings.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// Shows
router.get("/settings", isAuthenticated, showSettings);

// Create
router.get("/settings/new", isAuthenticated, newSettingForm);
router.post("/settings/new", isAuthenticated, newSetting);

// Update
router.get("/settings/edit/:id", isAuthenticated, updateSettingForm);
router.put("/settings/edit/:id", isAuthenticated, updateSetting);

// Delete
router.delete("/settings/delete/:id", isAuthenticated, deleteSetting);

module.exports = router;