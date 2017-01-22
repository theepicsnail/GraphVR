export class CanvasPlane {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.Texture;
  mesh: THREE.Mesh;

  constructor(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.texture = new THREE.Texture(this.canvas);
    this.texture.needsUpdate = true;
    this.mesh =
        new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
                       new THREE.MeshBasicMaterial({map : this.texture}));
  }

  update(cb) {
    cb(this.ctx);
    this.texture.needsUpdate = true;
  }

  getObject() { return this.mesh; }
}
