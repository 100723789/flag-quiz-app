from flask import Flask, render_template, request, jsonify, url_for  # Import Flask functions
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
    if difficulty == "easy":
        filtered_flags = easy_flags
        option_count = 4
        incorrect_answers_count = 3
    else:
        filtered_flags = medium_flags if difficulty == "medium" else hard_flags
        option_count = 4
        incorrect_answers_count = 3

    # Randomly select a question
    question = random.choice(filtered_flags)

    # Get incorrect options excluding the correct one
    incorrect_answers = random.sample(
        [f["country"] for f in filtered_flags if f["country"] != question["country"]],
        incorrect_answers_count
    )

    # Combine and shuffle options
    options = incorrect_answers + [question["country"]]
    random.shuffle(options)

    # Ensure exactly the right number of options
    assert len(options) == option_count, f"Expected {option_count} options, got {len(options)}"

    return jsonify({
        "flag": url_for('static', filename=question["image"]),  # Use Flask static URL
        "correct": question["country"],
        "options": options
    })

@app.route("/check_answer", methods=["POST"])  # Route to check the answer
def check_answer():
    data = request.json
    user_answer = data.get("answer")
    correct_answer = data.get("correct")

    return jsonify({"correct": user_answer == correct_answer})

if __name__ == "__main__":
    app.run(debug=True)  # Only for local testing
