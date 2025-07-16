import { EngineViewport } from '@/components/SP35Engine/EngineViewport';
import { EngineToolbar } from '@/components/SP35Engine/EngineToolbar';
import { SceneHierarchy } from '@/components/SP35Engine/SceneHierarchy';
import { EngineStats } from '@/components/SP35Engine/EngineStats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Gamepad2, Code, Cpu } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">SP35 Engine</h1>
              <p className="text-muted-foreground">Professional 3D Game Engine</p>
            </div>
          </div>
          
          <div className="flex gap-2 ml-auto">
            <Badge variant="outline" className="bg-primary/10 border-primary/30">
              <Gamepad2 className="w-3 h-3 mr-1" />
              3D Graphics
            </Badge>
            <Badge variant="outline" className="bg-accent/10 border-accent/30">
              <Code className="w-3 h-3 mr-1" />
              Physics
            </Badge>
            <Badge variant="outline" className="bg-engine-accent-secondary/10 border-engine-accent-secondary/30">
              <Cpu className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
          </div>
        </div>

        <EngineToolbar />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
        {/* Left Panel */}
        <div className="col-span-3 space-y-4">
          <SceneHierarchy />
          <EngineStats />
        </div>

        {/* Main Viewport */}
        <div className="col-span-9">
          <Card className="bg-engine-panel border-primary/20 h-full">
            <CardHeader>
              <CardTitle className="text-sm text-foreground flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                3D Viewport
                <Badge variant="outline" className="ml-auto text-xs">
                  WebGL
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <EngineViewport 
                width={800} 
                height={500} 
                className="w-full h-full"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
