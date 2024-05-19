import base64
from io import BytesIO
from mpl_toolkits.basemap import Basemap

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
matplotlib.use("Agg")


def create_map(locations, route, airport_coords):
    # setup Lambert Conformal basemap.
    m = Basemap(
        projection="mill",
        llcrnrlat=-90,
        urcrnrlat=90,
        llcrnrlon=-180,
        urcrnrlon=180,
        resolution="c",
    )
    plt.figure(figsize=(20,20))
    
    m.drawmapboundary(fill_color="aqua")
    # fill continents, set lake color same as ocean color.
    m.fillcontinents(color="coral", lake_color="aqua")
    # draw parallels and meridians.
    # label parallels on right and top
    # meridians on bottom and left
    parallels = np.arange(0.0, 81, 10.0)
    # labels = [left,right,top,bottom]
    m.drawparallels(parallels, labels=[False, True, True, False])
    meridians = np.arange(10.0, 351.0, 20.0)
    m.drawmeridians(meridians, labels=[True, False, False, True])
    # plot blue dot on Boulder, colorado and label it as such.
    loca=locations + airport_coords

    for loc in locations:
        xpt, ypt = m(float(loc["len"]), float(loc["lat"]))
        m.plot(xpt, ypt, "bo", markersize=1)
        plt.annotate(loc['loc'], (xpt, ypt), textcoords="offset points", xytext=(5,5), ha='center')  # Adjust xytext for label position
    xpt, ypt = m(float(airport_coords[0]["len"]), float(airport_coords[0]["lat"]))
    m.plot(xpt, ypt, "go")

    # print(loca)
    # for line in route:
    #     print(loca[line["destination"]])
    #     beginning = m(float(loca[line["origin"]]["len"]), float(loca[line["origin"]]["lat"]))
    #     end = m(float(loca[line["destination"]]["len"]), float(loca[line["destination"]]["lat"]))
    #     x_values = [beginning[0], end[0]]
    #     y_values = [beginning[1], beginning[1]]
        
    #     plt.plot(x_values, y_values, "bo", linestyle="-", markersize=10)
    #     plt.plot(0,0,"bo")
    #     print(x_values)


    # plt.legend()
    # plt.show()
    # Set the limits for the plot to zoom in on the area with data points
    plt.xlim(1000)
    plt.ylim(100)


    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    data = base64.b64encode(buf.getbuffer()).decode("ascii")
    return f"<img src='data:image/png;base64,{data}'/><p>Green: origin airport. Blue: passenger locations</p>"


if __name__ == "__main__":
    create_map()
