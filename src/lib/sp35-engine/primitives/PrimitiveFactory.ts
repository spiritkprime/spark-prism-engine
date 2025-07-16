import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { EngineObject, EngineObjectConfig } from '../core/EngineObject';

export class PrimitiveFactory {
  public static createCube(name: string, size: number = 1, config?: Partial<EngineObjectConfig>): EngineObject {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({ 
      color: config?.material ? (config.material as any).color : 0x00aaff,
      shininess: 100
    });
    
    const shape = new CANNON.Box(new CANNON.Vec3(size/2, size/2, size/2));
    
    return new EngineObject({
      name,
      geometry,
      material,
      shape,
      mass: 1,
      physics: true,
      ...config
    });
  }

  public static createSphere(name: string, radius: number = 1, config?: Partial<EngineObjectConfig>): EngineObject {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: config?.material ? (config.material as any).color : 0xff6600,
      shininess: 100
    });
    
    const shape = new CANNON.Sphere(radius);
    
    return new EngineObject({
      name,
      geometry,
      material,
      shape,
      mass: 1,
      physics: true,
      ...config
    });
  }

  public static createPlane(name: string, width: number = 10, height: number = 10, config?: Partial<EngineObjectConfig>): EngineObject {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshPhongMaterial({ 
      color: config?.material ? (config.material as any).color : 0x888888,
      side: THREE.DoubleSide
    });
    
    const shape = new CANNON.Plane();
    
    return new EngineObject({
      name,
      geometry,
      material,
      shape,
      mass: 0, // Static body
      physics: true,
      ...config
    });
  }

  public static createCylinder(name: string, radius: number = 1, height: number = 2, config?: Partial<EngineObjectConfig>): EngineObject {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: config?.material ? (config.material as any).color : 0x9900ff,
      shininess: 100
    });
    
    const shape = new CANNON.Cylinder(radius, radius, height, 8);
    
    return new EngineObject({
      name,
      geometry,
      material,
      shape,
      mass: 1,
      physics: true,
      ...config
    });
  }

  public static createTorus(name: string, radius: number = 1, tube: number = 0.4, config?: Partial<EngineObjectConfig>): EngineObject {
    const geometry = new THREE.TorusGeometry(radius, tube, 16, 100);
    const material = new THREE.MeshPhongMaterial({ 
      color: config?.material ? (config.material as any).color : 0xff0088,
      shininess: 100
    });
    
    // Approximate torus with a sphere for physics
    const shape = new CANNON.Sphere(radius + tube);
    
    return new EngineObject({
      name,
      geometry,
      material,
      shape,
      mass: 1,
      physics: true,
      ...config
    });
  }

  public static createCone(name: string, radius: number = 1, height: number = 2, config?: Partial<EngineObjectConfig>): EngineObject {
    const geometry = new THREE.ConeGeometry(radius, height, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: config?.material ? (config.material as any).color : 0x00ff88,
      shininess: 100
    });
    
    // Approximate cone with a cylinder for physics
    const shape = new CANNON.Cylinder(0, radius, height, 8);
    
    return new EngineObject({
      name,
      geometry,
      material,
      shape,
      mass: 1,
      physics: true,
      ...config
    });
  }
}