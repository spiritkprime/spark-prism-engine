import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Box, Sparkles } from 'lucide-react';
import { SP35Engine } from '@/lib/sp35-engine/core/Engine';

export const EngineStats = () => {
  const [stats, setStats] = useState({
    fps: 0,
    objects: 0,
    particles: 0,
    drawCalls: 0,
    vertices: 0,
    memory: 0
  });

  const engine = SP35Engine.getInstance();

  useEffect(() => {
    const updateStats = () => {
      const scene = engine.getScene('demo');
      const renderer = engine.renderer.threeRenderer;
      const info = renderer.info;
      
      setStats({
        fps: engine.fps,
        objects: scene ? scene.getAllObjects().length : 0,
        particles: engine.particleSystem.getParticles().length,
        drawCalls: info.render.calls,
        vertices: info.render.triangles * 3,
        memory: Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 500);
    return () => clearInterval(interval);
  }, []);

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFpsProgress = (fps: number) => {
    return Math.min((fps / 60) * 100, 100);
  };

  return (
    <Card className="bg-engine-panel border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Engine Statistics
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* FPS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Frame Rate</span>
            <Badge variant="outline" className={`text-xs ${getFpsColor(stats.fps)}`}>
              {stats.fps} FPS
            </Badge>
          </div>
          <Progress value={getFpsProgress(stats.fps)} className="h-2" />
        </div>

        {/* Object Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Objects</span>
          </div>
          <span className="text-xs text-foreground font-mono">{stats.objects}</span>
        </div>

        {/* Particles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Particles</span>
          </div>
          <span className="text-xs text-foreground font-mono">{stats.particles}</span>
        </div>

        {/* Render Stats */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Draw Calls</span>
            <span className="text-xs text-foreground font-mono">{stats.drawCalls}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Vertices</span>
            <span className="text-xs text-foreground font-mono">{stats.vertices.toLocaleString()}</span>
          </div>
          
          {stats.memory > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Memory</span>
              <span className="text-xs text-foreground font-mono">{stats.memory} MB</span>
            </div>
          )}
        </div>

        {/* Engine Status */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs text-primary font-medium">SP35 Engine Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};