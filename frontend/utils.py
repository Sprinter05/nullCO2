from pprint import pprint
import requests

proxies = {
    "http": "http://localhost:8080",
}


def get_location(loc: str):  # Get the coordinates of a location string
    print(loc)
    a = requests.get(
        "http://127.0.0.1:3000/get_place",
        params={"name": loc},
        timeout=100,
    )
    pprint(a.content)
    return a.json()


def get_distance(origin, destination):  # Get the distance between two coordinates
    a = requests.get(
        "http://127.0.0.1:3000/calc_distance",
        params={
            "ogLat": origin["lat"],
            "ogLen": origin["lon"],
            "dtLat": destination["lat"],
            "dtLen": destination["lon"],
        },
        timeout=100,
    )
    return a.json()["distance"]


def get_airports(locations):  # Get the nearest airports to a list of coordinates
    locs = {}
    for i, l in enumerate(locations):
        locs[f"lat{i+1}"] = f"{l['lat']}"
        locs[f"len{i+1}"] = f"{l['lon']}"

    a = requests.get(
        f"http://127.0.0.1:3000/get_airport/{len(locations)}",
        params=locs,
        timeout=100,
        proxies=proxies,
    )
    return a.json()


def get_route(
    locations: list, airport: list[float, float]
):  # Get the optimal route between a list of coordinates and the coordinates of an airport
    loc = locations + airport

    matrix = [
        [get_distance(i, j) for j in loc] for i in loc
    ]  # distance matrix between locations

    return matrix


def get_flight(origin_airport, destination_airport, date): # Get list of flights between two airports
    print(origin_airport, destination_airport, date)
    a = requests.get(
        "http://127.0.0.1:3000/get_flight",
        params={
            "oIata": origin_airport,
            "dIata": destination_airport,
            "date": date,
        },
        timeout=100,
    )
    return list(a.json().values())


def get_trip_data(locations, destination_iata, destination_coords, date):
    origin = get_airports(locations)
    print(origin)
    if destination_iata is None or destination_coords is None:
        return {"error": "No se encontró aeropuerto"}
    route = get_route(
        locations,
        [
            {
                "lat": destination_coords.get("latitude"),
                "lon": destination_coords.get("longitude"),
            }
        ],
    )
    flight = get_flight(
        origin_airport="MAD", destination_airport="LAX", date=date
    )
    return {"airport": destination_iata, "route": route, "flight": flight}
