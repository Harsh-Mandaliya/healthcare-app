const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Hospital = require('./models/Hospital');

dotenv.config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Add sample hospitals
  await Hospital.create([
    {
      name: 'Apollo Hospital',
      address: {
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001'
      },
      phone: '022-12345678',
      facilities: ['Emergency', 'ICU', 'Surgery'],
      departments: ['Cardiology', 'Neurology']
    }
  ]);
  
  console.log('Data seeded!');
  process.exit();
};

seedData();