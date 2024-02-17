const jsgraphs = require('js-graph-algorithms');

exports.kruskalFunc = function(distmatrix){
    var len = distmatrix.length    
    var g = new jsgraphs.WeightedGraph(len); 
    for(let i=0;i<len;i++){
        for(let j=0;j<len;j++){
            if (i === j) continue
            g.addEdge(new jsgraphs.Edge(i,j,distmatrix[i][j]));
        }
    }
    var kruskal = new jsgraphs.KruskalMST(g); 
    var mst = kruskal.mst;
    var jsonObjs = []
    for(let i=0; i < mst.length; ++i) {
        var e = mst[i]
        var v = e.either();
        var w = e.other(v);
        jsonObjs[i] = {
            "origin": v,
            "destination": w,
            "weight": e.weight
        }
    }
    return jsonObjs; //esto lo devuelves a res
}
