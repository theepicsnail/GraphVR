declare namespace THREE {
  export class VRControls {
    constructor(camera: THREE.Camera);
    standing: boolean;
    update():void;
  }
  export class VREffect {
    constructor(renderer: THREE.WebGLRenderer);
    setSize(width: number, height:number, updateStyle?:boolean);
    render(scene: THREE.Scene, camera: THREE.Camera);
  }
}
