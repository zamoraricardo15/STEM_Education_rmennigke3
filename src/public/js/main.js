require('dotenv').config();


// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Example of adding interactivity to your site
    const toggleSections = document.querySelectorAll('.toggle-section');

    toggleSections.forEach(section => {
        section.addEventListener('click', function() {
            this.nextElementSibling.classList.toggle('hidden');
        });
    });
});
