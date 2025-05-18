// Run this code when the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    fetchQuestion(); // Start the quiz by fetching the first question

    // Get score from localStorage or set it to 0 if not found
    const score = localStorage.getItem("quizScore") || 0;
    const messageEl = document.querySelector(".scoremessage span");
    const scoreEl = document.querySelector(".userpoints span");

    // Display the current score
    if (messageEl) messageEl.innerText = score;
    if (scoreEl) scoreEl.innerText = `/${questionLimit}`;

    // Set the selected button state based on saved settings
    setSelectedButtonState();

    // If finished, reset question and score for next game
    if (currentQuestion > questionLimit) {
        localStorage.setItem("currentQuestion", 1); // Reset question number
        localStorage.setItem("quizScore", 0); // Reset score
    }
});

// Get difficulty and question limit from localStorage or set default values
const difficulty = localStorage.getItem("difficulty") || "easy";
const questionLimit = parseInt(localStorage.getItem("questionCount") || "20");
let currentScore = parseInt(localStorage.getItem("quizScore") || "0");
let currentQuestion = parseInt(localStorage.getItem("currentQuestion") || "1");

// Set the selected button state based on saved settings
function setSelectedButtonState() {
    // Set difficulty button as selected
    const difficultyButtons = document.querySelectorAll(".difficulty-button");
    difficultyButtons.forEach(button => {
        if (button.innerText.toLowerCase() === difficulty) {
            button.classList.add("selected"); // Highlight selected button
            button.style.backgroundColor = "white"; // Set selected color
        } else {
            button.classList.remove("selected"); // Remove selection
            button.style.backgroundColor = ""; // Reset color
        }
    });

    // Set question limit button as selected
    const questionLimitButtons = document.querySelectorAll(".question-limit-button");
    questionLimitButtons.forEach(button => {
        if (parseInt(button.innerText) === questionLimit) {
            button.classList.add("selected"); // Highlight selected button
            button.style.backgroundColor = "green"; // Set selected color
        } else {
            button.classList.remove("selected"); // Remove selection
            button.style.backgroundColor = ""; // Reset color
        }
    });
}

// Handle button selection and save settings
function selectButton(button, type) {
    const buttons = document.querySelectorAll(`.${type}-button`);
    buttons.forEach(btn => {
        btn.classList.remove("selected"); // Remove previous selection
        btn.style.backgroundColor = ""; // Reset color
    });

    button.classList.add("selected"); // Add selected class
    button.style.backgroundColor = "green"; // Highlight selected button

    // Save selected difficulty or question count to localStorage
    if (type === "difficulty") {
        localStorage.setItem("difficulty", button.innerText.toLowerCase());
    } else if (type === "question-limit") {
        localStorage.setItem("questionCount", button.innerText);
    }
}

// Add click event to difficulty buttons
document.querySelectorAll(".difficulty-button").forEach(button => {
    button.addEventListener("click", () => selectButton(button, "difficulty"));
});

// Add click event to question limit buttons
document.querySelectorAll(".question-limit-button").forEach(button => {
    button.addEventListener("click", () => selectButton(button, "question-limit"));
});

// Fetch a question from the server
async function fetchQuestion() {
    // Check if the quiz is finished
    if (currentQuestion > questionLimit) {
        alert(`Quiz Finished! Your score: ${currentScore}/${questionLimit}`); // Show final score
        localStorage.setItem("quizScore", currentScore); // Save score
        localStorage.setItem("currentQuestion", 1); // Reset for new quiz
        window.location.href = "/"; // Redirect to home page
        return;
    }

    try {
        const response = await fetch("/get_question"); // Fetch question from server
        const data = await response.json(); // Parse JSON response

        // Display the flag image
        document.querySelector(".flagimage img").src = data.flag;

const optionsList = document.querySelector(".flagoptions ul");
optionsList.innerHTML = ""; // Clear previous options

// Create option buttons
data.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option; // Set option text
    li.classList.add("option-button"); // Add class

    // ✅ Use addEventListener instead of li.onclick
    li.addEventListener("click", () => {
        checkAnswer(li, option, data.correct); // Add click event
    });

    optionsList.appendChild(li); // Add to list
});


        updateQuestionNumber(); // Update question number after loading
    } catch (error) {
        console.error("Error fetching question:", error); // Log errors
    }
}

// Update question number on page
function updateQuestionNumber() {
    localStorage.setItem("currentQuestion", currentQuestion); // Save current question
    document.querySelector(".question-number").innerText = `${currentQuestion}/${questionLimit}`; // Update display
    currentQuestion++; // Increment question number
}

// Check the answer selected by the user
async function checkAnswer(element, answer, correct) {
    try {
        const response = await fetch("http://127.0.0.1:5000/check_answer", {
            method: "POST", // Send POST request
            headers: { "Content-Type": "application/json" }, // Set headers
            body: JSON.stringify({ answer, correct }) // Send selected answer
        });

        const result = await response.json(); // Parse server response

        if (result.correct) {
            element.style.backgroundColor = "green"; // Highlight correct answer
            element.classList.add("correct"); // Add correct class
            currentScore++; // Increase score
            localStorage.setItem("quizScore", currentScore); // Save updated score
        } else {
            element.style.backgroundColor = "red"; // Highlight incorrect answer
            element.classList.add("incorrect"); // Add incorrect class
        }

        // Update displayed score
        document.querySelector(".scoremessage span").innerText = currentScore;

        setTimeout(fetchQuestion, 1000); // Load next question after delay
    } catch (error) {
        console.error("Error checking answer:", error); // Log errors
    }
}
