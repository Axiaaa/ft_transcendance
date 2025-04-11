


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

export async function signup(signup_username , signup_password ) {
  const signupData = { signup_username, signup_password };

  try {
      const response = await fetch('https://localhost/api/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData)
      });

      if (response.ok) {
          const result = await response.json();
          console.log('Signup successful:', result);
          localStorage.setItem('authToken', result.token);
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

document.getElementById('signupform')?.addEventListener('submit', async function (event) {
  event.preventDefault();

  const signup_username = (document.getElementById('newUsername')).value;
  const signup_password = (document.getElementById('newPassword')).value;

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: signup_username,
        password: signup_password,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const signupResult = await response.json();
    console.log('Signup result:', signupResult);

    // Redirect on success
    window.location.href = '/dashboard';
  } catch (err) {
    alert('Signup failed: ' + err.message);
  }
});