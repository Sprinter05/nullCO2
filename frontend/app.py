from flask import Flask, render_template, request, redirect, abort, make_response
from utils import get_location, get_trip_data, get_airports

app = Flask(__name__)


@app.route("/")  # Home page, delete cookies
def index():
    resp = make_response("HOME <a href='/start'> click para empezar</a>")
    resp.delete_cookie("passenger_number")
    resp.delete_cookie("destination")
    resp.delete_cookie("date")
    resp.delete_cookie("airport")
    return resp


@app.route("/start", methods=["GET", "POST"])
def start():
    if (  # Check if the form is filled
        request.method == "POST"
        and request.values.get("passenger_number")
        and request.values.get("destination")
        and request.values.get("date")
    ):
        # Set cookies with the form data
        resp = make_response(redirect("/airport-select"))
        resp.set_cookie("passenger_number", request.values.get("passenger_number"))
        resp.set_cookie("destination", request.values.get("destination"))
        resp.set_cookie("date", request.values.get("date"))
        return resp
    return render_template("first.html")  # Render the form if it's not filled


@app.route("/airport-select", methods=["GET", "POST"])
def airport_select():
    if request.method == "POST" and request.values.get(
        "airport"
    ):  # Check if the form is filled
        resp = make_response(redirect("/passengers"))
        resp.set_cookie("airport", request.values.get("airport"))
        return resp  # Set the airport cookie and redirect to the next page
    return render_template(
        "airport-select.html",
        airports=get_airports([get_location(request.cookies.get("destination"))]),
    )


@app.route("/passengers", methods=["POST", "GET"])
def passenger_locations():  # Get location of each member for calculating the optimal route
    if request.method == "POST":
        resp = make_response(redirect("/calculate_route"))
        for i in range(int(request.values.get("passenger_number"))):
            if not request.values.get(f"passenger{i}_location"):
                return redirect("/passengers")
            resp.set_cookie(
                f"passenger{i}_location", request.values.get(f"passenger{i}_location")
            )
        return resp
    return render_template(
        "passenger-locations.html",
        passenger_number=int(request.cookies.get("passenger_number")),
    )


@app.route("/calculate_route", methods=["POST", "GET"])
def route():
    if request.method == "POST":
        locations = []
        for i in range(int(request.cookies.get("passenger_number"))):
            if not request.values.get(f"passenger{i}_location"):
                abort(400)
            locations.append(get_location(request.values.get(f"passenger{i}_location")))
        return render_template(
            "route-description.html",
            data=get_trip_data(
                locations, request.cookies.get("airport"), request.cookies.get("date")
            ),
        )
    else:
        return render_template("loading.html")
