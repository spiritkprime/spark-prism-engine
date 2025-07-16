import * as CANNON from 'cannon-es';

export class Physics {
  private world?: CANNON.World;
  private fixedTimeStep = 1 / 60;
  private maxSubSteps = 3;
  
  constructor() {
    console.log('⚡ Physics system initialized');
  }

  public setWorld(world: CANNON.World): void {
    this.world = world;
    this.setupContactMaterial();
  }

  private setupContactMaterial(): void {
    if (!this.world) return;
    
    // Create default contact material
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.4,
        restitution: 0.3,
      }
    );
    
    this.world.addContactMaterial(defaultContactMaterial);
    this.world.defaultContactMaterial = defaultContactMaterial;
  }

  public update(deltaTime: number): void {
    if (this.world) {
      this.world.step(this.fixedTimeStep, deltaTime, this.maxSubSteps);
    }
  }

  public addBody(body: CANNON.Body): void {
    if (this.world) {
      this.world.addBody(body);
    }
  }

  public removeBody(body: CANNON.Body): void {
    if (this.world) {
      this.world.removeBody(body);
    }
  }

  public raycast(from: CANNON.Vec3, to: CANNON.Vec3): CANNON.RaycastResult | null {
    if (!this.world) return null;
    
    const result = new CANNON.RaycastResult();
    this.world.raycastClosest(from, to, {}, result);
    
    return result.hasHit ? result : null;
  }

  public dispose(): void {
    if (this.world) {
      this.world.bodies.forEach(body => {
        this.world!.removeBody(body);
      });
    }
    console.log('🗑️ Physics system disposed');
  }
}