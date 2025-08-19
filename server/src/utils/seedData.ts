import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Customer from '../models/Customer';
import { connectDB } from './database';

dotenv.config();

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

    // Create 100 dummy profiles
    const customers = [];
    const genders = ['Male', 'Female'];
    const cities = ['New York', 'London', 'Tokyo', 'Sydney', 'Paris'];
    const countries = ['USA', 'UK', 'Japan', 'Australia', 'France'];
    const maritalStatuses = ['Single', 'Divorced', 'Widowed'];
    const yesNoMaybe = ['Yes', 'No', 'Maybe'];

    for (let i = 0; i < 100; i++) {
      const gender = genders[i % genders.length];
      const customer = new Customer({
        firstName: `FirstName${i}`,
        lastName: `LastName${i}`,
        gender,
        dateOfBirth: new Date(1980 + (i % 40), (i % 12) + 1, (i % 28) + 1),
        country: countries[i % countries.length],
        city: cities[i % cities.length],
        height: 160 + (i % 30),
        email: `customer${i}@example.com`,
        phoneNumber: `123456789${i.toString().padStart(2, '0')}`,
        undergraduateCollege: `University of ${cities[i % cities.length]}`,
        degree: 'Bachelor of Science',
        income: 50000 + (i * 1000),
        currentCompany: `Tech Corp ${i}`,
        designation: 'Software Engineer',
        maritalStatus: maritalStatuses[i % maritalStatuses.length],
        languagesKnown: ['English'],
        siblings: '1',
        caste: 'Any',
        religion: 'Any',
        wantKids: yesNoMaybe[i % yesNoMaybe.length],
        openToRelocate: yesNoMaybe[i % yesNoMaybe.length],
        openToPets: yesNoMaybe[i % yesNoMaybe.length],
        status: 'Active',
      });
      customers.push(customer);
    }
    await Customer.insertMany(customers);

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
