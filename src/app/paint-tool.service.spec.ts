import { PaintToolService } from './paint-tool.service';

describe('PaintToolService', () => {
  it('tracks the active tool and shape mode', () => {
    const service = new PaintToolService();

    expect(service.selectedTool()).toBe('brush');
    expect(service.isShapeTool()).toBe(false);

    service.setSelectedTool('rectangle');

    expect(service.selectedTool()).toBe('rectangle');
    expect(service.isShapeTool()).toBe(true);
  });

  it('clamps the brush size to a safe range', () => {
    const service = new PaintToolService();

    service.setBrushSize(0);
    expect(service.brushSize()).toBe(1);

    service.setBrushSize(200);
    expect(service.brushSize()).toBe(64);
  });

  it('ignores blank color updates', () => {
    const service = new PaintToolService();

    service.setColor('');
    expect(service.color()).toBe('#134074');

    service.setColor('#ff0054');
    expect(service.color()).toBe('#ff0054');
  });
});
