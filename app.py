import flask 
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")


@app.route("/python-course")
def python_course():
    return render_template("python-course.html")


@app.route("/design-fundamentals")
def design_fundamentals():
    return render_template("design-fundamentals.html")


@app.route("/practice-challenges")
def practice_challenges():
    return render_template("practice-challenges.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    success = False

    if request.method == "POST":
        password = request.form.get("password", "").strip()
        if password == "ampro":
            success = True
        else:
            error = "Invalid password. Please try again."

    return render_template("login.html", error=error, success=success)


@app.route('/pro')
def pro():
    # pro.html relies on a one-time in-memory postMessage from the opener.
    return render_template('pro.html')


if __name__ == "__main__":
    app.run(debug=True) 