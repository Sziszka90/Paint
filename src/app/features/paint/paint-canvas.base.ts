import { AfterViewInit, Directive, ElementRef, signal } from '@angular/core';

export type PaintTool = 'brush' | 'eraser' | 'square' | 'circle';

@Directive()
export abstract class PaintCanvasBase implements AfterViewInit {
  protected abstract readonly canvasRef: ElementRef<HTMLCanvasElement>;

  public readonly brushColor = signal('#102a43');
  public readonly brushSize = signal(6);
  public readonly activeTool = signal<PaintTool>('brush');

  private context: CanvasRenderingContext2D | null = null;
  private isDrawing = false;
  private startPoint: { x: number; y: number } | null = null;
  private snapshot: ImageData | null = null;

  public ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    this.context = context;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }

  public updateBrushColor(color: string): void {
    this.brushColor.set(color);
  }

  public updateBrushSize(size: string): void {
    this.brushSize.set(Number(size));
  }

  public selectTool(tool: PaintTool): void {
    this.activeTool.set(tool);
  }

  public startStroke(event: PointerEvent): void {
    const point = this.getPoint(event);

    if (!point || !this.context) {
      return;
    }

    this.isDrawing = true;
    this.startPoint = point;
    this.snapshot = this.context.getImageData(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );

    if (this.activeTool() === 'brush' || this.activeTool() === 'eraser') {
      this.applyStrokeStyle(this.activeTool());
      this.context.beginPath();
      this.context.moveTo(point.x, point.y);
    }
  }

  public draw(event: PointerEvent): void {
    if (!this.isDrawing || !this.context) {
      return;
    }

    const point = this.getPoint(event);

    if (!point) {
      return;
    }

    if (this.activeTool() === 'brush' || this.activeTool() === 'eraser') {
      this.applyStrokeStyle(this.activeTool());
      this.context.lineTo(point.x, point.y);
      this.context.stroke();
      return;
    }

    if (!this.startPoint || !this.snapshot) {
      return;
    }

    this.context.putImageData(this.snapshot, 0, 0);
    this.applyStrokeStyle('brush');

    if (this.activeTool() === 'square') {
      this.drawSquare(this.startPoint, point);
      return;
    }

    this.drawCircle(this.startPoint, point);
  }

  public endStroke(event?: PointerEvent): void {
    if (!this.context) {
      return;
    }

    if (
      event &&
      this.isDrawing &&
      (this.activeTool() === 'square' || this.activeTool() === 'circle')
    ) {
      this.draw(event);
    }

    this.isDrawing = false;
    this.context.closePath();
    this.context.globalCompositeOperation = 'source-over';
    this.startPoint = null;
    this.snapshot = null;
  }

  public clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;

    if (!this.context) {
      return;
    }

    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  public isToolSelected(tool: PaintTool): boolean {
    return this.activeTool() === tool;
  }

  private applyStrokeStyle(tool: PaintTool): void {
    if (!this.context) {
      return;
    }

    this.context.lineWidth = this.brushSize();
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';

    if (tool === 'eraser') {
      this.context.globalCompositeOperation = 'destination-out';
      this.context.strokeStyle = 'rgba(0, 0, 0, 1)';
      return;
    }

    this.context.globalCompositeOperation = 'source-over';
    this.context.strokeStyle = this.brushColor();
  }

  private drawSquare(start: { x: number; y: number }, end: { x: number; y: number }): void {
    if (!this.context) {
      return;
    }

    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const size = Math.max(Math.abs(deltaX), Math.abs(deltaY));
    const width = Math.sign(deltaX || 1) * size;
    const height = Math.sign(deltaY || 1) * size;

    this.context.beginPath();
    this.context.strokeRect(start.x, start.y, width, height);
    this.context.closePath();
  }

  private drawCircle(start: { x: number; y: number }, end: { x: number; y: number }): void {
    if (!this.context) {
      return;
    }

    const radius = Math.hypot(end.x - start.x, end.y - start.y);

    this.context.beginPath();
    this.context.arc(start.x, start.y, radius, 0, Math.PI * 2);
    this.context.stroke();
    this.context.closePath();
  }

  private getPoint(event: PointerEvent): { x: number; y: number } | null {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return null;
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
}
