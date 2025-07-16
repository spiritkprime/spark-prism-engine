import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Scene } from './Scene';
import { Renderer } from './Renderer';
import { Physics } from './Physics';
import { AssetManager } from './AssetManager';
import { ParticleSystem } from '../effects/ParticleSystem';

export class SP35Engine {
  private static instance: SP35Engine;
  
  public renderer: Renderer;
  public physics: Physics;
  public assetManager: AssetManager;
  public particleSystem: ParticleSystem;
  public activeScene?: Scene;
  
  private scenes: Map<string, Scene> = new Map();
  private isRunning = false;
  private lastTime = 0;
  private frameCount = 0;
  public fps = 0;

  private constructor() {
    this.renderer = new Renderer();
    this.physics = new Physics();
    this.assetManager = new AssetManager();
    this.particleSystem = new ParticleSystem();
    
    console.log('🚀 SP35 Engine initialized');
  }

  public static getInstance(): SP35Engine {
    if (!SP35Engine.instance) {
      SP35Engine.instance = new SP35Engine();
    }
    return SP35Engine.instance;
  }

  public createScene(name: string): Scene {
    const scene = new Scene(name);
    this.scenes.set(name, scene);
    
    if (!this.activeScene) {
      this.setActiveScene(name);
    }
    
    return scene;
  }

  public setActiveScene(name: string): void {
    const scene = this.scenes.get(name);
    if (scene) {
      this.activeScene = scene;
      this.renderer.setScene(scene.threeScene);
      this.physics.setWorld(scene.physicsWorld);
    }
  }

  public getScene(name: string): Scene | undefined {
    return this.scenes.get(name);
  }

  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate();
    
    console.log('▶️ SP35 Engine started');
  }

  public stop(): void {
    this.isRunning = false;
    console.log('⏹️ SP35 Engine stopped');
  }

  private animate = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Calculate FPS
    this.frameCount++;
    if (this.frameCount % 60 === 0) {
      this.fps = Math.round(1 / deltaTime);
    }

    // Update systems
    if (this.activeScene) {
      this.physics.update(deltaTime);
      this.particleSystem.update(deltaTime);
      this.activeScene.update(deltaTime);
      this.renderer.render(this.activeScene.camera);
    }

    requestAnimationFrame(this.animate);
  };

  public resize(width: number, height: number): void {
    this.renderer.resize(width, height);
    if (this.activeScene) {
      this.activeScene.camera.aspect = width / height;
      this.activeScene.camera.updateProjectionMatrix();
    }
  }

  public dispose(): void {
    this.stop();
    this.renderer.dispose();
    this.physics.dispose();
    this.scenes.clear();
    console.log('🗑️ SP35 Engine disposed');
  }
}