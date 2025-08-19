import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Customer from '../models/Customer';
import { connectDB } from './database';

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

// Helper for random pick
const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

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

    // Create 100 realistic dummy profiles with equal gender distribution
    const customers = [];
    for (let i = 0; i < 100; i++) {
      const gender = i < 50 ? 'Male' : 'Female';  // First 50 will be Male, next 50 will be Female
      const firstName = gender === 'Male' ? randomElement(firstNamesMale) : randomElement(firstNamesFemale);
      const lastName = randomElement(lastNames);
      const city = randomElement(cities);
      const maritalStatus = randomElement(maritalStatuses);

      const dateOfBirth = new Date(
        1970 + Math.floor(Math.random() * 30), // year between 1970–2000
        Math.floor(Math.random() * 12),        // month
        Math.floor(Math.random() * 28) + 1     // day
      );

      const customer = new Customer({
        firstName,
        lastName,
        gender,
        dateOfBirth,
        city,
        country: 'India',
        maritalStatus,
        smoking: randomElement(yesNoMaybe),
        drinking: randomElement(yesNoMaybe),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phoneNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        height: Math.floor(150 + Math.random() * 40), // 150-190 cm
        undergraduateCollege: `University of ${city}`,
        degree: 'Bachelor of ' + ['Science', 'Arts', 'Commerce', 'Engineering', 'Business Administration'][Math.floor(Math.random() * 5)],
        income: Math.floor(500000 + Math.random() * 1000000), // 5L to 15L
        currentCompany: `${city} ${['Tech', 'Solutions', 'Enterprises', 'Industries', 'Group'][Math.floor(Math.random() * 5)]}`,
        designation: ['Software Engineer', 'Manager', 'Analyst', 'Consultant', 'Specialist'][Math.floor(Math.random() * 5)],
        languagesKnown: ['English', 'Hindi', 'Regional'][Math.floor(Math.random() * 3)],
        siblings: Math.floor(1 + Math.random() * 3).toString(),
        caste: ['General', 'OBC', 'SC', 'ST'][Math.floor(Math.random() * 4)],
        religion: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'][Math.floor(Math.random() * 7)],
        wantKids: randomElement(yesNoMaybe),
        openToRelocate: randomElement(yesNoMaybe),
        openToPets: randomElement(yesNoMaybe),
        status: 'Active',
      });

      customers.push(customer);
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
