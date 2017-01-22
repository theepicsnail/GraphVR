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
  let ArgCombinations = 10000;
  let PointsPerCombination = 10;

  for (let _ = 0; _ < 1000; _++) { // Different Parameter choices
    let alpha = Math.random() * 2 - 1;
    let beta = Math.random() * 2 - 1;

    var gim = gaussIteratedMap(alpha, beta);
    var x = 0;
    for (let _ = 0; _ < 40; _++) {
      x = gim(x);
    }
    for (let _ = 0; _ < 10; _++) {
      cloud.addPoint(x, alpha, beta);
    }
  }
  return cloud.points;
}

var plot = generatePlot();
scene.add(plot);
let c = new ControllerUI(controller);
setFrameCB(function(timestamp) { c.onFrame(timestamp); });
setTimeout(run, 0);
