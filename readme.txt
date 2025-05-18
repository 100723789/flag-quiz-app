WORLD FLAG QUIZ - README

Overview:

This project is a simple and fun web-based quiz where players guess the flags of countries around the world.
It uses a Flask backend to serve flag questions and a frontend built with HTML, CSS, and JavaScript.

The game includes:

- A start menu
- Option selection (difficulty and number of questions)
- An interactive quiz page
- A results page showing final performance

File Structure:

/static/
    - style.css        : Contains all styling for the frontend (buttons, layout, colors, etc.)
    - script.js        : Handles the logic for fetching questions, checking answers, updating score, and localStorage management.

templates/
    - index.html       : Home page with "Play" and "Options" buttons.
    - play.html        : Main quiz page where questions are displayed.
    - options.html     : Page where players select difficulty (easy/medium/hard) and question limit (20/50).
    - results.html     : Final page showing the number of correct answers.

app.py:
    - The Flask backend serving the frontend and providing flag questions.

flags.py:
    - Contains flag data (flag image links and answers).


How the Game Works:

1. The player starts on the home page (index.html) and can either Play or change Options.
2. On the Options page, they can set:
    - Difficulty: Easy / Medium / Hard
    - Number of questions: 20 or 50
3. Once playing:
    - The app fetches random flag questions from the server.
    - The player selects an answer from multiple options.
    - Correct answers increase the player's score.
4. After answering all questions, the player sees a final results page with their score.

Technical Details:

- localStorage is used to remember the player's current score, current question number, difficulty level, and number of questions across page reloads.
- Fetch API (fetch()) is used for backend communication (get questions and check answers).
- Button styling dynamically updates to show selected options.
- Responsive design ensures it works on both desktop and mobile devices.

Notes:

- Make sure the Flask server is running to fetch questions properly.



