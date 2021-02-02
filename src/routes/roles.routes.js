const router = require("express").Router();

// Controller
const {
  showRols,
  newRolForm,
  newRol,
  updateRolForm,
  updateRol,
  deleteRol
} = require("../controllers/roles.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// Shows
router.get("/roles", isAuthenticated, showRols);

// Create
router.get("/roles/new", isAuthenticated, newRolForm);
router.post("/roles/new", isAuthenticated, newRol);

// Update
router.get("/roles/edit/:id", isAuthenticated, updateRolForm);
router.put("/roles/edit/:id", isAuthenticated, updateRol);

// Delete
router.delete("/roles/delete/:id", isAuthenticated, deleteRol);

module.exports = router;