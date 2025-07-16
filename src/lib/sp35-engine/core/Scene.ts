import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { EngineObject } from './EngineObject';

export class Scene {
  public name: string;
  public threeScene: THREE.Scene;
  public physicsWorld: CANNON.World;
  public camera: THREE.PerspectiveCamera;
  
  private objects: Map<string, EngineObject> = new Map();
  private lights: THREE.Light[] = [];

  constructor(name: string) {
    this.name = name;
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x0a0a0a);
    
    // Setup physics world
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -9.82, 0);
    this.physicsWorld.broadphase = new CANNON.NaiveBroadphase();
    
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
    
    // Add default lighting
    this.setupDefaultLighting();
    
    console.log(`🎬 Scene "${name}" created`);
  }

  private setupDefaultLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.addLight(ambientLight);
    
    // Directional light (main light)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.addLight(directionalLight);
    
    // Rim light for dramatic effect
    const rimLight = new THREE.DirectionalLight(0x00aaff, 0.3);
    rimLight.position.set(-10, 5, -5);
    this.addLight(rimLight);
  }

  public addObject(object: EngineObject): void {
    this.objects.set(object.id, object);
    this.threeScene.add(object.mesh);
    
    if (object.body) {
      this.physicsWorld.addBody(object.body);
    }
    
    console.log(`➕ Added object "${object.name}" to scene "${this.name}"`);
  }

  public removeObject(id: string): void {
    const object = this.objects.get(id);
    if (object) {
      this.threeScene.remove(object.mesh);
      if (object.body) {
        this.physicsWorld.removeBody(object.body);
      }
      this.objects.delete(id);
      console.log(`➖ Removed object "${object.name}" from scene "${this.name}"`);
    }
  }

  public getObject(id: string): EngineObject | undefined {
    return this.objects.get(id);
  }

  public getAllObjects(): EngineObject[] {
    return Array.from(this.objects.values());
  }

  public addLight(light: THREE.Light): void {
    this.lights.push(light);
    this.threeScene.add(light);
  }

  public removeLight(light: THREE.Light): void {
    const index = this.lights.indexOf(light);
    if (index > -1) {
      this.lights.splice(index, 1);
      this.threeScene.remove(light);
    }
  }

  public update(deltaTime: number): void {
    // Update all objects
    this.objects.forEach(object => {
      object.update(deltaTime);
    });
    
    // Sync physics bodies with visual meshes
    this.objects.forEach(object => {
      if (object.body) {
        object.mesh.position.copy(object.body.position as any);
        object.mesh.quaternion.copy(object.body.quaternion as any);
      }
    });
  }

  public clear(): void {
    // Remove all objects
    this.objects.forEach(object => {
      this.removeObject(object.id);
    });
    
    // Remove custom lights (keep default lighting)
    const customLights = this.lights.slice(3); // Skip first 3 default lights
    customLights.forEach(light => {
      this.removeLight(light);
    });
  }

  public dispose(): void {
    this.clear();
    this.threeScene.clear();
    console.log(`🗑️ Scene "${this.name}" disposed`);
  }
}
