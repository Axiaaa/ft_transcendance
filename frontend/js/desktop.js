// Create a simple web interface with a title, paragraph, and clickable button

// Create the title element
const title = document.createElement('h1');
title.textContent = 'Bienvenue sur mon site web';

// Create the paragraph element
const paragraph = document.createElement('p');
paragraph.textContent = 'Ceci est un exemple d\'interface web en JavaScript.';

// Create the button element
const button = document.createElement('button');
button.textContent = 'Cliquez-moi';

// Add an event listener to the button
button.addEventListener('click', () => {
	alert('Bouton cliqué!');
});

// Append the elements to the body
document.body.appendChild(title);
document.body.appendChild(paragraph);
document.body.appendChild(button);