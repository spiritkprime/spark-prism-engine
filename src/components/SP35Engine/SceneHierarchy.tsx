import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  Box, 
  Circle, 
  Cylinder,
  Triangle,
  Plane,
  Lightbulb
} from 'lucide-react';
import { SP35Engine } from '@/lib/sp35-engine/core/Engine';
import { EngineObject } from '@/lib/sp35-engine/core/EngineObject';

export const SceneHierarchy = () => {
  const [objects, setObjects] = useState<EngineObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  const engine = SP35Engine.getInstance();

  useEffect(() => {
    const updateObjects = () => {
      const scene = engine.getScene('demo');
      if (scene) {
        setObjects(scene.getAllObjects());
      }
    };

    // Update initially
    updateObjects();

    // Update periodically
    const interval = setInterval(updateObjects, 1000);
    return () => clearInterval(interval);
  }, []);

  const getObjectIcon = (object: EngineObject) => {
    const name = object.name.toLowerCase();
    if (name.includes('cube')) return <Box className="w-4 h-4" />;
    if (name.includes('sphere')) return <Circle className="w-4 h-4" />;
    if (name.includes('cylinder')) return <Cylinder className="w-4 h-4" />;
    if (name.includes('cone')) return <Triangle className="w-4 h-4" />;
    if (name.includes('plane') || name.includes('ground')) return <Plane className="w-4 h-4" />;
    return <Box className="w-4 h-4" />;
  };

  const toggleObjectVisibility = (object: EngineObject) => {
    object.mesh.visible = !object.mesh.visible;
    setObjects([...objects]); // Force re-render
  };

  const deleteObject = (objectId: string) => {
    const scene = engine.getScene('demo');
    if (scene) {
      scene.removeObject(objectId);
      setObjects(scene.getAllObjects());
      if (selectedObject === objectId) {
        setSelectedObject(null);
      }
    }
  };

  const selectObject = (objectId: string) => {
    setSelectedObject(selectedObject === objectId ? null : objectId);
  };

  return (
    <Card className="bg-engine-panel border-primary/20 h-full">
      <CardHeader>
        <CardTitle className="text-sm text-foreground flex items-center gap-2">
          <Box className="w-4 h-4" />
          Scene Hierarchy
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-3 space-y-1">
            {objects.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-8">
                No objects in scene
              </div>
            ) : (
              objects.map((object) => (
                <div
                  key={object.id}
                  className={`flex items-center gap-2 p-2 rounded hover:bg-engine-toolbar/50 cursor-pointer transition-colors ${
                    selectedObject === object.id ? 'bg-primary/10 border border-primary/30' : ''
                  }`}
                  onClick={() => selectObject(object.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getObjectIcon(object)}
                    <span className="text-xs text-foreground truncate">
                      {object.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0 opacity-60 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleObjectVisibility(object);
                      }}
                    >
                      {object.mesh.visible ? 
                        <Eye className="w-3 h-3" /> : 
                        <EyeOff className="w-3 h-3" />
                      }
                    </Button>
                    
                    {!object.name.includes('Ground') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0 opacity-60 hover:opacity-100 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteObject(object.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {selectedObject && (
          <>
            <Separator />
            <div className="p-3">
              <div className="text-xs text-muted-foreground mb-2">Object Properties</div>
              <div className="space-y-2 text-xs">
                {(() => {
                  const obj = objects.find(o => o.id === selectedObject);
                  if (!obj) return null;
                  
                  return (
                    <>
                      <div className="flex justify-between">
                        <span>Position:</span>
                        <span className="font-mono">
                          {obj.mesh.position.x.toFixed(1)}, {obj.mesh.position.y.toFixed(1)}, {obj.mesh.position.z.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visible:</span>
                        <span>{obj.mesh.visible ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Physics:</span>
                        <span>{obj.body ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};