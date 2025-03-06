from flask import Flask, jsonify, render_template

app = Flask(__name__)

# Load questions from JSON file
import json

with open("questions.json", "r", encoding="utf-8") as file:
    questions = json.load(file)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/questions")
def get_questions():
    return jsonify(questions)


if __name__ == "__main__":
    app.run(debug=True)
