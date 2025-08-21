import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Customer from '../models/Customer';
import { connectDB } from '../database';

dotenv.config();

// Arrays for realistic data
const firstNamesMale = [
  'Aarav', 'Arjun', 'Rohan', 'Karan', 'Varun', 'Siddharth', 'Rajesh', 'Vikram',
  'Amit', 'Rahul', 'Pradeep', 'Suresh', 'Anil', 'Deepak', 'Manoj', 'Ravi',
  'Ashish', 'Nitin', 'Sandeep', 'Ajay', 'Vijay', 'Akash', 'Rohit', 'Gaurav',
  'Sachin', 'Vishal', 'Ankit', 'Harsh', 'Nikhil', 'Shubham'
];

const firstNamesFemale = [
  'Priya', 'Ananya', 'Shreya', 'Kavya', 'Aditi', 'Nikita', 'Pooja', 'Meera',
  'Sanya', 'Riya', 'Divya', 'Neha', 'Swati', 'Rekha', 'Sunita', 'Geeta',
  'Anjali', 'Preeti', 'Shikha', 'Nisha', 'Mamta', 'Sita', 'Radha', 'Kiran',
  'Sapna', 'Seema', 'Veena', 'Lata', 'Maya', 'Arya'
];

const lastNames = [
  'Sharma', 'Gupta', 'Agarwal', 'Singh', 'Kumar', 'Jain', 'Mehta', 'Shah',
  'Patel', 'Verma', 'Yadav', 'Mishra', 'Tiwari', 'Pandey', 'Srivastava', 'Joshi',
  'Bansal', 'Malhotra', 'Chopra', 'Kapoor', 'Bhatia', 'Arora', 'Khurana', 'Sethi',
  'Aggarwal', 'Goyal', 'Mittal', 'Jindal', 'Saxena', 'Goel'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
  'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Varanasi'
];

const maritalStatuses = ['Single', 'Divorced', 'Widowed'];
const yesNoMaybe = ['Yes', 'No', 'Maybe'];
const castes = ['General', 'OBC', 'SC', 'ST'];
const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'];

// Helper for random pick
const randomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Customer.deleteMany({});

    // Create a sample user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      username: 'matchmaker',
      password: hashedPassword,
    });
    await user.save();

    // Create 10 non-dummy customers (5 male, 5 female) and 100 dummy profiles (50 male, 50 female)
    const customers = [];

    // Function to generate a customer
    const generateCustomer = (gender: 'Male' | 'Female', isDummy: boolean) => {
      const firstName = gender === 'Male' ? randomElement(firstNamesMale) : randomElement(firstNamesFemale);
      const lastName = randomElement(lastNames);
      const city = randomElement(cities);
      const maritalStatus = randomElement(maritalStatuses);

      const dateOfBirth = new Date(
        1970 + Math.floor(Math.random() * 30), // year between 1970–2000
        Math.floor(Math.random() * 12),        // month
        Math.floor(Math.random() * 28) + 1     // day
      );
      const dob = dateOfBirth.toISOString().split('T')[0];
      const age = new Date().getFullYear() - dateOfBirth.getFullYear();

      return new Customer({
        firstName,
        lastName,
        gender,
        dob,
        age,
        city,
        country: 'India',
        maritalStatus,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        height: Math.floor(150 + Math.random() * 40), // 150-190 cm
        college: `University of ${city}`,
        degree: 'Bachelor of ' + randomElement(['Science', 'Arts', 'Commerce', 'Engineering', 'Business Administration']),
        income: Math.floor(500000 + Math.random() * 1000000), // 5L to 15L
        company: `${city} ${randomElement(['Tech', 'Solutions', 'Enterprises', 'Industries', 'Group'])}`,
        designation: randomElement(['Software Engineer', 'Manager', 'Analyst', 'Consultant', 'Specialist']),
        languages: ['English', 'Hindi'],
        siblings: Math.floor(1 + Math.random() * 3),
        caste: randomElement(castes),
        religion: randomElement(religions),
        wantKids: randomElement(yesNoMaybe),
        openToRelocate: randomElement(yesNoMaybe),
        openToPets: randomElement(yesNoMaybe),
        statusTag: 'Active',
        isDummy,
      });
    };

    // 5 male non-dummy
    for (let i = 0; i < 55; i++) {
      customers.push(generateCustomer('Male', false));
    }
    // 5 female non-dummy
    for (let i = 0; i < 55; i++) {
      customers.push(generateCustomer('Female', false));
    }
    // 50 male dummy
    for (let i = 0; i < 80; i++) {
      customers.push(generateCustomer('Male', true));
    }
    // 50 female dummy
    for (let i = 0; i < 80; i++) {
      customers.push(generateCustomer('Female', true));
    }

    await Customer.insertMany(customers);
    console.log('Database seeded with realistic users and customers!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
};

seedData();