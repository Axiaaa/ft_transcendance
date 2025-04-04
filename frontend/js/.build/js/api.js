import dotenv from 'dotenv';
const API_USERNAME = process.env.API_USERNAME;
const API_PASSWORD = process.env.API_PASSWORD;
console.log('API_USERNAME:', API_USERNAME); //process not difined in front
console.log('API_PASSWORD:', API_PASSWORD); //so i need to go to the back


export async function login(signin_username, signin_password) {
    const loginData = { signin_username, signin_password };
  
    try {
      const response = await fetch('/https//localhost/api/users/${username}', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response.ok) {
        const result = await response.json(); // Parsing the response (usually the token)
        console.log('Login successful:', result);
  
        // Store the token in localStorage for later use
        localStorage.setItem('authToken', result.token);
  
        // Return success (for handling after login, like redirecting)
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login request:', err);
      throw new Error('Error during login request');
    }
  }
  
//sign in
document.getElementById('loginform').addEventListener('submit', async function(event) {
event.preventDefault();
  
const signin_username = document.getElementById('username').value;
const signin_password = document.getElementById('password').value;

});