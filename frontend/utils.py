from pprint import pprint
import requests

proxies = {
       'http': 'http://localhost:8080',
}


def get_location(loc: str):
    a = requests.get(
        "http://127.0.0.1:3000/get_place", params={"name": loc}, timeout=100, proxies=proxies
    )
    pprint(a)
    return a.json()


def get_distance(origin, destination):
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


def get_airports(locations):
    pprint(locations)
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


def get_route(locations: list, airport: list[float, float]):
    loc = locations + airport

    matrix = [
        [get_distance(i, j) for j in loc] for i in loc
    ]  # distance matrix between locations
    return matrix


def get_flight(origin_airport, destination_airport, date):
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
    return a.json()


def get_trip_data(locations, destination_airport, date):
    airport = get_airports(locations).get("0")
    if airport is None:
        return {"error": "No se encontró aeropuerto"}
    route = get_route(
        locations,
        [
            {
                "lat": airport.get("coords").get("latitude", 0),
                "lon": airport.get("coords").get("longitude"),
            }
        ],
    )
    flight = get_flight(airport["iata"], destination_airport, date) # TODO: falta la API de los codigos de los aeropuertos
    return {"airport": airport, "route": route, "flight": flight}
