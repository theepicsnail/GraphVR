import {RandomColor} from "./dataGen";

export class PointCloud {
  geometry: THREE.Geometry;
  points: THREE.Points;
  constructor() {
    this.geometry = new THREE.Geometry();
    this.points =
        new THREE.Points(this.geometry,
                         new THREE.PointsMaterial(
                             {size : .001, vertexColors : THREE.VertexColors}));
    this.points.frustumCulled = false;
  }

  addPoint(x, y, z) {
    this.geometry.vertices.push(new THREE.Vector3(x, y, z));
    this.geometry.colors.push(RandomColor());
  }

  getObject() { return this.points; }
}
