import React from 'react';
import { Shape } from './ModelingEditor';
import { 
  Box, 
  Circle, 
  Cylinder, 
  Triangle, 
  Pyramid,
  Grid3X3,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

interface ToolbarProps {
  onAddShape: (type: Shape['type']) => void;
  onClearScene: () => void;
  onToggleGrid: () => void;
  isGridVisible: boolean;
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  variant?: 'default' | 'destructive' | 'secondary';
}

const ToolButton: React.FC<ToolButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  active = false, 
  variant = 'default' 
}) => {
  const getButtonClasses = () => {
    const baseClasses = "w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-200 group";
    
    if (variant === 'destructive') {
      return `${baseClasses} bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20`;
    }
    
    if (variant === 'secondary') {
      return `${baseClasses} ${active ? 'bg-accent text-accent-foreground' : 'bg-muted hover:bg-muted/80'} border border-border`;
    }
    
    return `${baseClasses} bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:shadow-glow`;
  };

  return (
    <button
      onClick={onClick}
      className={getButtonClasses()}
      title={label}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium leading-none">{label}</span>
    </button>
  );
};

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onAddShape, 
  onClearScene, 
  onToggleGrid, 
  isGridVisible 
}) => {
  const shapes: Array<{ type: Shape['type']; icon: React.ReactNode; label: string }> = [
    { type: 'cube', icon: <Box size={20} />, label: 'Cube' },
    { type: 'sphere', icon: <Circle size={20} />, label: 'Sphere' },
    { type: 'cylinder', icon: <Cylinder size={20} />, label: 'Cylinder' },
    { type: 'cone', icon: <Triangle size={20} />, label: 'Cone' },
    { type: 'pyramid', icon: <Pyramid size={20} />, label: 'Pyramid' },
  ];

  return (
    <div className="p-2 flex flex-col gap-2">
      {/* Shape Tools */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground px-2 mb-3">
          Shapes
        </div>
        {shapes.map((shape) => (
          <ToolButton
            key={shape.type}
            icon={shape.icon}
            label={shape.label}
            onClick={() => onAddShape(shape.type)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-2" />

      {/* View Tools */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground px-2 mb-3">
          View
        </div>
        <ToolButton
          icon={<Grid3X3 size={20} />}
          label="Grid"
          onClick={onToggleGrid}
          active={isGridVisible}
          variant="secondary"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-2" />

      {/* File Tools */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground px-2 mb-3">
          File
        </div>
        <ToolButton
          icon={<Upload size={20} />}
          label="Import"
          onClick={() => {
            // TODO: Implement import functionality
            console.log('Import functionality coming soon');
          }}
          variant="secondary"
        />
        <ToolButton
          icon={<Download size={20} />}
          label="Export"
          onClick={() => {
            // TODO: Implement export functionality
            console.log('Export functionality coming soon');
          }}
          variant="secondary"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-2" />

      {/* Scene Tools */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground px-2 mb-3">
          Scene
        </div>
        <ToolButton
          icon={<Trash2 size={20} />}
          label="Clear"
          onClick={onClearScene}
          variant="destructive"
        />
      </div>
    </div>
  );
};