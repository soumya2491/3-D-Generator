import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { Mesh, BoxGeometry, SphereGeometry, CylinderGeometry, ConeGeometry } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { Shape } from './ModelingEditor';

interface Scene3DProps {
  shapes: Shape[];
  selectedShapeId: string | null;
  onSelectShape: (id: string | null) => void;
  onUpdateShape: (id: string, updates: Partial<Shape>) => void;
  onDeleteShape: (id: string) => void;
}

interface ShapeComponentProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Shape>) => void;
}

const ShapeComponent: React.FC<ShapeComponentProps> = ({ 
  shape, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  const handleTransform = () => {
    if (meshRef.current) {
      const { position, rotation, scale } = meshRef.current;
      onUpdate({
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z],
        scale: [scale.x, scale.y, scale.z]
      });
    }
  };

  const getGeometry = () => {
    switch (shape.type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.5, 1, 32]} />;
      case 'pyramid':
        return <coneGeometry args={[0.5, 1, 4]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={shape.position}
        rotation={shape.rotation}
        scale={shape.scale}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {getGeometry()}
        <meshStandardMaterial 
          color={shape.color}
          emissive={isSelected ? '#1a1a1a' : '#000000'}
          emissiveIntensity={isSelected ? 0.1 : 0}
          roughness={0.3}
          metalness={0.1}
          transparent={hovered && !isSelected}
          opacity={hovered && !isSelected ? 0.8 : 1}
        />
      </mesh>
      
      {isSelected && (
        <TransformControls
          object={meshRef}
          mode="translate"
          onObjectChange={handleTransform}
          showX={true}
          showY={true}
          showZ={true}
          size={1}
          space="world"
        />
      )}
    </group>
  );
};

export const Scene3D: React.FC<Scene3DProps> = ({
  shapes,
  selectedShapeId,
  onSelectShape,
  onUpdateShape,
  onDeleteShape
}) => {
  const handleBackgroundClick = () => {
    onSelectShape(null);
  };

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedShapeId) {
        onDeleteShape(selectedShapeId);
      }
      if (event.key === 'Escape') {
        onSelectShape(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeId, onDeleteShape, onSelectShape]);

  return (
    <>
      {/* Ground plane for shadows */}
      <mesh 
        position={[0, -0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          transparent 
          opacity={0.1} 
        />
      </mesh>

      {/* Render all shapes */}
      {shapes.map((shape) => (
        <ShapeComponent
          key={shape.id}
          shape={shape}
          isSelected={shape.id === selectedShapeId}
          onSelect={() => onSelectShape(shape.id)}
          onUpdate={(updates) => onUpdateShape(shape.id, updates)}
        />
      ))}
    </>
  );
};