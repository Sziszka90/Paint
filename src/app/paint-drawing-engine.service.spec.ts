import { vi } from 'vitest';

import { PaintDrawingEngineService } from './paint-drawing-engine.service';

function createContextMock() {
  return {
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    strokeRect: vi.fn(),
    ellipse: vi.fn(),
    strokeStyle: '',
    lineWidth: 0,
    lineCap: 'butt',
    lineJoin: 'miter',
    globalCompositeOperation: 'source-over',
  } as unknown as CanvasRenderingContext2D;
}

describe('PaintDrawingEngineService', () => {
  it('creates eraser strokes with destination-out compositing', () => {
    const engine = new PaintDrawingEngineService();

    expect(engine.createStrokeStyle('eraser', '#000000', 10)).toEqual({
      color: '#000000',
      size: 10,
      compositeOperation: 'destination-out',
    });
  });

  it('normalizes drawing bounds regardless of pointer direction', () => {
    const engine = new PaintDrawingEngineService();

    expect(engine.getBounds({ x: 50, y: 80 }, { x: 10, y: 20 })).toEqual({
      x: 10,
      y: 20,
      width: 40,
      height: 60,
    });
  });

  it('draws rectangles using normalized bounds', () => {
    const engine = new PaintDrawingEngineService();
    const context = createContextMock();

    engine.drawShape(
      context,
      'rectangle',
      { x: 80, y: 60 },
      { x: 20, y: 10 },
      engine.createStrokeStyle('rectangle', '#ff5500', 12),
    );

    expect(context.strokeStyle).toBe('#ff5500');
    expect(context.lineWidth).toBe(12);
    expect(context.strokeRect).toHaveBeenCalledWith(20, 10, 60, 50);
  });
});
