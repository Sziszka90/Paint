import { Injectable } from '@angular/core';

import { PaintTool } from './paint-tool.service';

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StrokeStyle {
  color: string;
  size: number;
  compositeOperation: GlobalCompositeOperation;
}

@Injectable()
export class PaintDrawingEngineService {
  createStrokeStyle(tool: PaintTool, color: string, size: number): StrokeStyle {
    return {
      color,
      size,
      compositeOperation: tool === 'eraser' ? 'destination-out' : 'source-over',
    };
  }

  beginStroke(
    context: CanvasRenderingContext2D,
    point: DrawingPoint,
    style: StrokeStyle,
  ): void {
    this.applyStyle(context, style);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  extendStroke(context: CanvasRenderingContext2D, point: DrawingPoint): void {
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  drawShape(
    context: CanvasRenderingContext2D,
    tool: PaintTool,
    start: DrawingPoint,
    end: DrawingPoint,
    style: StrokeStyle,
  ): void {
    this.applyStyle(context, style);

    if (tool === 'line') {
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
      return;
    }

    const bounds = this.getBounds(start, end);

    if (tool === 'rectangle') {
      context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      return;
    }

    if (tool === 'ellipse') {
      context.beginPath();
      context.ellipse(
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        bounds.width / 2,
        bounds.height / 2,
        0,
        0,
        Math.PI * 2,
      );
      context.stroke();
    }
  }

  getBounds(start: DrawingPoint, end: DrawingPoint): DrawingBounds {
    return {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
    };
  }

  private applyStyle(context: CanvasRenderingContext2D, style: StrokeStyle): void {
    context.strokeStyle = style.color;
    context.lineWidth = style.size;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalCompositeOperation = style.compositeOperation;
  }
}
