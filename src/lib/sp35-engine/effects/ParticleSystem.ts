import * as THREE from 'three';

export interface ParticleConfig {
  count: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  life: number;
  size: number;
  color: THREE.Color;
  texture?: THREE.Texture;
}

export class Particle {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public acceleration: THREE.Vector3;
  public life: number;
  public maxLife: number;
  public size: number;
  public color: THREE.Color;
  public alpha: number = 1;
  
  constructor(config: Partial<ParticleConfig>) {
    this.position = config.position?.clone() || new THREE.Vector3();
    this.velocity = config.velocity?.clone() || new THREE.Vector3();
    this.acceleration = config.acceleration?.clone() || new THREE.Vector3(0, -9.8, 0);
    this.life = config.life || 1;
    this.maxLife = this.life;
    this.size = config.size || 1;
    this.color = config.color?.clone() || new THREE.Color(0xffffff);
  }

  public update(deltaTime: number): boolean {
    this.life -= deltaTime;
    if (this.life <= 0) return false;
    
    // Update physics
    this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    
    // Update alpha based on life
    this.alpha = this.life / this.maxLife;
    
    return true;
  }
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private emitters: Map<string, ParticleEmitter> = new Map();
  
  constructor() {
    console.log('✨ Particle System initialized');
  }

  public createEmitter(id: string, config: ParticleConfig): ParticleEmitter {
    const emitter = new ParticleEmitter(config);
    this.emitters.set(id, emitter);
    return emitter;
  }

  public getEmitter(id: string): ParticleEmitter | undefined {
    return this.emitters.get(id);
  }

  public removeEmitter(id: string): void {
    this.emitters.delete(id);
  }

  public update(deltaTime: number): void {
    // Update all emitters
    this.emitters.forEach(emitter => {
      const newParticles = emitter.update(deltaTime);
      this.particles.push(...newParticles);
    });
    
    // Update and filter particles
    this.particles = this.particles.filter(particle => 
      particle.update(deltaTime)
    );
  }

  public getParticles(): Particle[] {
    return this.particles;
  }

  public clear(): void {
    this.particles = [];
    this.emitters.clear();
  }

  public dispose(): void {
    this.clear();
    console.log('🗑️ Particle System disposed');
  }
}

export class ParticleEmitter {
  private config: ParticleConfig;
  private emissionRate: number = 10; // particles per second
  private emissionTimer: number = 0;
  private isEmitting: boolean = false;
  
  constructor(config: ParticleConfig) {
    this.config = config;
  }

  public start(): void {
    this.isEmitting = true;
  }

  public stop(): void {
    this.isEmitting = false;
  }

  public setEmissionRate(rate: number): void {
    this.emissionRate = rate;
  }

  public update(deltaTime: number): Particle[] {
    if (!this.isEmitting) return [];
    
    const newParticles: Particle[] = [];
    this.emissionTimer += deltaTime;
    
    const emissionInterval = 1 / this.emissionRate;
    
    while (this.emissionTimer >= emissionInterval) {
      this.emissionTimer -= emissionInterval;
      
      // Create new particle with some randomization
      const particle = new Particle({
        position: this.config.position.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          )
        ),
        velocity: this.config.velocity.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          )
        ),
        acceleration: this.config.acceleration,
        life: this.config.life * (0.5 + Math.random() * 0.5),
        size: this.config.size * (0.5 + Math.random() * 0.5),
        color: this.config.color
      });
      
      newParticles.push(particle);
    }
    
    return newParticles;
  }
}