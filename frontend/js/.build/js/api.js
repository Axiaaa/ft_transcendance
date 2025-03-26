export async function login(username, password) {
    const loginData = { username, password };
  
    try {
      const response = await fetch('/https://localhost/api/users/${username}', {
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
  
const username = document.getElementById('username').value;
const password = document.getElementById('password').value;

try {
    const loginResult = await login(username, password);
    console.log('Login result:', loginResult);
    window.location.href = '/dashboard'; 
} catch (err) {
    alert('Login failed: ' + err.message);
}});

export async function signup(username, password) {
  const signupData = { username, password };

  try {
      const response = await fetch('https://localhost/api', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData)
      });

      if (response.ok) {
          const result = await response.json();
          console.log('Signup successful:', result);

          // Store the token in localStorage for later use
          localStorage.setItem('authToken', result.token);

          // Return success (for handling after signup, like redirecting)
          return result;
      } else {
          const error = await response.json();
          throw new Error(error.message || 'Signup failed');
      }
  } catch (err) {
      console.error('Error during signup request:', err);
      throw new Error('Error during signup request');
  }
}

// Sign up event listener
document.getElementById('signupform').addEventListener('submit', async function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
      const signupResult = await signup(username, password);
      console.log('Signup result:', signupResult);
      window.location.href = '/dashboard'; 
  } catch (err) {
      alert('Signup failed: ' + err.message);
  }
});

