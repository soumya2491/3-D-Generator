import React, { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { Vector3 } from 'three';
import { Toolbar } from './Toolbar';
import { ColorPicker } from './ColorPicker';
import { Scene3D } from './Scene3D';
import { useModelingStore } from '../hooks/useModelingStore';

export interface Shape {
  id: string;
  type: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'pyramid';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export const ModelingEditor: React.FC = () => {
  const {
    shapes,
    selectedShapeId,
    currentColor,
    isGridVisible,
    addShape,
    selectShape,
    updateShape,
    deleteShape,
    setCurrentColor,
    toggleGrid,
    clearScene,
    undo,
    redo,
    canUndo,
    canRedo
  } = useModelingStore();

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddShape = useCallback((type: Shape['type']) => {
    const newShape: Shape = {
      id: `shape-${Date.now()}`,
      type,
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: currentColor
    };
    addShape(newShape);
  }, [addShape, currentColor]);

  const handleShapeUpdate = useCallback((id: string, updates: Partial<Shape>) => {
    updateShape(id, updates);
  }, [updateShape]);

  return (
    <div className="h-screen w-screen bg-workspace overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-16 bg-gradient-surface border-b border-border flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">3D</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Model Studio</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ColorPicker 
            currentColor={currentColor} 
            onColorChange={setCurrentColor} 
          />
          
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-3 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-3 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              Redo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Toolbar */}
        <aside className="w-20 bg-gradient-surface border-r border-border shadow-lg">
          <Toolbar 
            onAddShape={handleAddShape}
            onClearScene={clearScene}
            onToggleGrid={toggleGrid}
            isGridVisible={isGridVisible}
          />
        </aside>

        {/* 3D Viewport */}
        <main className="flex-1 relative">
          <div ref={canvasRef} className="w-full h-full">
            <Canvas
              camera={{ 
                position: [10, 10, 10], 
                fov: 45,
                near: 0.1,
                far: 1000
              }}
              dpr={[1, 2]}
              gl={{ 
                antialias: true,
                alpha: false,
                powerPreference: "high-performance"
              }}
            >
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-10, -10, -10]} intensity={0.3} />

              {/* Grid */}
              {isGridVisible && (
                <Grid 
                  renderOrder={-1}
                  position={[0, 0, 0]}
                  infiniteGrid
                  cellSize={1}
                  cellThickness={0.5}
                  sectionSize={10}
                  sectionThickness={1}
                  sectionColor="#4a5568"
                  cellColor="#2d3748"
                  fadeDistance={100}
                  fadeStrength={1}
                />
              )}

              {/* 3D Scene */}
              <Scene3D 
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                onSelectShape={selectShape}
                onUpdateShape={handleShapeUpdate}
                onDeleteShape={deleteShape}
              />

              {/* Controls */}
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                dampingFactor={0.05}
                minDistance={2}
                maxDistance={100}
                target={[0, 0, 0]}
              />

              {/* Gizmo */}
              <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport 
                  axisColors={['#ff4757', '#2ed573', '#3742fa']} 
                  labelColor="white"
                />
              </GizmoHelper>
            </Canvas>
          </div>

          {/* Properties Panel */}
          {selectedShapeId && (
            <div className="absolute top-4 right-4 w-80 bg-gradient-glass backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-3">Properties</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Shape: {shapes.find(s => s.id === selectedShapeId)?.type}
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Position
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['x', 'y', 'z'] as const).map((axis, index) => (
                      <input
                        key={axis}
                        type="number"
                        step="0.1"
                        className="px-2 py-1 bg-input border border-border rounded text-sm"
                        value={shapes.find(s => s.id === selectedShapeId)?.position[index] || 0}
                        onChange={(e) => {
                          const shape = shapes.find(s => s.id === selectedShapeId);
                          if (shape) {
                            const newPosition = [...shape.position] as [number, number, number];
                            newPosition[index] = parseFloat(e.target.value) || 0;
                            handleShapeUpdate(selectedShapeId, { position: newPosition });
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Scale
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['x', 'y', 'z'] as const).map((axis, index) => (
                      <input
                        key={axis}
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="px-2 py-1 bg-input border border-border rounded text-sm"
                        value={shapes.find(s => s.id === selectedShapeId)?.scale[index] || 1}
                        onChange={(e) => {
                          const shape = shapes.find(s => s.id === selectedShapeId);
                          if (shape) {
                            const newScale = [...shape.scale] as [number, number, number];
                            newScale[index] = Math.max(0.1, parseFloat(e.target.value) || 1);
                            handleShapeUpdate(selectedShapeId, { scale: newScale });
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => deleteShape(selectedShapeId)}
                  className="w-full px-3 py-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-lg text-sm font-medium transition-colors"
                >
                  Delete Shape
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};