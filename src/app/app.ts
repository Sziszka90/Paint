import {
  AfterViewInit,
  Component,
  ElementRef,
  computed,
  inject,
  viewChild,
} from '@angular/core';

import { PaintCanvasService } from './paint-canvas.service';
import { PaintDrawingEngineService } from './paint-drawing-engine.service';
import { PaintHistoryService } from './paint-history.service';
import { PaintTool, PaintToolService } from './paint-tool.service';

interface ToolOption {
  id: PaintTool;
  label: string;
  shortcut: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    PaintToolService,
    PaintHistoryService,
    PaintDrawingEngineService,
    PaintCanvasService,
  ],
})
export class App implements AfterViewInit {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('paintSurface');
  private readonly fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  private readonly canvasService = inject(PaintCanvasService);
  private readonly toolService = inject(PaintToolService);

  protected readonly tools: ToolOption[] = [
    { id: 'brush', label: 'Brush', shortcut: 'B' },
    { id: 'eraser', label: 'Eraser', shortcut: 'E' },
    { id: 'line', label: 'Line', shortcut: 'L' },
    { id: 'rectangle', label: 'Rectangle', shortcut: 'R' },
    { id: 'ellipse', label: 'Ellipse', shortcut: 'O' },
  ];

  protected readonly selectedTool = this.toolService.selectedTool;
  protected readonly color = this.toolService.color;
  protected readonly brushSize = this.toolService.brushSize;
  protected readonly canUndo = this.canvasService.canUndo;
  protected readonly canRedo = this.canvasService.canRedo;
  protected readonly statusMessage = this.canvasService.statusMessage;

  protected readonly selectedToolLabel = computed(
    () => this.tools.find((tool) => tool.id === this.selectedTool())?.label ?? 'Brush',
  );
  protected readonly surfaceSizeLabel = computed(() => {
    const surface = this.canvasService.surfaceSize();
    if (!surface.width || !surface.height) {
      return 'Sizing canvas…';
    }

    return `${surface.width} × ${surface.height}`;
  });

  ngAfterViewInit(): void {
    this.canvasService.attach(this.canvasRef().nativeElement);
  }

  protected selectTool(tool: PaintTool): void {
    this.toolService.setSelectedTool(tool);
  }

  protected updateColor(event: Event): void {
    this.toolService.setColor((event.target as HTMLInputElement).value);
  }

  protected updateBrushSize(event: Event): void {
    this.toolService.setBrushSize(Number((event.target as HTMLInputElement).value));
  }

  protected undo(): void {
    void this.canvasService.undo();
  }

  protected redo(): void {
    void this.canvasService.redo();
  }

  protected clearCanvas(): void {
    this.canvasService.clear();
  }

  protected triggerImport(): void {
    this.fileInputRef().nativeElement.click();
  }

  protected async importImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    await this.canvasService.importImage(file);
    input.value = '';
  }

  protected exportImage(): void {
    this.canvasService.exportPng();
  }
}
