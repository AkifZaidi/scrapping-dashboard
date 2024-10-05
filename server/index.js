const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")
// const axios = require('axios'); // Make sure axios is imported
const userModel = require("./models/user")
const carModel = require("./models/scrapper")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

mongoose.connect("mongodb://127.0.0.1:27017/officeDashBoard",  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

app.post('/register', async function (req, res) {
    const { name, email, password } = req.body;
    
    let AuthenticateUser = await userModel.findOne({ email });
    
    if (AuthenticateUser) {
        // Return here to avoid further processing
        return res.send("User already exists");
    }
    
    // Proceed only if the user doesn't exist
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return res.status(500).json({ error: "Error generating salt" });
        }
        
        bcrypt.hash(password, salt, async function (err, hash) {
            if (err) {
                return res.status(500).json({ error: "Error hashing password" });
            }

            try {
                let user = await userModel.create({
                    name,
                    email,
                    password: hash
                });
                
                console.log(user);
                
                var token = jwt.sign({ email, userId: user._id }, 'dashBoard@');
                res.cookie("token", token); // Set the cookie before sending the response
                return res.json(user); // Send response after setting the cookie
            } catch (err) {
                return res.status(500).json({ error: "Error creating user" });
            }
        });
    });
});

app.post("/user", async (req, res) => {
    let User = await userModel.find();
    console.log(User)
    res.json(User)
})

// app.post("/login", async (req, res) => {
//     const { email, password } = req.body

//     let loginUser = await userModel.findOne({ email });

//     if (!loginUser) {
//         res.send("user has not access")
//     }
//     // bcrypt.compare(password, loginUser.password, async function (err, result) {
//     //     console.log(result);
//     //     if (result) {
//     //         var decoded = jwt.verify({ email, userId: loginUser._id}, 'dashBoard@');
//     //         console.log(decoded.foo)
//     //         res.cookie("token",decoded )
//     //     }else{
//     //         res.send("Something is Wrong")

//     //     }

//     // });

//     bcrypt.compare(password, loginUser.password, async function (err, isMatch) {
//         if (err) {
//             return res.status(500).send("Server error");
//         }

//         if (isMatch) {
//             let role;

//             // Check if the user is an admin
//             if (loginUser.email === "QHH@gmail.com" && password === "QHH@") {
//                 role = "admin";  // Special admin email and password
//             } else {
//                 role = loginUser.role || "user";  // Default role is user
//             }

//             // Generate JWT token with the user's role
//             const token = jwt.sign(
//                 { email, userId: loginUser._id, role },
//                 'dashBoard@',  // Secret key
//                 { expiresIn: '1h' }  // Token expiry
//             );

//             // Set the token as a cookie
//             res.cookie("token", token, { httpOnly: true });

//             // Send the response after setting the cookie
//             return res.status(200).json({ role });
//         } else {
//             // Only send the response once
//             return res.status(400).send("Invalid password");
//         }
//     });

// })

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Hardcoded admin check first
    if (email === "QHH@gmail.com" && password === "QHH@") {
        // Create token for admin
        const token = jwt.sign({ email, role: 'admin' }, 'dashBoard@');

        // Send admin role and token
        res.cookie("token", token);
        return res.send({ role: 'admin', token });
    } else {
        console.log("your are not access")
    }

    let loginUser = await userModel.findOne({ email });

    if (!loginUser) {
        return res.status(403).send({ role: 'unauthorized', message: "Unauthorized access" });
    }

    // Compare password
    bcrypt.compare(password, loginUser.password, (err, result) => {
        if (result) {
            const token = jwt.sign({ email, userId: loginUser._id }, 'dashBoard@', { expiresIn: '1h' });
            res.cookie("token", token);
            return res.send({ role: 'user' });
        } else {
            return res.status(403).send({ role: 'unauthorized', message: "Unauthorized access" });
        }
    });

    // If not hardcoded admin, check MongoDB for user

});

app.post('/scrape', async (req, res) => {
    try {
        const { number, carName, location, price } = req.body; // Input field se data le rahe hain

        if (!number && !carName && !location && !price) {
            return res.status(400).json({ message: "Input is required" });
        }

        const newCar = new carModel({
            carName,
            number,
            location,
            price,
        });

        await newCar.save();
        console.log(`Received data: Number: ${newCar}`);

        res.status(201).json({ message: 'Car details saved successfully!', newCar }); // Correctly send newCar in response
    } catch (error) {
        console.error('Detailed Error:', error);  // Error ko detail mein log karo
        res.status(500).json({ message: "Internal Server Error", error: error.message }); // Client ko error bheje
    }
});




// Route to fetch cars
app.get('/cars', async (req, res) => {
  try {
    const cars = await carModel.find(); // Fetch all car data
    const uniqueCars = [];
    const duplicateCars = [];
    const numberMap = new Map();

    // Identify duplicates by number
    cars.forEach(car => {
      if (numberMap.has(car.number)) {
        duplicateCars.push(car);
      } else {
        numberMap.set(car.number, true);
        uniqueCars.push(car);
      }
    });

    res.json({
      uniqueCars,   // Cars with unique numbers
      duplicateCars // Cars with duplicate numbers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars data' });
  }
});


const cron = require('node-cron');

// Schedule the job to run every hour (or adjust as needed)
cron.schedule('0 * * * *', async () => {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  
  try {
    await carModel.deleteMany({ createdAt: { $lte: twelveHoursAgo } });
    console.log('Deleted cars older than 12 hours');
  } catch (error) {
    console.error('Error deleting old car data:', error);
  }
});


async function IsLoggedIn(req, res, next) {
    if (req.cookie.token == "") {
        res.send("Something Went Wrong: No token provided")
    }

    const data = jwt.verify(req.cookies.token, "dashBoard");
    console.log("Decoded JWT data:", data)

    if (!data.userId) {
        return res.send("Invalid token: No userId in token");
    }

    req.user = data;
}

app.listen(3000, () => {
    console.log("server is running")
})