import * as THREE from 'three';

export class Renderer {
  public threeRenderer: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  
  constructor() {
    this.threeRenderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threeRenderer.outputColorSpace = THREE.SRGBColorSpace;
    this.threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.threeRenderer.toneMappingExposure = 1.2;
    
    // Enable post-processing effects
    this.threeRenderer.setClearColor(0x0a0a0a, 1);
    
    console.log('🎨 Renderer initialized');
  }

  public setScene(scene: THREE.Scene): void {
    this.scene = scene;
  }

  public render(camera: THREE.Camera): void {
    if (this.scene) {
      this.threeRenderer.render(this.scene, camera);
    }
  }

  public resize(width: number, height: number): void {
    this.threeRenderer.setSize(width, height);
    this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  public getCanvas(): HTMLCanvasElement {
    return this.threeRenderer.domElement;
  }

  public dispose(): void {
    this.threeRenderer.dispose();
    console.log('🗑️ Renderer disposed');
  }
}