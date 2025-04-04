
export async function signup(signup_username :string, signup_password :string) {
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

  const signup_username = (document.getElementById('newUsername') as HTMLInputElement).value;
  const signup_password = (document.getElementById('newPassword') as HTMLInputElement).value;

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
  } catch (err: any) {
    alert('Signup failed: ' + err.message);
  }
});