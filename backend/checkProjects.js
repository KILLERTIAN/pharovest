// Script to check projects in the database
import mongoose from 'mongoose';
import Project from './models/Project.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Use the same connection string as in db.js
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const DB_URL = `mongodb+srv://${username}:${password}@finvest.inqniqa.mongodb.net/?retryWrites=true&w=majority&appName=finvest`;

async function checkProjects() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
    
    // Get all projects
    const projects = await Project.find();
    console.log('Total projects found:', projects.length);
    console.log('Projects:');
    projects.forEach(project => {
      console.log(`ID: ${project.id}, _id: ${project._id}, Title: ${project.title}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProjects(); 