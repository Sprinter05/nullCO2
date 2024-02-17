from pprint import pprint
import requests
from plot import create_map

# For debugging purposes
# proxies = {
#     "http": "http://localhost:8080",
# }


def get_location(loc: str):  # Get the coordinates from a user-provided location
    a = requests.get(
        "http://127.0.0.1:3000/get_place",
        params={"name": loc},
        timeout=100,
        # proxies=proxies,
    )
    return a.json()


def get_distance(origin, destination):  # Get the distance between two coordinates
    a = requests.get(
        "http://127.0.0.1:3000/calc_distance",
        params={
            "ogLat": origin["lat"],
            "ogLen": origin["len"],
            "dtLat": destination["lat"],
            "dtLen": destination["len"],
        },
        # proxies=proxies,
        timeout=100,
    )
    return a.json()["distance"]


def get_airports(locations):  # Get the nearest airports to a list of coordinates
    locs = {}
    for i, l in enumerate(locations):
        locs[f"lat{i+1}"] = f"{l['lat']}"
        locs[f"len{i+1}"] = f"{l['len']}"

    a = requests.get(
        f"http://127.0.0.1:3000/get_airport/{len(locations)}",
        params=locs,
        timeout=100,
        # proxies=proxies,
    )
    return a.json()


def get_route(
    locations: list, airport: list[float, float]
):  # Get the optimal route between a list of coordinates and the coordinates of an airport
    loc = locations + airport
    print(locations)

    matrix = [
        [get_distance(i, j) for j in loc] for i in loc
    ]  # distance matrix between locations

    params = {
        "matrix": "[" + ",".join([str(i) for i in matrix]) + "]"
    }  # Convert the matrix to a string

    a = requests.get(
        "http://127.0.0.1:3000/kruskal_algorithm",
        params={
            "matrix": "["
            + ",".join([str(i) for i in matrix])
            + "]",  # Convert the matrix to a string
        },
        # proxies=proxies,
        timeout=100,
    )
    print(a.content)
    print(params)
    return a.json()


def get_flight(
    origin_airport, destination_airport, date
):  # Get list of flights between two airports
    a = requests.get(
        "http://127.0.0.1:3000/get_flight",
        params={
            "ogIata": origin_airport,
            "dtIata": destination_airport,
            "date": date,
        },
        timeout=100,
    )

    pprint(a.json())
    return list(a.json().values())


def get_trip_data(locations, origin_iata, destination_iata, origin_coords, date):
    if destination_iata is None or origin_coords is None:
        return {"error": "No se encontró aeropuerto"}
    route = get_route(
        locations,
        [
            {
                "lat": origin_coords.get("latitude"),
                "len": origin_coords.get("longitude"),
            }
        ],
    )
    flight = get_flight(
        origin_airport=origin_iata, destination_airport=destination_iata, date=date
    )
    return {
        "route": route,
        "flight": flight,
        "map": create_map(
            locations,
            route,
            [
                {
                    "lat": origin_coords.get("latitude"),
                    "len": origin_coords.get("longitude"),
                }
            ],
        ),
    }
