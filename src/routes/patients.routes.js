const router = require("express").Router();

// Controller
const {
  showPatients,
  newPatientForm,
  newPatient,
  updatePatientForm,
  updatePatient,
  deletePatient
} = require("../controllers/patients.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// Shows
router.get("/patients/:userId", isAuthenticated, showPatients);

// Create
router.get("/patients/new/:userId", isAuthenticated, newPatientForm);
router.post("/patients/new/:userId", isAuthenticated, newPatient);

 // Update
router.get("/patients/edit/:id", isAuthenticated, updatePatientForm);
router.put("/patients/edit/:id", isAuthenticated, updatePatient);

// Delete
router.delete("/patients/delete/:id", isAuthenticated, deletePatient);

module.exports = router;