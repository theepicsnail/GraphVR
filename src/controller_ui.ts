import {CanvasPlane} from "./canvas_plane";

interface ViveController extends THREE.Group {}

export class ControllerUI {
  controller: ViveController;
  display: CanvasPlane;
  showingMenu: boolean;
  constructor(controller) {
    this.controller = controller;
    this.addPrimaryMarker();
    this.addFloatingMarker();
    this.addDisplay();
  }

  addPrimaryMarker() {
    let geo = new THREE.SphereGeometry(.01, 4, 4);
    let mat = new THREE.MeshBasicMaterial({color : 0x00ff00});
    let marker = new THREE.Mesh(geo, mat);
    this.controller.add(marker);
  }

  addFloatingMarker() {
    let geo = new THREE.SphereGeometry(.01, 4, 4);
    let mat = new THREE.MeshBasicMaterial({color : 0x00ff00});
    let marker = new THREE.Mesh(geo, mat);
    marker.translateZ(-.0762); // 3 inches in meters
    marker.scale.multiplyScalar(.5);
    this.controller.add(marker);
  }

  addDisplay() {
    this.display = new CanvasPlane(256, 256);
    this.display.update((ctx) => { ctx.font = "24px Monospace"; });

    let obj = this.display.getObject();
    obj.scale.multiplyScalar(.07);
    obj.rotateX(-Math.PI / 2);
    obj.translateY(.01);
  }

  setupEvents() {
    controller.on(controller.MenuPressed, () => {
      this.showingMenu = true;
      controller.add(this.display.getObject());

    });
    controller.on(controller.MenuUnpressed, () => {
      this.showingMenu = false;
      controller.remove(this.display.getObject());
    });
  }

  onFrame(timestamp) {
    if (this.showingMenu) {
      this.display.update((context) => {
        context.fillStyle = "black";
        context.fillRect(0, 0, 600, 600);
        context.fillStyle = "yellow";
        context.fillText("x: " + controller.position.x.toFixed(4), 0, 20);
        context.fillText("y: " + controller.position.y.toFixed(4), 0, 40);
        context.fillText("z: " + controller.position.z.toFixed(4), 0, 60);
      });
    }
  }
}
