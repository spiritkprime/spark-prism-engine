import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { v4 as uuidv4 } from 'uuid';

export interface EngineObjectConfig {
  name: string;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
  mass?: number;
  shape?: CANNON.Shape;
  physics?: boolean;
}

export class EngineObject {
  public id: string;
  public name: string;
  public mesh: THREE.Mesh;
  public body?: CANNON.Body;
  public userData: Record<string, any> = {};
  
  private components: Map<string, any> = new Map();

  constructor(config: EngineObjectConfig) {
    this.id = uuidv4();
    this.name = config.name;
    
    // Create mesh
    const geometry = config.geometry || new THREE.BoxGeometry(1, 1, 1);
    const material = config.material || new THREE.MeshPhongMaterial({ 
      color: 0x00aaff,
      shininess: 100
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.userData = { engineObjectId: this.id };
    
    // Set transform
    if (config.position) this.mesh.position.copy(config.position);
    if (config.rotation) this.mesh.rotation.copy(config.rotation);
    if (config.scale) this.mesh.scale.copy(config.scale);
    
    // Create physics body if needed
    if (config.physics && config.mass !== undefined) {
      const shape = config.shape || new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
      this.body = new CANNON.Body({
        mass: config.mass,
        shape: shape,
        position: new CANNON.Vec3(
          this.mesh.position.x,
          this.mesh.position.y,
          this.mesh.position.z
        )
      });
    }
    
    console.log(`🎭 EngineObject "${this.name}" created`);
  }

  public addComponent<T>(name: string, component: T): void {
    this.components.set(name, component);
  }

  public getComponent<T>(name: string): T | undefined {
    return this.components.get(name);
  }

  public removeComponent(name: string): void {
    this.components.delete(name);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
    if (this.body) {
      this.body.position.set(x, y, z);
    }
  }

  public setRotation(x: number, y: number, z: number): void {
    this.mesh.rotation.set(x, y, z);
    if (this.body) {
      this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), y);
    }
  }

  public setScale(x: number, y: number, z: number): void {
    this.mesh.scale.set(x, y, z);
  }

  public applyForce(force: THREE.Vector3, point?: THREE.Vector3): void {
    if (this.body) {
      const cannonForce = new CANNON.Vec3(force.x, force.y, force.z);
      const cannonPoint = point ? new CANNON.Vec3(point.x, point.y, point.z) : this.body.position;
      this.body.applyForce(cannonForce, cannonPoint);
    }
  }

  public applyImpulse(impulse: THREE.Vector3, point?: THREE.Vector3): void {
    if (this.body) {
      const cannonImpulse = new CANNON.Vec3(impulse.x, impulse.y, impulse.z);
      const cannonPoint = point ? new CANNON.Vec3(point.x, point.y, point.z) : this.body.position;
      this.body.applyImpulse(cannonImpulse, cannonPoint);
    }
  }

  public update(deltaTime: number): void {
    // Update components
    this.components.forEach(component => {
      if (component.update && typeof component.update === 'function') {
        component.update(deltaTime);
      }
    });
  }

  public dispose(): void {
    if (this.mesh.geometry) this.mesh.geometry.dispose();
    if (this.mesh.material) {
      if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach(material => material.dispose());
      } else {
        this.mesh.material.dispose();
      }
    }
    this.components.clear();
    console.log(`🗑️ EngineObject "${this.name}" disposed`);
  }
}