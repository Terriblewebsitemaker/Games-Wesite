import flask 
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return "My Contact Page!"


@app.route("/login")
def login():
    return "Login Here!"


app.run()