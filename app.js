
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Task1: initiate app and run server at 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the provided frontend without editing its files
app.use(express.static(path.join(__dirname, 'dist', 'Frontend')));

// Keep the original static path line
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

// Task2: create mongoDB connection

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Atlas connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });

// Employee database schema
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below


// TODO: get data from db using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// TODO: get single data from db using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// TODO: send data to db using api '/api/employeelist'
// Request body format: {name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const employee = new Employee({
            name: req.body.name,
            location: req.body.location,
            position: req.body.position,
            salary: req.body.salary
        });

        const savedEmployee = await employee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// TODO: delete an employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({
            message: 'Employee deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// TODO: Update employee data using api '/api/employeelist'
// Request body format: {name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, name, location, position, salary } = req.body;

        if (!_id || !mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: 'A valid employee ID is required'
            });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            _id,
            { name, location, position, salary },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

// Start server at port 3000
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
