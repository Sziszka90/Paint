import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';

import { DrawingPoint, PaintDrawingEngineService } from './paint-drawing-engine.service';
import { CanvasSnapshot, PaintHistoryService } from './paint-history.service';
import { PaintTool, PaintToolService } from './paint-tool.service';

interface ActiveGesture {
  pointerId: number;
  tool: PaintTool;
  start: DrawingPoint;
  last: DrawingPoint;
  moved: boolean;
  baseImage: ImageData | null;
}

interface SurfaceSize {
  width: number;
  height: number;
}

@Injectable()
export class PaintCanvasService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly drawingEngine = inject(PaintDrawingEngineService);
  private readonly history = inject(PaintHistoryService);
  private readonly toolService = inject(PaintToolService);

  readonly canUndo = this.history.canUndo;
  readonly canRedo = this.history.canRedo;
  readonly statusMessage = signal('Ready for the first stroke.');
  readonly surfaceSize = signal<SurfaceSize>({ width: 0, height: 0 });

  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private activeGesture: ActiveGesture | null = null;
  private resizeObserver: ResizeObserver | null = null;

  attach(canvas: HTMLCanvasElement): void {
    if (this.canvas === canvas) {
      return;
    }

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    if (!this.context) {
      this.statusMessage.set('Canvas rendering is not available in this environment.');
      return;
    }

    this.canvas.style.touchAction = 'none';
    this.configureContextDefaults();
    this.bindCanvasEvents();
    this.observeResize();
    this.history.reset(null);
    void this.resizeCanvas();
  }

  async undo(): Promise<void> {
    await this.applySnapshot(this.history.undo());
    this.statusMessage.set('Undid the last action.');
  }

  async redo(): Promise<void> {
    await this.applySnapshot(this.history.redo());
    this.statusMessage.set('Reapplied the next action.');
  }

  clear(): void {
    if (!this.context || !this.canvas) {
      return;
    }

    this.clearSurface();
    this.history.push(null);
    this.statusMessage.set('Canvas cleared.');
  }

  async importImage(file: File): Promise<void> {
    if (!this.context || !this.canvas || !file.type.startsWith('image/')) {
      return;
    }

    const source = await this.readFileAsDataUrl(file);
    const image = await this.loadImage(source);

    this.clearSurface();
    const rect = this.getContainedRect(
      image.naturalWidth,
      image.naturalHeight,
      this.canvas.width,
      this.canvas.height,
    );
    this.context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    this.history.push(this.captureSnapshot());
    this.statusMessage.set(`Imported ${file.name}.`);
  }

  exportPng(): void {
    if (!this.canvas) {
      return;
    }

    const fileName = `paint-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    this.canvas.toBlob((blob) => {
      if (!blob) {
        this.downloadDataUrl(this.canvas?.toDataURL('image/png') ?? '', fileName);
        return;
      }

      const url = URL.createObjectURL(blob);
      this.downloadDataUrl(url, fileName, true);
    }, 'image/png');
  }

  getContainedRect(
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number,
  ): { x: number; y: number; width: number; height: number } {
    const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;

    return {
      x: (targetWidth - width) / 2,
      y: (targetHeight - height) / 2,
      width,
      height,
    };
  }

  private bindCanvasEvents(): void {
    if (!this.canvas) {
      return;
    }

    fromEvent<PointerEvent>(this.canvas, 'pointerdown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.handlePointerDown(event));

    fromEvent<PointerEvent>(this.canvas, 'pointermove')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.handlePointerMove(event));

    merge(
      fromEvent<PointerEvent>(window, 'pointerup'),
      fromEvent<PointerEvent>(window, 'pointercancel'),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => void this.handlePointerUp(event));

    fromEvent<KeyboardEvent>(window, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => void this.handleKeyboardShortcut(event));
  }

  private observeResize(): void {
    if (!this.canvas || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => {
      void this.resizeCanvas();
    });

    this.resizeObserver.observe(this.canvas);
    if (this.canvas.parentElement) {
      this.resizeObserver.observe(this.canvas.parentElement);
    }

    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
    });
  }

  private async resizeCanvas(): Promise<void> {
    if (!this.canvas) {
      return;
    }

    const snapshot = this.history.currentSnapshot();
    const rect = this.canvas.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = Math.max(240, Math.round((rect.width || this.canvas.clientWidth || 960) * devicePixelRatio));
    const fallbackHeight = (rect.width || this.canvas.clientWidth || 960) * 0.75;
    const height = Math.max(180, Math.round((rect.height || this.canvas.clientHeight || fallbackHeight) * devicePixelRatio));

    if (this.canvas.width === width && this.canvas.height === height) {
      return;
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.surfaceSize.set({
      width: Math.round(width / devicePixelRatio),
      height: Math.round(height / devicePixelRatio),
    });

    this.context = this.canvas.getContext('2d');
    if (!this.context) {
      return;
    }

    this.configureContextDefaults();
    await this.applySnapshot(snapshot, false);
  }

  private configureContextDefaults(): void {
    if (!this.context) {
      return;
    }

    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
  }

  private handlePointerDown(event: PointerEvent): void {
    if (!this.canvas || !this.context) {
      return;
    }

    const isPrimaryButton = event.button === 0 || event.pointerType === 'touch' || event.pointerType === 'pen';
    if (!isPrimaryButton) {
      return;
    }

    event.preventDefault();

    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch {
      return;
    }

    const point = this.toCanvasPoint(event);
    const tool = this.toolService.selectedTool();
    this.activeGesture = {
      pointerId: event.pointerId,
      tool,
      start: point,
      last: point,
      moved: false,
      baseImage: this.toolService.isShapeTool()
        ? this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        : null,
    };

    if (tool === 'brush' || tool === 'eraser') {
      this.drawingEngine.beginStroke(this.context, point, this.getStrokeStyle(tool));
    }
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.context || !this.activeGesture || this.activeGesture.pointerId !== event.pointerId) {
      return;
    }

    const point = this.toCanvasPoint(event);
    const gesture = this.activeGesture;
    gesture.moved = gesture.moved || point.x !== gesture.last.x || point.y !== gesture.last.y;

    if (gesture.tool === 'brush' || gesture.tool === 'eraser') {
      this.drawingEngine.extendStroke(this.context, point);
      gesture.last = point;
      return;
    }

    if (!gesture.baseImage) {
      return;
    }

    this.context.putImageData(gesture.baseImage, 0, 0);
    this.drawingEngine.drawShape(
      this.context,
      gesture.tool,
      gesture.start,
      point,
      this.getStrokeStyle(gesture.tool),
    );
    gesture.last = point;
  }

  private async handlePointerUp(event: PointerEvent): Promise<void> {
    if (!this.context || !this.activeGesture || this.activeGesture.pointerId !== event.pointerId) {
      return;
    }

    const gesture = this.activeGesture;
    const point = this.toCanvasPoint(event);

    if (gesture.tool === 'line' || gesture.tool === 'rectangle' || gesture.tool === 'ellipse') {
      if (gesture.baseImage) {
        this.context.putImageData(gesture.baseImage, 0, 0);
      }

      if (gesture.moved) {
        this.drawingEngine.drawShape(
          this.context,
          gesture.tool,
          gesture.start,
          point,
          this.getStrokeStyle(gesture.tool),
        );
      }
    }

    try {
      this.canvas?.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore browsers that do not support pointer capture release for the current state.
    }

    this.activeGesture = null;

    const shouldCommit = gesture.tool === 'brush' || gesture.tool === 'eraser' || gesture.moved;
    if (!shouldCommit) {
      this.statusMessage.set('Drag to place a shape.');
      return;
    }

    this.history.push(this.captureSnapshot());
    this.statusMessage.set(`${this.describeTool(gesture.tool)} applied.`);
  }

  private async handleKeyboardShortcut(event: KeyboardEvent): Promise<void> {
    if (this.isFormControl(event.target)) {
      return;
    }

    const key = event.key.toLowerCase();

    if (event.ctrlKey || event.metaKey) {
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        await this.undo();
        return;
      }

      if (key === 'y' || (key === 'z' && event.shiftKey)) {
        event.preventDefault();
        await this.redo();
        return;
      }

      if (key === 'c') {
        event.preventDefault();
        this.clear();
        return;
      }
    }

    switch (key) {
      case 'b':
        this.toolService.setSelectedTool('brush');
        break;
      case 'e':
        this.toolService.setSelectedTool('eraser');
        break;
      case 'l':
        this.toolService.setSelectedTool('line');
        break;
      case 'r':
        this.toolService.setSelectedTool('rectangle');
        break;
      case 'o':
        this.toolService.setSelectedTool('ellipse');
        break;
      default:
        break;
    }
  }

  private isFormControl(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName);
  }

  private toCanvasPoint(event: PointerEvent): DrawingPoint {
    if (!this.canvas) {
      return { x: 0, y: 0 };
    }

    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * this.canvas.height,
    };
  }

  private getStrokeStyle(tool: PaintTool) {
    return this.drawingEngine.createStrokeStyle(
      tool,
      this.toolService.color(),
      this.toolService.brushSize(),
    );
  }

  private captureSnapshot(): CanvasSnapshot {
    return this.canvas?.toDataURL('image/png') ?? null;
  }

  private async applySnapshot(snapshot: CanvasSnapshot, announce = true): Promise<void> {
    if (!this.context || !this.canvas) {
      return;
    }

    this.clearSurface();

    if (!snapshot) {
      if (announce) {
        this.statusMessage.set('Canvas restored to blank state.');
      }
      return;
    }

    const image = await this.loadImage(snapshot);
    this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

    if (announce) {
      this.statusMessage.set('Canvas snapshot restored.');
    }
  }

  private clearSurface(): void {
    if (!this.context || !this.canvas) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private loadImage(source: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Unable to load image.'));
      image.src = source;
    });
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error ?? new Error('Unable to read file.'));
      reader.readAsDataURL(file);
    });
  }

  private downloadDataUrl(source: string, fileName: string, revoke = false): void {
    const anchor = document.createElement('a');
    anchor.href = source;
    anchor.download = fileName;
    anchor.click();

    if (revoke) {
      queueMicrotask(() => {
        URL.revokeObjectURL(source);
      });
    }
  }

  private describeTool(tool: PaintTool): string {
    switch (tool) {
      case 'brush':
        return 'Brush stroke';
      case 'eraser':
        return 'Eraser stroke';
      case 'line':
        return 'Line';
      case 'rectangle':
        return 'Rectangle';
      case 'ellipse':
        return 'Ellipse';
    }
  }
}
