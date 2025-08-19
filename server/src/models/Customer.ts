import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dob: string;
  age: number;
  country: string;
  city: string;
  height: number;
  email: string;
  phone: string;
  college: string;
  degree: string;
  income: number;
  company: string;
  designation: string;
  maritalStatus: string;
  languages: string[];
  siblings: number;
  caste: string;
  religion: string;
  wantKids: 'Yes' | 'No' | 'Maybe';
  openToRelocate: 'Yes' | 'No' | 'Maybe';
  openToPets: 'Yes' | 'No' | 'Maybe';
  statusTag: string;
  isDummy: boolean;
}

const CustomerSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  height: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  degree: { type: String, required: true },
  income: { type: Number, required: true },
  company: { type: String, required: true },
  designation: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  languages: { type: [String], required: true },
  siblings: { type: Number, required: true },
  caste: { type: String, required: true },
  religion: { type: String, required: true },
  wantKids: { type: String, required: true },
  openToRelocate: { type: String, required: true },
  openToPets: { type: String, required: true },
  statusTag: { type: String, default: 'Active' },
  isDummy: { type: Boolean, default: false },
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);