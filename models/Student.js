const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    confirmPassword: String,
    address: String,
    qualification: String,
    passoutYear: String,
    mobileNo: {
        type: String,
        required: true,
        unique: true,
    },
    dob: Date,
    gender: String,
    city: String,
    country: String,
    photo: String, // file path
    skills: {
        type: String,

    },
    job: {
        companyName: {
            type: String,

        },
        location: {
            type: String,

        },
        jobTitle: {
            type: String,

        },
        yearsOfExperience: {
            type: Number,

        },
        jobDescription: {
            type: String,
        },
    },
    pg: {
        collegeName: {
            type: String,

        },
        degreeName: {
            type: String,

        },
        specialSubject: {
            type: String,

        },
        graduationYear: {
            type: String,

        },
        additionalInfo: {
            type: String,
        },
    }

});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
