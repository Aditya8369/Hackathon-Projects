from flask import Flask, render_template
import json

app = Flask(__name__)

def load_data(file):
    with open(file, "r") as f:
        return json.load(f)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/colleges")
def colleges():
    data = load_data("data/colleges.json")
    return render_template("colleges.html", colleges=data)

@app.route("/careers")
def careers():
    data = load_data("data/careers.json")
    return render_template("careers.html", careers=data)

@app.route("/planner")
def planner():
    holidays = load_data("data/holidays.json")
    return render_template("planner.html", holidays=holidays)

if __name__ == "__main__":
    app.run(debug=True)
