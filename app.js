const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const User = require('./models/User.js'); // Import User model
const Student = require('./models/Student.js'); // import mongoose model Student
const Gallery = require('./models/Gallery.js'); // import mongoose model Gallery


// mongoose connection
main()
    .then(() => console.log("connection successful"))
    .catch((err) => console.log(err));
async function main() {

    await mongoose.connect("mongodb://127.0.0.1:27017/alumni");
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Simple route
app.get("/", (req, res) => {
    res.send("Root is working!     GO to select T & S.ejs on /select route");
});


app.get("/select", (req, res) => {
    res.render("select");
});

// POST - Teacher Authentication Route
app.post("/teacher_auth", (req, res) => {
    const { secretCode, password } = req.body;

    // Static Secret Code & Password
    const validSecretCode = "SBES college";
    const validPassword = "science";

    if (secretCode === validSecretCode && password === validPassword) {
        res.redirect("/teacher_login");
    } else {
        res.render("select", { error: "Invalid Code or Password!" });
    }
});


// Login Route
app.get('/teacher_login', async (req, res) => {
    res.render('teacher/login.ejs');
});

app.post('/teacher_login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });

        if (!user) {
            // Show error modal if user is not registered
            return res.render('teacher/login.ejs', { error: 'This username is not registered. Please register first.' });
        }

        // Check if the entered password matches the stored password


        if (password == user.password) {
            // Redirect to home page on successful login
            res.redirect('/teacher_home');
        } else {
            // Invalid password
            res.render('teacher/login.ejs', { error: 'Invalid password. Please try again.' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Register Route
app.get('/teacher_register', (req, res) => {
    res.render('teacher/teacher_register.ejs');
});

app.post('/teacher_register', async (req, res) => {
    try {
        const { username, password, confirmPassword, email, address, mobileno } = req.body;

        console.log(req.body); // Debugging line

        if (!mobileno) {
            return res.status(400).send('Mobile number is required.');
        }

        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username is already taken');
        }

        const newUser = new User({
            username,
            password,
            email,
            address,
            mobileNo: mobileno, // Make sure this matches the schema field name
        });

        await newUser.save();
        res.redirect('/teacher_login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});







// Route to display home page with students--------------------------------------------------------------------------

app.get('/teacher_home', async (req, res) => {
    try {
        const students = await Student.find({}); // Fetch all students from MongoDB
        res.render('teacher/home.ejs', { students }); // Pass students array to EJS
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});



app.get('/teacher_search', async (req, res) => {
    try {
        const query = req.query.query; // Get the search query from the request
        let filteredStudents = [];

        if (query) {
            filteredStudents = await Student.find({
                username: { $regex: query, $options: "i" } // Case-insensitive search
            });
        } else {
            filteredStudents = await Student.find({});
        }

        res.render('teacher/home.ejs', { students: filteredStudents });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching students");
    }
});





// Route for logout (simplified)
app.get('/teacher_logout', (req, res) => {
    // Handle logout logic
    res.redirect('/teacher_login');
});

// Route new student registration form----------------------------------------------------------------------------------------------
app.get('/teacher_home/new', (req, res) => {
    res.render('teacher/new_student.ejs'); // Render the form to add a new student
});


app.post("/teacher_home", async (req, res) => {
    try {
        console.log("Received Data: ", req.body);  // 🛠 Debugging Log

        const { username, email, password, address, mobileNo, photo, skills, qualification, passoutYear, city, country, dob, gender, profileType } = req.body;

        let newUser = new Student({
            username,
            email,
            password,
            address,
            mobileNo,
            photo: photo || "",
            skills,
            qualification,
            passoutYear,
            city,
            country,
            dob,
            gender
        });

        // **Job Data Only if Profile Type is 'job'**
        if (profileType === "job" && req.body.job) {
            newUser.job = {
                companyName: req.body.job.companyName ? req.body.job.companyName.trim() : "",
                location: req.body.job.location ? req.body.job.location.trim() : "",
                jobTitle: req.body.job.jobTitle ? req.body.job.jobTitle.trim() : "",
                yearsOfExperience: req.body.job.yearsOfExperience ? req.body.job.yearsOfExperience.trim() : "",
                jobDescription: req.body.job.jobDescription ? req.body.job.jobDescription.trim() : "",
            };
        }

        // **PG Data Only if Profile Type is 'pg'**
        if (profileType === "pg" && req.body.pg) {
            newUser.pg = {
                collegeName: req.body.pg.collegeName ? req.body.pg.collegeName.trim() : "",
                degreeName: req.body.pg.degreeName ? req.body.pg.degreeName.trim() : "",
                specialSubject: req.body.pg.specialSubject ? req.body.pg.specialSubject.trim() : "",
                graduationYear: req.body.pg.graduationYear ? req.body.pg.graduationYear.trim() : "",
                additionalInfo: req.body.pg.additionalInfo ? req.body.pg.additionalInfo.trim() : "",
            };
        }

        await newUser.save();
        console.log("Saved User: ", newUser);  // ✅ Debugging Log
        res.redirect("/teacher_home");

    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).send("Error saving profile");
    }
});






//show page
app.get('/teacher_home/:id', async (req, res) => {
    try {
        let { id } = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.render('teacher/show.ejs', { student }); // Rendering the show page with student data
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching student data');
    }
});

// edit 
//Edit route

app.get('/teacher_home/:id/edit', async (req, res) => {
    try {
        let { id } = req.params;
        const user = await Student.findById(id);
        res.render("teacher/edit_student.ejs", { user }); // Adjust to your edit page view
    } catch (err) {
        res.status(404).send('Student not found');
    }
});

app.put("/teacher_home/:id", async (req, res) => {
    try {
        let { id } = req.params;
        await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.redirect(`/teacher_home/${id}`);
    } catch (err) {
        console.error(err);
        res.status(400).send('Error updating student');
    }
});



// Route to delete a student
app.delete('/teacher_home/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let student = await Student.findByIdAndDelete(id);
        res.redirect('/teacher_home'); // Redirect to home page after deletion
    } catch (err) {
        res.status(400).send('Error deleting student');
    }
});

// server connect to localhost
app.listen(8080, () => {
    console.log("Server is start on port 8080");
});


// student student student student student student student student student student student student
// student student student student student student student student student student student student
// student student student student student student student student student student student student
// student student student student student student student student student student student student
// student student student student student student student student student student student student
// student student student student student student student student student student student student
// student student student student student student student student student student student student

app.get('/student_login', (req, res) => {
    res.render('student/login.ejs');
});

// register page
app.get('/student_register', async (req, res) => {

    res.render('student/studentRegister.ejs');
});

// Handle Registration

app.post('/student_register', async (req, res) => {
    try {
        console.log("Received Data: ", req.body);  // 🛠 Debugging Log

        const { username, email, password, address, mobileNo, photo, skills, qualification, passoutYear, city, country, dob, gender, profileType } = req.body;

        let newUser = new Student({
            username,
            email,
            password,
            address,
            mobileNo,
            photo: photo || "",
            skills: skills || [],
            qualification,
            passoutYear,
            city,
            country,
            dob,
            gender
        });

        // **Job Data Only if Profile Type is 'job'**
        if (profileType === "job" && req.body.job) {
            newUser.job = {
                companyName: req.body.job.companyName ? req.body.job.companyName.trim() : "",
                location: req.body.job.location ? req.body.job.location.trim() : "",
                jobTitle: req.body.job.jobTitle ? req.body.job.jobTitle.trim() : "",
                yearsOfExperience: req.body.job.yearsOfExperience ? req.body.job.yearsOfExperience.trim() : "",
                jobDescription: req.body.job.jobDescription ? req.body.job.jobDescription.trim() : "",
            };
        }

        // **PG Data Only if Profile Type is 'pg'**
        if (profileType === "pg" && req.body.pg) {
            newUser.pg = {
                collegeName: req.body.pg.collegeName ? req.body.pg.collegeName.trim() : "",
                degreeName: req.body.pg.degreeName ? req.body.pg.degreeName.trim() : "",
                specialSubject: req.body.pg.specialSubject ? req.body.pg.specialSubject.trim() : "",
                graduationYear: req.body.pg.graduationYear ? req.body.pg.graduationYear.trim() : "",
                additionalInfo: req.body.pg.additionalInfo ? req.body.pg.additionalInfo.trim() : "",
            };
        }

        await newUser.save();
        console.log("Saved User: ", newUser);  // ✅ Debugging Log
        res.redirect("/student_login");

    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).send("Error saving profile");
    }
});


app.post('/student_login', async (req, res) => {
    const { username, password } = req.body;


    // Find the user by username in the database
    const user = await Student.findOne({ username });

    // check user is found or not
    if (!user) {
        return res.status(400).send('User not found');
    }

    // Compare password 
    if (password !== user.password) {
        return res.status(400).send('Incorrect password');
    }

    // Redirect to the home page after successful login
    res.redirect(`/student_home/${user._id}`);

});

// home page
app.get('/student_home/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Student.findById(id);
        const teachers = await User.find(); // Fetch all teacher data from MongoDB
        res.render('student/home.ejs', { user, teachers });
    }
    catch {
        res.status(500).send("Internal Server Error");
    }
});


// logout
app.get('/student_logout', (req, res) => {
    res.redirect('/student_login');
});

// For displaying batches
app.get('/student_batch/:id', async (req, res) => {
    const batchId = req.params.id;

    try {
        const user = await Student.findById(req.params.id);
        const user1 = await Student.distinct("passoutYear", {});

        res.render('student/batch.ejs', { user1, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Route to get students for passout year
app.get('/student_batch/:id/:passoutYear', async (req, res) => {
    const { passoutYear } = req.params;

    try {
        const user = await Student.findById(req.params.id);
        const user1 = await Student.find({ passoutYear: passoutYear });
        res.render('student/batchStudent.ejs', { user, user1, passoutYear: parseInt(passoutYear) });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});






// Example student details page
app.get('/student_student/:id', async (req, res) => {
    try {
        // Get the student ID from the URL parameters
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Render the student details page and pass the student data
        res.render('student/studentProfile.ejs', { student });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Profile route
// Profile route with user ID
app.get('/student_profile/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find user by ID
        const user = await Student.findById(id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the profile page with user data
        res.render('student/profile.ejs', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving user data');
    }
});

// Route to show the edit form
app.get('/student_profile/:id/edit', async (req, res) => {
    try {
        const user = await Student.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('student/editProfile.ejs', { user }); // Render the edit form with current user data
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.put('/student_profile/:id/edit', async (req, res) => {
    try {
        let { id } = req.params;

        await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        res.redirect(`/student_profile/${id}`); // Redirect to the updated profile page
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});




// Route to delete a user
app.post('/student_profile/:id/delete', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/student_login'); // Redirect to home after deletion
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//gallery page
app.get("/student_gallery/:id", async (req, res) => {

    const images = await Gallery.find();
    const user = await Student.findById(req.params.id);
    res.render("student/gallery.ejs", { images, user, userId: req.params.id });

});

//add image - form handle submission
app.post("/student_Gallery/:id", async (req, res) => {
    const { imageUrl, location, date, description } = req.body;
    try {
        const newImage = new Gallery({
            imageUrl, location, date, description, userId: req.params.id,
        });
        await newImage.save();
        res.redirect(`/student_gallery/${req.params.id}`);
    } catch {
        res.status(500).send("Error adding image");
    }
});

//   // Route to render job apply page with all jobs
// app.get('/jobApply/:id', async (req, res) => {
//     const jobId = req.params.id;
//     const job = await Job.findById(jobId);
//     res.render('jobApply', { job });
// });

// // Route to apply for a job
// app.post('/applyJob', async (req, res) => {
//     const applicationData = req.body;
//     // Assuming you are storing the application data
//     // In a real application, you'd save this to a database
//     console.log(applicationData);

//     // Send success response
//     res.json({ message: 'Application submitted successfully' });
// });
// app.get('/jobApply', async (req, res) => {
//     const jobs = await Job.find();  // Get all jobs
//     res.render('jobApply', { jobs });
// });
// app.post('/addJob', async (req, res) => {
//     const { companyName, location, jobTitle, yearsOfExperience, jobDescription, languagesRequired, skillsRequired, salaryPackage, city, country, contactEmail, contactPhone } = req.body;

//     const newJob = new Job({
//         companyName,
//         location,
//         jobTitle,
//         yearsOfExperience,
//         jobDescription,
//         languagesRequired: languagesRequired.split(','),
//         skillsRequired: skillsRequired.split(','),
//         salaryPackage,
//         city,
//         country,
//         contactEmail,
//         contactPhone,
//     });

//     await newJob.save();
//     res.redirect('/jobApply');
// });
// app.post('/applyJob', async (req, res) => {
//     const { studentName, studentEmail, qualification, passoutYear, gender, address, jobId } = req.body;

//     // Example of saving the application data to a database (assuming an Application model exists):
//     const application = new Application({
//         jobId,
//         studentName,
//         studentEmail,
//         qualification,
//         passoutYear,
//         gender,
//         address
//     });

//     await application.save();

//     // Send a response to indicate success
//     res.json({ message: 'Application submitted successfully' });
// });


app.get('/student_about/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Retrieve the student data by ID (or any model)
        const studentData = await Student.findById(userId); // Replace with actual model query

        if (!studentData) {
            return res.status(404).send('User not found');
        }

        // Render the 'about.ejs' page and pass the student data
        res.render('student/about.ejs', { user: studentData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching student data');
    }
});