const {
  create,
  getUserByUserEmail,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser
} = require("./user.service");
//const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const bcrypt = require("bcrypt");

const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {

    const body = req.body;
   
     const salt = bcrypt.genSaltSync(10);
    if (body.password && salt) {
      body.password = bcrypt.hashSync(body.password, salt);
    }
   //console.log(body); return
    create(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror"
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      });
    });
  },
  login: (req, res) => {
    const body = req.body;
   
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
      const result = bcrypt.compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, process.env.JWT, {
          expiresIn: "1h"
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
    });
  },
  getUserByUserId: (req, res) => {
    const id = req.params.id;
    getUserByUserId(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found"
        });
      }
      results.password = undefined;
      return res.json({
        success: 1,
        data: results
      });
    });
  },

  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results
      });
    });
  },
  updateUsers: (req, res) => {
    const body = req.body;
    const salt = bcrypt.genSaltSync(10);
    if (body.password && salt) {
      body.password = bcrypt.hashSync(body.password, salt);
    }
    updateUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        message: "updated successfully"
      });
    });
  },
  deleteUser: (req, res) => {
    const data = req.params.id;
    deleteUser(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        message: "user deleted successfully",
        data_id: data
      });
    });
  }
};
