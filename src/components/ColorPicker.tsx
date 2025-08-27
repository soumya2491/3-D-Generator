import React, { useState } from 'react';
import { ChevronDown, Palette } from 'lucide-react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Orange
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#a855f7', // Violet
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#94a3b8', // Gray
  '#64748b', // Slate
  '#78716c', // Stone
  '#ffffff', // White
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  currentColor, 
  onColorChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-surface border border-border rounded-lg hover:bg-muted/80 transition-colors"
      >
        <div 
          className="w-5 h-5 rounded border-2 border-border shadow-sm"
          style={{ backgroundColor: currentColor }}
        />
        <Palette size={16} className="text-muted-foreground" />
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Color Picker Dropdown */}
          <div className="absolute top-full mt-2 right-0 z-20 w-64 bg-gradient-glass backdrop-blur-sm border border-border rounded-lg shadow-lg p-4">
            <div className="space-y-4">
              {/* Custom Color Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Custom Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-12 h-8 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="flex-1 px-2 py-1 bg-input border border-border rounded text-sm font-mono"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Preset Colors */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Preset Colors
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        onColorChange(color);
                        setIsOpen(false);
                      }}
                      className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${
                        currentColor === color 
                          ? 'border-selection shadow-glow' 
                          : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Material Presets */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Material Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Metal', color: '#8e9aaf' },
                    { name: 'Gold', color: '#ffd700' },
                    { name: 'Copper', color: '#b87333' },
                    { name: 'Wood', color: '#8b4513' },
                  ].map((material) => (
                    <button
                      key={material.name}
                      onClick={() => {
                        onColorChange(material.color);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-2 py-1 bg-muted/50 hover:bg-muted/80 rounded text-sm transition-colors"
                    >
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: material.color }}
                      />
                      <span className="text-foreground">{material.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};