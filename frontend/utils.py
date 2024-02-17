import requests


def get_location(loc: str):
    a = requests.get(
        "http://127.0.0.1:3000/get_place", params={"name": loc}, timeout=100
    )
    return a.json()


def get_distance(origin, destination):
    print(origin)
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


def get_route(locations: list):
    matrix = [[get_distance(i, j) for j in locations] for i in locations] # distance matrix between locations
    return matrix
