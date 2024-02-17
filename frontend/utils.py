import requests

proxies = {
#    'http': 'http://localhost:8080',
}


def get_location(loc: str):
    a = requests.get(
        "http://127.0.0.1:3000/get_place", params={"name": loc}, timeout=100
    )
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


def get_airport(locations):
    locs = {}
    for i, l in enumerate(locations):
        locs[f"lat{i+1}"] = f"{l['lat']}"
        locs[f"len{i+1}"] = f"{l['lon']}"

    a = requests.get(
        f"http://127.0.0.1:3000/get_airport/{len(locations)}", params=locs, timeout=100, proxies=proxies
    )
    return a.json()


def get_route(locations: list, airport: list[float, float]):
    loc = locations + airport
    matrix = [
        [get_distance(i, j) for j in loc] for i in loc
    ]  # distance matrix between locations
    return matrix
