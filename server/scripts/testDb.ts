import mongoose from 'mongoose';
import CompetencyProfile from '../models/CompetencyProfile';
import InsightEvent from '../models/InsightEvent';

const test = async () => {
  await mongoose.connect('mongodb://localhost:27017/capacityconnect');
  const profiles = await CompetencyProfile.find().populate('userId').exec();
  console.log('PROFILES:', JSON.stringify(profiles, null, 2));
  
  const insights = await InsightEvent.find().exec();
  console.log('INSIGHTS:', JSON.stringify(insights, null, 2));
  process.exit();
}
test();
