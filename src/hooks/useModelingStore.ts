import { useState, useCallback } from 'react';
import { Shape } from '../components/ModelingEditor';

interface ModelingState {
  shapes: Shape[];
  selectedShapeId: string | null;
  currentColor: string;
  isGridVisible: boolean;
  history: Shape[][];
  historyIndex: number;
}

const initialState: ModelingState = {
  shapes: [],
  selectedShapeId: null,
  currentColor: '#3b82f6',
  isGridVisible: true,
  history: [[]],
  historyIndex: 0,
};

export const useModelingStore = () => {
  const [state, setState] = useState<ModelingState>(initialState);

  const saveToHistory = useCallback((shapes: Shape[]) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...shapes]);
      
      // Limit history to last 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const addShape = useCallback((shape: Shape) => {
    setState(prev => {
      const newShapes = [...prev.shapes, shape];
      saveToHistory(newShapes);
      return {
        ...prev,
        shapes: newShapes,
        selectedShapeId: shape.id,
      };
    });
  }, [saveToHistory]);

  const selectShape = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedShapeId: id,
    }));
  }, []);

  const updateShape = useCallback((id: string, updates: Partial<Shape>) => {
    setState(prev => {
      const newShapes = prev.shapes.map(shape =>
        shape.id === id ? { ...shape, ...updates } : shape
      );
      
      // Only save to history for significant changes (not during dragging)
      if (updates.position || updates.rotation || updates.scale) {
        saveToHistory(newShapes);
      }
      
      return {
        ...prev,
        shapes: newShapes,
      };
    });
  }, [saveToHistory]);

  const deleteShape = useCallback((id: string) => {
    setState(prev => {
      const newShapes = prev.shapes.filter(shape => shape.id !== id);
      saveToHistory(newShapes);
      return {
        ...prev,
        shapes: newShapes,
        selectedShapeId: prev.selectedShapeId === id ? null : prev.selectedShapeId,
      };
    });
  }, [saveToHistory]);

  const setCurrentColor = useCallback((color: string) => {
    setState(prev => ({
      ...prev,
      currentColor: color,
    }));
  }, []);

  const toggleGrid = useCallback(() => {
    setState(prev => ({
      ...prev,
      isGridVisible: !prev.isGridVisible,
    }));
  }, []);

  const clearScene = useCallback(() => {
    setState(prev => {
      saveToHistory([]);
      return {
        ...prev,
        shapes: [],
        selectedShapeId: null,
      };
    });
  }, [saveToHistory]);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          shapes: [...prev.history[newIndex]],
          historyIndex: newIndex,
          selectedShapeId: null,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          shapes: [...prev.history[newIndex]],
          historyIndex: newIndex,
          selectedShapeId: null,
        };
      }
      return prev;
    });
  }, []);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return {
    shapes: state.shapes,
    selectedShapeId: state.selectedShapeId,
    currentColor: state.currentColor,
    isGridVisible: state.isGridVisible,
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
    canRedo,
  };
};