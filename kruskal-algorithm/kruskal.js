const jsgraphs = require('js-graph-algorithms');


exports.kruskal = function(distmatrix){
    var g = new jsgraphs.WeightedGraph(n); 
    for(let i=0;i<distmatrix.length();i++){
        for(let j=0;j<distmatrix.length();j++){
            g.addEdge(i,(i+1),distmatrix[i][j]);
        }
    }
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