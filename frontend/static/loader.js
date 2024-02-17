document.addEventListener("DOMContentLoaded", function () {
    const spinner = document.getElementById("spinner");
    const form = document.getElementById("passenger-location-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Show spinner
        spinner.style.display = "block";

        // Serialize form data
        const formData = new FormData(form);

        // Send form data asynchronously using AJAX
        fetch('/calculate_route', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Replace entire HTML content with the response data
            document.documentElement.innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
            // Hide spinner
            spinner.style.display = "none";
            // Handle errors or display error message
        });
    });
});
