import { Injectable, computed, signal } from '@angular/core';

export type PaintTool = 'brush' | 'eraser' | 'line' | 'rectangle' | 'ellipse';

@Injectable()
export class PaintToolService {
  private readonly selectedToolSignal = signal<PaintTool>('brush');
  private readonly colorSignal = signal('#134074');
  private readonly brushSizeSignal = signal(6);

  readonly selectedTool = this.selectedToolSignal.asReadonly();
  readonly color = this.colorSignal.asReadonly();
  readonly brushSize = this.brushSizeSignal.asReadonly();
  readonly isShapeTool = computed(() => {
    const tool = this.selectedToolSignal();
    return tool === 'line' || tool === 'rectangle' || tool === 'ellipse';
  });

  setSelectedTool(tool: PaintTool): void {
    this.selectedToolSignal.set(tool);
  }

  setColor(color: string): void {
    if (!color.trim()) {
      return;
    }

    this.colorSignal.set(color);
  }

  setBrushSize(size: number): void {
    const nextSize = Number.isFinite(size) ? Math.round(size) : this.brushSizeSignal();
    this.brushSizeSignal.set(Math.min(64, Math.max(1, nextSize)));
  }
}
