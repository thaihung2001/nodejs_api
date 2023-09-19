const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createUser,
  login,
  getUserByUserId,
  getUserByUserEmail,
  getUsers,
  updateUsers,
  deleteUser
} = require("./user.controller");

router.get("/",checkToken , getUsers); // get data
router.post("/",checkToken , createUser);  // created
router.get("/:id",checkToken , getUserByUserId);  // get data id
router.post("/login", login); // authentication
router.patch("/",checkToken , updateUsers); //updated
router.delete("/:id",checkToken , deleteUser);  // deleted

module.exports = router;
