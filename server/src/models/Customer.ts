import { Schema, model, Document } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  country: string;
  city: string;
  height: number;
  email: string;
  phoneNumber: string;
  undergraduateCollege: string;
  degree: string;
  income: number;
  currentCompany: string;
  designation: string;
  maritalStatus: string;
  languagesKnown: string[];
  siblings: string;
  caste: string;
  religion: string;
  wantKids: string;
  openToRelocate: string;
  openToPets: string;
  status: string;
  notes: string[];
}

const CustomerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  height: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  undergraduateCollege: { type: String },
  degree: { type: String },
  income: { type: Number },
  currentCompany: { type: String },
  designation: { type: String },
  maritalStatus: { type: String },
  languagesKnown: [{ type: String }],
  siblings: { type: String },
  caste: { type: String },
  religion: { type: String },
  wantKids: { type: String },
  openToRelocate: { type: String },
  openToPets: { type: String },
  status: { type: String, default: 'Active' },
  notes: [{ type: String }],
}, { timestamps: true });

export default model<ICustomer>('Customer', CustomerSchema);
