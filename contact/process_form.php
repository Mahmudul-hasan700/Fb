<?php
// Check if the form has been submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Your reCAPTCHA secret key
    $recaptchaSecretKey = "6Le0Qk4oAAAAAKTpqFHH0fhbTASh8LjMNeccbC6m";

    // Verify the reCAPTCHA response
    $recaptchaResponse = $_POST["g-recaptcha-response"];
    $recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify";
    $recaptchaData = [
        "secret" => $recaptchaSecretKey,
        "response" => $recaptchaResponse,
    ];

    $options = [
        "http" => [
            "header" => "Content-Type: application/x-www-form-urlencoded\r\n",
            "method" => "POST",
            "content" => http_build_query($recaptchaData),
        ],
    ];

    $context = stream_context_create($options);
    $recaptchaResult = file_get_contents($recaptchaUrl, false, $context);
    $recaptchaResult = json_decode($recaptchaResult, true);

    if ($recaptchaResult && $recaptchaResult["success"]) {
        // reCAPTCHA verification successful

        // Process the rest of your form data here
        $name = $_POST["name"];
        $email = $_POST["email"];
        $message = $_POST["message"];

        // Now you can do whatever you want with the form data (e.g., send an email, save to a database)
        // Replace this with your processing logic

        // For example, sending an email (you'll need to set up email settings)
        mail("your@email.com", "Contact Form Submission", "Name: $name\nEmail: $email\nMessage: $message");

        // Redirect the user to a thank-you page
        header("Location: thank_you.html");
    } else {
        // reCAPTCHA verification failed
        echo "reCAPTCHA verification failed. Please go back and try again.";
    }
} else {
    // Form was not submitted, show an error
    echo "Form submission error. Please try again.";
}
?>