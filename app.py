from flask import Flask, render_template, request, jsonify  # Import Flask functions
import random  # Import random module
from flask_cors import CORS  # Import CORS to allow cross-origin requests
from flags import easy_flags, medium_flags, hard_flags  # Import flag data from flags.py

app = Flask(__name__)  # Create a Flask app
CORS(app)  # Enable CORS for the app

@app.route("/")  # Route for the home page
def home():
    return render_template("index.html")  # Render the home page template

@app.route("/play")  # Route for the play page
def play():
    return render_template("play.html")  # Render the play page template

@app.route("/options")  # Route for the options page
def options():
    return render_template("options.html")  # Render the options page template

@app.route("/get_question", methods=["GET"])  # Route to get a question
def get_question():
    difficulty = request.args.get('difficulty', 'easy')  # Get difficulty from request, default to easy

    # Select the appropriate set of flags based on the difficulty
    if difficulty == "easy":  # If difficulty is easy
        filtered_flags = easy_flags  # Use easy flags
        option_count = 4  # Number of options
        incorrect_answers_count = 3  # Number of incorrect options
    else:  # For medium or hard difficulty
        filtered_flags = medium_flags if difficulty == "medium" else hard_flags  # Choose medium or hard flags
        option_count = 4  # Number of options
        incorrect_answers_count = 3  # Number of incorrect options

    # Randomly select a question from the filtered flags
    question = random.choice(filtered_flags)  # Pick a random flag

    # Get incorrect options (sample from the filtered flags excluding the correct answer)
    incorrect_answers = random.sample(
        [f["country"] for f in filtered_flags if f["country"] != question["country"]],  # Exclude correct answer
        incorrect_answers_count  # Number of incorrect options to pick
    )

    # Combine correct answer with the incorrect answers
    options = incorrect_answers + [question["country"]]  # Add correct answer to options

    # Shuffle the options to randomize the order
    random.shuffle(options)  # Shuffle the options list

    # Ensure that the number of options is exactly as needed
    assert len(options) == option_count, f"Expected {option_count} options, but got {len(options)}"  # Check option count

    return jsonify({  # Return the question data as JSON
        "flag": question["image"],  # URL of the flag image
        "correct": question["country"],  # Correct country name
        "options": options  # List of options
    })

@app.route("/check_answer", methods=["POST"])  # Route to check the answer
def check_answer():
    data = request.json  # Get the JSON data from the request
    user_answer = data.get("answer")  # Get the user's answer
    correct_answer = data.get("correct")  # Get the correct answer

    return jsonify({"correct": user_answer == correct_answer})  # Return whether the answer is correct

if __name__ == "__main__":  # If running this file directly
    app.run(debug=True)  # Run the Flask app in debug mode
