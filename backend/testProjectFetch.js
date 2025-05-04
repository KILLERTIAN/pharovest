// Script to test fetching a project by ID
import axios from 'axios';

// Function to test fetching a project
async function testFetchProject(projectId) {
  try {
    console.log(`Testing fetch for project ID: ${projectId}`);
    const url = `http://localhost:8000/project/${projectId}`;
    console.log('Request URL:', url);
    
    const response = await axios.get(url);
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Test with a few different project IDs
async function runTests() {
  // Test with IDs we know exist from our diagnostic script
  await testFetchProject(1);  // String ID "1"
  await testFetchProject("1"); // Explicitly as string
  await testFetchProject("10"); // Another ID
  await testFetchProject(10);   // As number
}

runTests(); 