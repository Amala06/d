const User = require("../model/LoanUser");
const asyncHandler = require("express-async-handler");

const Register = asyncHandler(async (req, res) => {
  const { UserName, email, password } = req.body;
  if (!UserName || !email || !password) {
    res.status(400);
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    UserName,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      UserName: user.UserName,
      email: user.email,
      password: user.password,
      //   token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Fail to create new user");
  }
});

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && password) {
    res.json({
      _id: user._id,
      UserName: user.UserName,
      email: user.email,
      password: user.password,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const UpdateLoanValue = asyncHandler(async (req, res) => {
  const { email, TotalAmount, TotalWeek } = req.body;

  try {
    // Use findOne to find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure that user.loans is an array
    if (!user.loans || !Array.isArray(user.loans)) {
      // Initialize user.loans as an empty array
      user.loans = [];
    }

    // Create a new object for the loan
    const newLoan = {
      TotalAmount,
      TotalWeek,
      // TotalDifference: TotalAmount - TotalWeek,
      week: [],
    };

    // Populate the week array with the specified number of entries
    const amountPerWeek = TotalAmount / TotalWeek;
    for (let i = 0; i < TotalWeek; i++) {
      const date = new Date();
      date.setDate(date.getDate() + 7 * i);

      newLoan.week.push({
        weekNum: i + 1,
        amount: amountPerWeek,
        Date: date,
        Status: false,
      });
    }

    // Add the new loan to the loans array
    user.loans.push(newLoan);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Loan updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const particularPerson = asyncHandler(async (req, res) => {
  const { email } = req.params;

  try {
    // Use await with findOne
    const person = await User.findOne({ email });

    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    // Handle the result as a Promise

    res.status(200).json(person);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const UpdateWeekStatus = asyncHandler(async (req, res) => {
  const { email, weekNum } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if the index is valid
    if (weekNum >= 0 && weekNum < user.loans[0].week.length) {
      // Update the Status to true for the specific week
      user.loans[0].week[weekNum].Status = true;

      // Save the updated user document
      const savedUser = await user.save();
      return res
        .status(200)
        .json({
          success: true,
          message: `Status updated to true for week ${weekNum + 1}`,
          user: savedUser,
        });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Invalid week index" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});


module.exports = {
  Register,
  Login,
  UpdateLoanValue,
  particularPerson,
  UpdateWeekStatus,
};
