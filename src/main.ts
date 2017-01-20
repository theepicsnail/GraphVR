
import {run, scene, setFrameCB, controller} from "./setup";

function RandomUnitVector() {
  var U = Math.random();
  var V = Math.random();
  var theta = 2 * Math.PI * U;
  var phi = Math.acos(2 * V - 1);
  var u = Math.cos(phi);
  var x = Math.sqrt(1 - u * u) * Math.cos(theta);
  var y = Math.sqrt(1 - u * u) * Math.sin(theta);
  var z = u;

  return new THREE.Vector3(x, y, z)
}

function RandomColor() {
  return new THREE.Color(0xFF).offsetHSL(Math.random(), 0, 0);
}

function Graph() {
  this.nodes = new THREE.Geometry();
  this.edges = new THREE.Geometry();
  this.ngraph = require('ngraph.graph')();

  this.addNode = function(position, color) {
    var id = this.nodes.vertices.length;
    this.ngraph.addNode(id, {'pos' : position, 'color' : color});
    this.nodes.vertices.push(position);
    this.nodes.colors.push(color);
    return id;
  }.bind(this);

  this.addEdge = function(source, dest) {
    this.ngraph.addLink(source, dest);
    this.edges.vertices.push(this.nodes.vertices[source]);
    this.edges.colors.push(this.nodes.colors[source]);

    this.edges.vertices.push(this.nodes.vertices[dest]);
    this.edges.colors.push(this.nodes.colors[dest]);
  }
}

function scale(input, srcmin, srcmax, dstmin, dstmax) {
  return (input * 1.0 - srcmin) / srcmax * (dstmax - dstmin) + dstmin;
}

var PC = false;
const N = 10000;
var group = new THREE.Group();
var nodes = new THREE.Geometry();

for (var alphaPercent = 0; alphaPercent < 100; alphaPercent += 2)
  for (var betaPercent = 0; betaPercent < 100; betaPercent += .2) {
    var alpha = scale(alphaPercent, 0, 100, 4, 8);
    var beta = scale(betaPercent, 0, 100, -1, 1);
    var x = 0;
    for (var i = 0; i < 50; i++) {
      x = Math.exp(-alpha * x * x) + beta;
      if (i < 40)
        continue;

      var v = new THREE.Vector3(             //
          scale(x, -1, 1, -1, 1),            //
          scale(alphaPercent, 0, 100, 0, 2), //
          scale(beta, -1, 1, -1, 1),         //
          );
      nodes.vertices.push(v);
      let c = new THREE.Color();
      c.setRGB(scale(v.x, -1, 1, 0, 1), //
               scale(v.y, 0, 2, 0, 1),  //
               scale(v.z, -1, 1, 0, 1));
      nodes.colors.push(c)
    }
  }

//  nodes.vertices.push(RandomUnitVector());

var points = new THREE.Points(
    nodes,
    new THREE.PointsMaterial(
        {size : PC ? .05 : .001, vertexColors : THREE.VertexColors}));
points.frustumCulled = false;
window.g = group;
group.add(points);

scene.add(group);
// Scale
window.c = controller;


var geometry = new THREE.SphereGeometry( .01, 32, 32 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh(geometry, material);
controller.add(cube);
var c2 = cube.clone();
c2.translateZ(-.0762); // 3 inches in meters
c2.scale.multiplyScalar(.5);
controller.add(c2);




let size = 24;
let text = "Hello world";

					var canvas = document.createElement("canvas");
					canvas.width = 256;
					canvas.height = 256;
					var context = canvas.getContext("2d");
					context.font = size + "px Monospace";
					//context.textAlign = "center";

					var texture = new THREE.Texture(canvas);
					texture.needsUpdate = true;
					var material = new THREE.MeshBasicMaterial({
						map : texture
					});
					var mesh = new THREE.Mesh(new THREE.PlaneGeometry(.3, .3), material);
					mesh.scale.divideScalar(5);


mesh.translateY(.01);
mesh.rotateX(-Math.PI/2);


var showingMenu = false;
controller.on(controller.MenuPressed, ()=>{
	showingMenu = true;
	controller.add(mesh);

});
controller.on(controller.MenuUnpressed, ()=>{
	showingMenu = false;
	controller.remove(mesh);
});




var C = 0;
setFrameCB(function(timestamp) {
	if(showingMenu){

		context.fillStyle = "black";
		context.fillRect(0, 0, 600, 600);
		context.fillStyle = "white";
		context.fillText("x: " + controller.position.x.toFixed(4), 0, 20);
		context.fillText("y: " + controller.position.y.toFixed(4), 0, 40);
		context.fillText("z: " + controller.position.z.toFixed(4), 0, 60);
		texture.needsUpdate = true;


	}
  /*var t = timestamp*.01;

  var A = Math.random() * t * Math.PI * 100;
  var B = Math.random() * t * Math.PI * 100;
  let x = Math.cos(t*A);
  let y = Math.sin(t*A) * Math.sin(t*B);
  let z = Math.sin(t*A) * Math.cos(t*B);
  x *= 1;
  y *= 1;
  z *= 1;
  nodes.vertices[C].x = x;
  nodes.vertices[C].y = y;
  nodes.vertices[C].z = z;
  C = (C+1)%N;
  nodes.verticesNeedUpdate = true;*/
});

setTimeout(run, 0);
