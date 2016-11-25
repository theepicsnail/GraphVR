setTimeout(run, 0);
var lastRender = 0;
var localUpdate;
window.update = function(timestamp) {
  var delta = (Math.min(timestamp - lastRender, 11));
  lastRender = timestamp;
  localUpdate && localUpdate(delta);
}


function RandomUnitVector() {
  return new THREE.Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1 ).normalize();
}

false && (function(){
  var segments = 100;
  var geometry = new THREE.BufferGeometry();
  var positions = new Float32Array( segments * 3 );
  var colors = new Float32Array( segments * 3 );
  var r = .8;
  for ( var i = 0; i < segments; i ++ ) {
  	var x = Math.random() * r - r / 2;
  	var y = Math.random() * r - r / 2;
  	var z = Math.random() * r - r / 2;
  	// positions
  	positions[ i * 3 ] = x;
  	positions[ i * 3 + 1 ] = y+1.5;
  	positions[ i * 3 + 2 ] = z;
  	// colors
  	colors[ i * 3 ] = ( x / r ) + 0.5;
  	colors[ i * 3 + 1 ] = ( y / r ) + 0.5;
  	colors[ i * 3 + 2 ] = ( z / r ) + 0.5;
  }
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
  geometry.computeBoundingSphere();

  scene.add(  new THREE.Line( geometry,  new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors }) ));
  scene.add( new THREE.Points(geometry, new THREE.PointsMaterial({size:.01, vertexColors:THREE.VertexColors})) );
})();
false && (function(){
  function RandomUnitVector() {
    return new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1 ).normalize();

  }

  var lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors});
  var pointMaterial = new THREE.PointsMaterial({
    size:.02,
    vertexColors: THREE.VertexColors});

  function MakeTree(from, color, depth) {
    if(depth == 0) {return [];}

    var lines = [];
    for(var i = Math.random()*2+2; i > 0 ; i-=1){
      var child = RandomUnitVector().multiplyScalar(depth*depth/25).add(from);
      var childColor = color.clone().offsetHSL(Math.random()*.5, 0, 0);

      var geometry = new THREE.Geometry();
      geometry.vertices.push(from);
      geometry.colors.push(color);

      geometry.vertices.push(child);
      geometry.colors.push(childColor);

      lines.push(new THREE.Line(geometry, lineMaterial));
      lines.push(new THREE.Points( geometry, pointMaterial))

      lines.push.apply(lines, MakeTree(child, childColor, depth-1));
    }

    return lines;
  }


  var toWiggle = [];
  MakeTree(new THREE.Vector3(0,1.5,0),
           new THREE.Color(0xff0000),
           5).forEach(function(line){

    scene.add(line);
    if(line.type=="Line" && Math.random() < .2) {
      toWiggle.push(line.geometry);
    }
  });

  localUpdate = function(delta) {
    if(delta <0) return;
    toWiggle.forEach(function(p){
      //p.vertices[0].x += Math.sin(lastRender/100000.0)*.001*delta;
      //p.vertices[0].z += Math.cos(lastRender/200000.0)*.001*delta;
      //p.vertices[0].y += Math.cos(lastRender/300000.0)*.001*delta;
      //p.verticesNeedUpdate = true;

      p.colors[0].offsetHSL(delta/1000/2,0,0);
      p.colorsNeedUpdate = true;
    });
  }

})();
true && (function(){


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

  var g = new Graph();
  MakeTree(g, new THREE.Vector3(0,1.5,1), new THREE.Color(0xff0000), 6);

  var group = new THREE.Group();
  var lines = new THREE.LineSegments(g.edges, new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors}));
  lines.frustumCulled = false;
  group.add(lines);


  //  group.add(new THREE.Points(g.nodes, new THREE.PointsMaterial({size:.1, vertexColors: THREE.VertexColors})));
  console.log("--");
  console.log("N:", g.nodes.vertices.length);
  console.log("E:", g.edges.vertices.length);
  scene.add(group);
  window.g = g;


  var layout = require('ngraph.forcelayout3d')(g.ngraph);
  window.layout = layout;
  g.ngraph.forEachNode(function(node){
    if(node.id != 0) return;
    var pos = g.nodes.vertices[node.id];
    layout.setNodePosition(node.id, pos.x, pos.y, pos.z);
  });
  layout.pinNode(g.ngraph.getNode(0), true);


  setTimeout(function(){
    setInterval(function(){
      layout.step();
      g.ngraph.forEachNode(function(node){
        var pos = layout.getNodePosition(node.id);
        var v = g.nodes.vertices[node.id];
        v.set(pos.x, pos.y, pos.z);
      });
      //g.nodes.verticesNeedUpdate = true;
      g.edges.verticesNeedUpdate = true;
    }, 0);
    setInterval(function() {
      console.log(layout.getGraphRect());
    }, 1000);

  }, 1000);
})();
