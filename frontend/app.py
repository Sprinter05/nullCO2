from flask import Flask, render_template, request, redirect, abort
from utils import get_location, get_route

app = Flask(__name__)


@app.route("/")
def index():
    return "HOME <a href='/start'> click para empezar</a>"


@app.route("/start")
def start():
    return render_template("first.html")


@app.route("/passengers", methods=["POST", "GET"])
def passenger_locations():  # Get location of each member
    if (
        request.method == "POST"
        and request.values.get("destination")
        and request.values.get("passenger_number")
    ):
        return render_template(
            "passenger-locations.html",
            passenger_number=int(request.values.get("passenger_number")),
            destination=request.values.get("destination"),
        )
    elif request.method == "POST":
        return redirect("/first")
    else:
        pass


@app.route("/calculate_route", methods=["POST", "GET"])
def route():
    if (
        request.method == "POST"
        and request.values.get("destination")
        and request.values.get("passenger_number")
    ):
        locations = []
        for i in range(int(request.values.get("passenger_number"))):
            if not request.values.get(f"passenger{i}_location"):
                print(f"passenger{i}")
                abort(400)
            locations.append(get_location(request.values.get(f"passenger{i}_location")))
    return get_route(locations)