function RandomUnitVector() {
  return new THREE.Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1 ).normalize();
}

function RandomColor() {
  return new THREE.Color(0xFF).offsetHSL(Math.random(), 0,0);
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

function setupGraph() {
  var g = new Graph();

  var generator = require('ngraph.generators').factory(function(){
    var idMapper = {};
    function ensureNode(id) {
      if(idMapper[id] == undefined)
        idMapper[id] = g.addNode(RandomUnitVector(), RandomColor());
    }
    return {
      addLink(from, to) {
        ensureNode(to);
        ensureNode(from);
        console.log("link", from, to);
        g.addEdge(idMapper[from], idMapper[to]);
      },
      addNode(nodeId) {
        ensureNode(nodeId);
      },
      getNodesCount() {
        return g.nodes.vertices.length;
      }
    };
  });
  generator.grid3(3,4,5);


  var group = new THREE.Group();
  var lines = new THREE.LineSegments(g.edges, new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors}));
  lines.frustumCulled = false;
  group.add(lines);

  group.add(new THREE.Points(g.nodes, new THREE.PointsMaterial({size:.1, vertexColors: THREE.VertexColors})));
  scene.add(group);
  
  // Scale to a 'reasonable' size.
  // NGraph uses an ideal edge length of 30, which in VR means 30 meters.
  // Setting edge lengths in there impacts the physics in weird ways.
  // So instead, let ngraph use that size, we'll scale edges here.
  var scale = .5/ 30; // make each edge .5 meters.
  group.scale.set(scale,scale,scale);

  return g;
}


function setupLayout(g) {
  var layout = require('ngraph.forcelayout3d')(g.ngraph);

  g.nodes.vertices[0].x = 0;
  g.nodes.vertices[0].y = 0;
  g.nodes.vertices[0].z = -10;

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
  if(layout.step()) {
    window.update = function(){

    };
    console.log("Done");
  }

  graph.ngraph.forEachNode(function(node){
    var pos = layout.getNodePosition(node.id);
    var v = graph.nodes.vertices[node.id];
    v.set(pos.x, pos.y, pos.z);
  });
  graph.nodes.verticesNeedUpdate = true;
  graph.edges.verticesNeedUpdate = true;
}
setTimeout(run, 0);
