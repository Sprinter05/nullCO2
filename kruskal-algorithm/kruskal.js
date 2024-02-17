const jsgraphs = require('js-graph-algorithms');

//TODO Importar los datos de la API de samuel (distancias y contaminación)
exports.kruskal = function(){
    var contamin = 30;
    const dist = [1,2,3,4,5,6,7,8,9,10];
    var g = new jsgraphs.WeightedGraph(6); // 10 is the number vertices in the graph
    g.addEdge(new jsgraphs.Edge(0, 1,contamin*dist[0])); // add undirected edge connecting vertex 0 to vertex 5
    g.addEdge(new jsgraphs.Edge(0, 2,contamin*dist[1]));
    g.addEdge(new jsgraphs.Edge(0, 3,contamin*dist[2]));
    g.addEdge(new jsgraphs.Edge(0, 4,contamin*dist[3]));
    g.addEdge(new jsgraphs.Edge(0, 5,contamin*dist[4]));
    g.addEdge(new jsgraphs.Edge(1, 2,contamin*dist[5]));
    g.addEdge(new jsgraphs.Edge(1, 5,contamin*dist[6]));
    g.addEdge(new jsgraphs.Edge(3, 2,contamin*dist[7]));
    g.addEdge(new jsgraphs.Edge(3, 4,contamin*dist[8]));
    g.addEdge(new jsgraphs.Edge(4, 5,contamin*dist[9]));

    var kruskal = new jsgraphs.KruskalMST(g); 
    var mst = kruskal.mst;
    var wgt = 0;
    for(var i=0; i < mst.length; ++i) {
        var e = mst[i];
        var v = e.either();
        var w = e.other(v);
        console.log('(' + v + ', ' + w + '): ' + e.weight);
        wgt = wgt + e.weight;
        console.log(wgt);
    }
}