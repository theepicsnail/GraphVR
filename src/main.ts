import {ControllerUI} from "./controller_ui";
import {PointCloud} from "./point_cloud";
import {controller, run, scene, setFrameCB} from "./setup";

function gaussIteratedMap(alpha, beta) {
  // Returns a function that will map x->exp(-alpha*x^2) + beta
  // https://en.wikipedia.org/wiki/Gauss_iterated_map
  return function(x) { return Math.exp(-alpha * x * x) + beta; }
}

function generatePlot(): THREE.Points {
  let cloud = new PointCloud();
  for (let _ = 0; _ < 100000; _++) { // Different Parameter choices
    let alpha = Math.random() * 2 + 4.5;
    let beta = Math.random() * 2 - 1;

    let gim = gaussIteratedMap(alpha, beta);
    let x = 0;
    let count = Math.random() * 10 + 40;
    while (count-- > 0) {
      x = gim(x);
    }
    cloud.addPoint(x, alpha - 4.5, beta);
  }
  return cloud.points;
}

var plot = generatePlot();
scene.add(plot);
let c = new ControllerUI(controller);
setFrameCB(function(timestamp) { c.onFrame(timestamp); });
setTimeout(run, 0);
