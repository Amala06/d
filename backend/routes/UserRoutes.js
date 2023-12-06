const express = require("express");
const{Login,Register, UpdateLoanValue, particularPerson, UpdateWeekStatus}=require("../Controllers/UserController");
const router=express.Router();
router.post("/login",Login);
router.post("/register",Register);
router.post("/setLoan",UpdateLoanValue);
router.get("/person/:email", particularPerson);
router.post("/weeknum/:email/:weekNum",UpdateWeekStatus);

module.exports = router;
