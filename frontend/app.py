from flask import Flask, render_template, request, redirect, abort, make_response
from utils import get_location, get_trip_data, get_airports
from plot import create_map

import json

app = Flask(__name__)

@app.route("/")  # Home page, delete cookies
def index():
    resp = make_response("HOME <a href='/start'> click para empezar</a>")
    resp.delete_cookie("passenger_number")
    resp.delete_cookie("destination")
    resp.delete_cookie("date")
    resp.delete_cookie("airport")
    resp.delete_cookie("airport_coords")
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
        resp = make_response(redirect("/airport-dest-select"))
        resp.set_cookie("passenger_number", request.values.get("passenger_number"))
        resp.set_cookie("destination", request.values.get("destination"))
        resp.set_cookie("date", request.values.get("date"))
        return resp
    return render_template("first.html")  # Render the form if it's not filled


@app.route("/airport-dest-select", methods=["GET", "POST"])
def airport_select():
    if (
        request.method == "POST"
        and request.values.get("airport")
        and request.values.get("airport_coords")
    ):  # Check if the form is filled
        resp = make_response(redirect("/passengers"))
        resp.set_cookie("airport_dest", request.values.get("airport"))
        resp.set_cookie("airport_dest_coords", request.values.get("airport_coords"))
        return resp  # Set the airport cookie and redirect to the next page
    return render_template(
        "airport-select.html",
        point="origin",
        airports=get_airports([get_location(request.cookies.get("destination"))]),
    )


@app.route("/passengers", methods=["POST", "GET"])
def passenger_locations():  # Get location of each member for calculating the optimal route
    if request.method == "POST":
        resp = make_response(redirect("/airport-origin-select"))
        for i in range(
            int(request.cookies.get("passenger_number"))
        ):  # Check if all passengers have a location defined
            if not request.values.get(f"passenger{i}_location"):
                return redirect("/passengers")  # If not, redirect to the same page
            resp.set_cookie(
                f"passenger{i}_location", request.values.get(f"passenger{i}_location")
            )
        return resp  # If all passengers have a location, redirect to the next page

    return render_template(  # Render the form if it's not filled
        "passenger-locations.html",
        passenger_number=int(request.cookies.get("passenger_number")),
    )


@app.route("/airport-origin-select", methods=["GET", "POST"])
def airport_dest_select():
    if (
        request.method == "POST"
        and request.values.get("airport")
        and request.values.get("airport_coords")
    ):  # Check if the form is filled
        resp = make_response(redirect("/calculate_route"))
        resp.set_cookie("airport_origin", request.values.get("airport"))
        resp.set_cookie("airport_origin_coords", request.values.get("airport_coords"))
        return resp  # Set the airport cookie and redirect to the next page
    return render_template(
        "airport-select.html",
        point="destination",
        airports=get_airports(
            [
                get_location(request.cookies.get(f"passenger{location}_location"))
                for location in range(int(request.cookies.get("passenger_number")))
            ]
        ),
    )


@app.route("/calculate_route", methods=["POST", "GET"])
def route():
    if (
        request.method == "POST"
    ):  # When a POST request is made, we start calculating the route (loading page has been rendered)
        locations = []
        for i in range(int(request.cookies.get("passenger_number"))):
            if not request.cookies.get(f"passenger{i}_location"):
                abort(400)
            locations.append(get_location(request.cookies.get(f"passenger{i}_location"))) # Get a list of the locations of all passengers
        
        return render_template(
            "route-description.html",
            data=get_trip_data(
                locations,
                request.cookies.get("airport_origin"),
                request.cookies.get("airport_dest"),
                json.loads(
                    request.cookies.get("airport_origin_coords").replace("'", '"')
                ),
                request.cookies.get("date"),
            ),
        )
    else:  # As the API call is quite slow, we render a loading page while the data is being fetched
        return render_template("loading.html")


@app.route("/summary", methods=["POST"])
def summary():
    return render_template("summary.html")