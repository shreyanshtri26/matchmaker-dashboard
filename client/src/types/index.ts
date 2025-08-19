export interface Customer {
  _id: string;
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
  isDummy?: boolean;
}

export interface Match {
  id: string;
  name: string;
  age: number;
  city: string;
  designation: string;
  height: number;
  income: number;
  score: number;
  explanation: string;
  intro: string;
  profileDetails?: {
    email: string;
    phone: string;
    college: string;
    degree: string;
    company: string;
    maritalStatus: string;
    languages: string[];
    religion: string;
    wantKids: 'Yes' | 'No' | 'Maybe';
    openToRelocate: 'Yes' | 'No' | 'Maybe';
    openToPets: 'Yes' | 'No' | 'Maybe';
  };
}