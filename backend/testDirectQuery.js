// Script to directly test database queries
import mongoose from 'mongoose';
import Project from './models/Project.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Use the same connection string as in db.js
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const DB_URL = `mongodb+srv://${username}:${password}@finvest.inqniqa.mongodb.net/?retryWrites=true&w=majority&appName=finvest`;

async function testQueries() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
    
    // Test various query methods
    const testId = "10";
    
    console.log(`\nTesting exact equality with string ID: ${testId}`);
    const project1 = await Project.findOne({ id: testId });
    console.log('Result:', project1 ? 'Found' : 'Not found');
    
    console.log(`\nTesting with regex for ID: ${testId}`);
    const project2 = await Project.findOne({ id: new RegExp(`^${testId}$`) });
    console.log('Result:', project2 ? 'Found' : 'Not found');
    
    console.log(`\nTrying with MongoDB _id for numeric ID: ${testId}`);
    const allProjects = await Project.find();
    const matchingProject = allProjects.find(p => p.id === testId);
    console.log('Result:', matchingProject ? 'Found' : 'Not found');
    
    if (matchingProject) {
      console.log('Found project:', {
        id: matchingProject.id,
        _id: matchingProject._id,
        title: matchingProject.title
      });
    }
    
    // Print all IDs for comparison
    console.log('\nAll project IDs in database:');
    allProjects.forEach(p => console.log(`ID: "${p.id}" (${typeof p.id}), _id: ${p._id}`));
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

testQueries(); 