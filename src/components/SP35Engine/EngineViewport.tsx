import { useEffect, useRef, useState } from 'react';
import { SP35Engine } from '@/lib/sp35-engine/core/Engine';
import { PrimitiveFactory } from '@/lib/sp35-engine/primitives/PrimitiveFactory';
import * as THREE from 'three';

interface EngineViewportProps {
  width?: number;
  height?: number;
  className?: string;
}

export const EngineViewport = ({ 
  width = 800, 
  height = 600, 
  className = "" 
}: EngineViewportProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SP35Engine | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    // Initialize SP35 Engine
    const engine = SP35Engine.getInstance();
    engineRef.current = engine;

    // Append canvas to container
    const canvas = engine.renderer.getCanvas();
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvasRef.current.appendChild(canvas);

    // Create demo scene
    const scene = engine.createScene('demo');
    
    // Create ground plane
    const ground = PrimitiveFactory.createPlane('Ground', 20, 20);
    ground.setRotation(-Math.PI / 2, 0, 0);
    ground.setPosition(0, -2, 0);
    scene.addObject(ground);

    // Create some demo objects
    const cube = PrimitiveFactory.createCube('Demo Cube', 1);
    cube.setPosition(-2, 2, 0);
    scene.addObject(cube);

    const sphere = PrimitiveFactory.createSphere('Demo Sphere', 0.8);
    sphere.setPosition(0, 4, 0);
    scene.addObject(sphere);

    const cylinder = PrimitiveFactory.createCylinder('Demo Cylinder', 0.6, 1.5);
    cylinder.setPosition(2, 3, 0);
    scene.addObject(cylinder);

    // Create particle effect
    const particleSystem = engine.particleSystem;
    particleSystem.createEmitter('fire', {
      count: 100,
      position: new THREE.Vector3(0, 1, -3),
      velocity: new THREE.Vector3(0, 2, 0),
      acceleration: new THREE.Vector3(0, -5, 0),
      life: 2,
      size: 0.1,
      color: new THREE.Color(0xff4400)
    });
    
    const emitter = particleSystem.getEmitter('fire');
    if (emitter) {
      emitter.setEmissionRate(50);
      emitter.start();
    }

    // Setup camera controls
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };
    let cameraDistance = 15;
    let cameraAngleX = 0;
    let cameraAngleY = 0;

    const updateCameraPosition = () => {
      const camera = scene.camera;
      const x = cameraDistance * Math.sin(cameraAngleY) * Math.cos(cameraAngleX);
      const y = cameraDistance * Math.sin(cameraAngleX);
      const z = cameraDistance * Math.cos(cameraAngleY) * Math.cos(cameraAngleX);
      
      camera.position.set(x, y + 3, z);
      camera.lookAt(0, 0, 0);
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMouse.x;
      const deltaY = e.clientY - previousMouse.y;

      cameraAngleY += deltaX * 0.01;
      cameraAngleX += deltaY * 0.01;
      cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraAngleX));

      updateCameraPosition();
      previousMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      cameraDistance += e.deltaY * 0.01;
      cameraDistance = Math.max(5, Math.min(50, cameraDistance));
      updateCameraPosition();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);

    updateCameraPosition();

    // Start engine
    engine.start();
    setIsInitialized(true);

    // FPS counter
    const fpsInterval = setInterval(() => {
      setFps(engine.fps);
    }, 1000);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      clearInterval(fpsInterval);
      
      if (canvasRef.current && canvas.parentNode === canvasRef.current) {
        canvasRef.current.removeChild(canvas);
      }
    };
  }, [isInitialized]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.resize(width, height);
    }
  }, [width, height]);

  return (
    <div className={`relative bg-engine-panel border border-primary/20 rounded-lg overflow-hidden ${className}`}>
      <div 
        ref={canvasRef} 
        style={{ width, height }}
        className="w-full h-full"
      />
      
      {/* FPS Counter */}
      <div className="absolute top-2 left-2 bg-engine-toolbar/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-primary">
        FPS: {fps}
      </div>
      
      {/* Controls Info */}
      <div className="absolute bottom-2 left-2 bg-engine-toolbar/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
        Mouse: Orbit | Scroll: Zoom
      </div>
      
      {/* Engine Status */}
      <div className="absolute top-2 right-2 bg-engine-toolbar/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
        <span className="text-primary">●</span> SP35 Engine
      </div>
    </div>
  );
};