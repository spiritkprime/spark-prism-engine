import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Box, 
  Circle, 
  Cylinder,
  Triangle,
  Zap,
  Sparkles
} from 'lucide-react';
import { SP35Engine } from '@/lib/sp35-engine/core/Engine';
import { PrimitiveFactory } from '@/lib/sp35-engine/primitives/PrimitiveFactory';
import * as THREE from 'three';

export const EngineToolbar = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const engine = SP35Engine.getInstance();

  const handlePlayPause = () => {
    if (isPlaying) {
      engine.stop();
    } else {
      engine.start();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    engine.stop();
    setIsPlaying(false);
    // Reset scene to initial state
    const scene = engine.getScene('demo');
    if (scene) {
      scene.clear();
      // Recreate demo objects
      const ground = PrimitiveFactory.createPlane('Ground', 20, 20);
      ground.setRotation(-Math.PI / 2, 0, 0);
      ground.setPosition(0, -2, 0);
      scene.addObject(ground);
    }
  };

  const handleReset = () => {
    const scene = engine.getScene('demo');
    if (scene) {
      scene.clear();
      // Recreate demo scene
      const ground = PrimitiveFactory.createPlane('Ground', 20, 20);
      ground.setRotation(-Math.PI / 2, 0, 0);
      ground.setPosition(0, -2, 0);
      scene.addObject(ground);

      const cube = PrimitiveFactory.createCube('Demo Cube', 1);
      cube.setPosition(-2, 2, 0);
      scene.addObject(cube);

      const sphere = PrimitiveFactory.createSphere('Demo Sphere', 0.8);
      sphere.setPosition(0, 4, 0);
      scene.addObject(sphere);

      const cylinder = PrimitiveFactory.createCylinder('Demo Cylinder', 0.6, 1.5);
      cylinder.setPosition(2, 3, 0);
      scene.addObject(cylinder);
    }
  };

  const addPrimitive = (type: string) => {
    const scene = engine.getScene('demo');
    if (!scene) return;

    const position = new THREE.Vector3(
      (Math.random() - 0.5) * 6,
      5 + Math.random() * 3,
      (Math.random() - 0.5) * 6
    );

    let object;
    const randomName = `${type}_${Date.now()}`;

    switch (type) {
      case 'cube':
        object = PrimitiveFactory.createCube(randomName);
        break;
      case 'sphere':
        object = PrimitiveFactory.createSphere(randomName);
        break;
      case 'cylinder':
        object = PrimitiveFactory.createCylinder(randomName);
        break;
      case 'cone':
        object = PrimitiveFactory.createCone(randomName);
        break;
      default:
        return;
    }

    object.setPosition(position.x, position.y, position.z);
    scene.addObject(object);
  };

  const addParticleEffect = () => {
    const particleSystem = engine.particleSystem;
    const emitterName = `effect_${Date.now()}`;
    
    particleSystem.createEmitter(emitterName, {
      count: 100,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        2,
        (Math.random() - 0.5) * 4
      ),
      velocity: new THREE.Vector3(0, 3, 0),
      acceleration: new THREE.Vector3(0, -8, 0),
      life: 3,
      size: 0.15,
      color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
    });
    
    const emitter = particleSystem.getEmitter(emitterName);
    if (emitter) {
      emitter.setEmissionRate(30);
      emitter.start();
      
      // Auto-stop after 5 seconds
      setTimeout(() => {
        emitter.stop();
        setTimeout(() => {
          particleSystem.removeEmitter(emitterName);
        }, 3000);
      }, 5000);
    }
  };

  return (
    <Card className="bg-engine-toolbar border-primary/20 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="engine"
            size="sm"
            onClick={handlePlayPause}
            className="w-8 h-8 p-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="panel"
            size="sm"
            onClick={handleStop}
            className="w-8 h-8 p-0"
          >
            <Square className="w-4 h-4" />
          </Button>
          
          <Button
            variant="panel"
            size="sm"
            onClick={handleReset}
            className="w-8 h-8 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Primitive Objects */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Add:</span>
          
          <Button
            variant="panel"
            size="sm"
            onClick={() => addPrimitive('cube')}
            className="w-8 h-8 p-0"
            title="Add Cube"
          >
            <Box className="w-4 h-4" />
          </Button>
          
          <Button
            variant="panel"
            size="sm"
            onClick={() => addPrimitive('sphere')}
            className="w-8 h-8 p-0"
            title="Add Sphere"
          >
            <Circle className="w-4 h-4" />
          </Button>
          
          <Button
            variant="panel"
            size="sm"
            onClick={() => addPrimitive('cylinder')}
            className="w-8 h-8 p-0"
            title="Add Cylinder"
          >
            <Cylinder className="w-4 h-4" />
          </Button>
          
          <Button
            variant="panel"
            size="sm"
            onClick={() => addPrimitive('cone')}
            className="w-8 h-8 p-0"
            title="Add Cone"
          >
            <Triangle className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Effects */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Effects:</span>
          
          <Button
            variant="panel"
            size="sm"
            onClick={addParticleEffect}
            className="w-8 h-8 p-0"
            title="Add Particle Effect"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};