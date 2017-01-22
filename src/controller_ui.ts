import {CanvasPlane} from "./canvas_plane";

interface ViveController extends THREE.Group {

  PadTouched: string
  PadUntouched: string
  PadPressed: string
  PadUnpressed: string
  TriggerClicked: string
  TriggerUnclicked: string
  MenuClicked: string
  MenuUnclicked: string
  Gripped: string
  Ungripped: string
  PadDragged: string
  MenuPressed: string
  MenuUnpressed: string
  Connected: string
  Disconnected: string
  on(evt: string, handler: any): void;
}

export class ControllerUI {
  controller: ViveController;
  display: CanvasPlane;
  showingMenu: boolean;
  constructor(controller) {
    this.controller = controller;
    this.addPrimaryMarker();
    this.addFloatingMarker();
    this.addDisplay();
		this.setupEvents();
  }

  addPrimaryMarker() {
    let geo = new THREE.SphereGeometry(.01, 6, 4);
    let mat = new THREE.MeshBasicMaterial({color : 0x00ff00});
    let marker = new THREE.Mesh(geo, mat);
    this.controller.add(marker);
  }

  addFloatingMarker() {
    let geo = new THREE.SphereGeometry(.01, 4, 2);
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
    obj.translateY(.01);
    obj.rotateX(-Math.PI / 2);
  }

  setupEvents() {
    this.controller.on(this.controller.MenuPressed, () => {
      this.showingMenu = true;
      this.controller.add(this.display.getObject());

    });
    this.controller.on(this.controller.MenuUnpressed, () => {
      this.showingMenu = false;
      this.controller.remove(this.display.getObject());
    });
  }

  onFrame(timestamp) {
    if (this.showingMenu) {
      this.display.update((context) => {
        context.fillStyle = "black";
        context.fillRect(0, 0, 600, 600);
        context.fillStyle = "yellow";
        context.fillText("x: " + this.controller.position.x.toFixed(4), 0, 20);
        context.fillText("y: " + this.controller.position.y.toFixed(4), 0, 40);
        context.fillText("z: " + this.controller.position.z.toFixed(4), 0, 60);
      });
    }
  }
}
