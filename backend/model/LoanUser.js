const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  UserName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  weekNum:{
    type:Number,
  },
  loans: [
    {
      TotalAmount: Number,
      TotalWeek: Number,
      TotalDifference: Number,
      loadPending:{
        type:String,
      default :false},
      week: [
        {
          weekNum: Number,
          Date: Date,
          amount:Number,
          Status: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
});

// Middleware to automatically populate the week array
// UserSchema.pre("save", function (next) {
//   // Check if TotalWeek and TotalAmount are available
//   if (this.TotalWeek && this.TotalAmount) {
//     const amount=this.TotalAmount/this.TotalWeek;
//     // Clear existing entries in the week array
//     this.week = [];

//     // Populate the week array with the specified number of entries
//     for (let i = 0; i < this.TotalWeek; i++) {
//         const date = new Date();
//      date.setDate(date.getDate() + 7); 
//       this.week.push({
//         weekNum: i + 1,
//         amount:amount,
//         Date: date,
//         Status: false,
//       });
//     }
//   }

//   next();
// });

const LoanUser = mongoose.model("User", UserSchema);
module.exports=LoanUser;