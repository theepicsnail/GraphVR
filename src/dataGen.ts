
export function RandomColor() {
  return new THREE.Color(0xFF).offsetHSL(Math.random(), 0, 0);
}

export function RandomUnitVector() {
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
