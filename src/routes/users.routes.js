const router = require("express").Router();

const {
  showUsers,
  newUserForm,
  newUser,
  updateUserForm,
  updateUser,
  deleteUser,
  signUpForm,
  singUp,
  signInForm,
  signin,
  logout
} = require("../controllers/users.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");

// Routes
router.get("/users" , isAuthenticated, showUsers)

//Create
router.get("/users/new", isAuthenticated,  newUserForm);
router.post("/users/new", isAuthenticated,  newUser);

//Edit
router.get("/users/edit/:id", isAuthenticated,  updateUserForm);
router.put("/users/edit/:id", isAuthenticated,  updateUser);

// Delete
router.delete("/users/delete/:id", isAuthenticated, deleteUser);

router.get("/users/signup", signUpForm);
router.post("/users/signup", singUp);

router.get("/users/signin", signInForm);
router.post("/users/signin", signin);

router.get("/users/logout", logout);

module.exports = router;