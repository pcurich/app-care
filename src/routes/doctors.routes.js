const router = require("express").Router();

// Controller
const {
  showDoctors,
  newDoctorForm,
  newDoctor,
  updateDoctorForm,
  updateDoctor,
  deleteDoctor
} = require("../controllers/doctors.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// Shows
router.get("/doctors", isAuthenticated, showDoctors);

// Create
router.get("/doctors/new", isAuthenticated, newDoctorForm);
router.post("/doctors/new", isAuthenticated, newDoctor);

 // Update
router.get("/doctors/edit/:id", isAuthenticated, updateDoctorForm);
router.put("/doctors/edit/:id", isAuthenticated, updateDoctor);

// Delete
router.delete("/doctors/delete/:id", isAuthenticated, deleteDoctor);

module.exports = router;