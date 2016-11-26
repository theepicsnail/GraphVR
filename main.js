function RandomUnitVector() {
  return new THREE.Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1 ).normalize();
}

function Graph () {
  this.nodes = new THREE.Geometry();
  this.edges = new THREE.Geometry();
  this.ngraph = require('ngraph.graph')();

  this.addNode = function (position, color) {
    var id = this.nodes.vertices.length;
    this.ngraph.addNode(id, {
      'pos': position,
      'color': color
    });
    this.nodes.vertices.push(position);
    this.nodes.colors.push(color);
    return id;
  }.bind(this);

  this.addEdge = function (source, dest) {
    this.ngraph.addLink(source, dest);
    this.edges.vertices.push(this.nodes.vertices[source]);
    this.edges.colors.push(this.nodes.colors[source]);

    this.edges.vertices.push(this.nodes.vertices[dest]);
    this.edges.colors.push(this.nodes.colors[dest]);
  }
}

function MakeTree(graph, pos, color, depth) {
  var id = graph.addNode(pos, color);
  if(!depth) return id;

  for(var i = 0; i<depth; i++){
    var childPos = RandomUnitVector().multiplyScalar(.1).add(pos);
    var childColor = color.clone().offsetHSL(Math.random()*.3-.15, 0, 0);
    var childId = MakeTree(graph, childPos, childColor, depth-1);
    graph.addEdge(id, childId);
  }
  return id;
}


function setupGraph() {
  var g = new Graph();
  MakeTree(g, new THREE.Vector3(0,1.5,1), new THREE.Color(0xff0000), 6);

  var group = new THREE.Group();
  var lines = new THREE.LineSegments(g.edges, new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors}));
  lines.frustumCulled = false;
  group.add(lines);

  group.add(new THREE.Points(g.nodes, new THREE.PointsMaterial({size:.1, vertexColors: THREE.VertexColors})));
  scene.add(group);

  return g;
}

function setupLayout(g) {
  var layout = require('ngraph.forcelayout3d')(g.ngraph);
  g.ngraph.forEachNode(function(node){
    if(node.id != 0) return;
    var pos = g.nodes.vertices[node.id];
    layout.setNodePosition(node.id, pos.x, pos.y, pos.z);
  });
  layout.pinNode(g.ngraph.getNode(0), true);
  return layout;
}

var graph = setupGraph();
var layout = setupLayout(graph);
window.update = function(timestamp){
  layout.step();
  graph.ngraph.forEachNode(function(node){
    var pos = layout.getNodePosition(node.id);
    var v = graph.nodes.vertices[node.id];
    v.set(pos.x, pos.y, pos.z);
  });
  graph.nodes.verticesNeedUpdate = true;
  graph.edges.verticesNeedUpdate = true;
}
setTimeout(run, 0);
