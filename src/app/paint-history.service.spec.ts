import { PaintHistoryService } from './paint-history.service';

describe('PaintHistoryService', () => {
  it('starts with a blank canvas state', () => {
    const service = new PaintHistoryService();

    expect(service.currentSnapshot()).toBeNull();
    expect(service.canUndo()).toBe(false);
    expect(service.canRedo()).toBe(false);
  });

  it('supports undo and redo across immutable snapshots', () => {
    const service = new PaintHistoryService();

    service.push('first');
    service.push('second');

    expect(service.currentSnapshot()).toBe('second');
    expect(service.canUndo()).toBe(true);

    expect(service.undo()).toBe('first');
    expect(service.canRedo()).toBe(true);

    expect(service.redo()).toBe('second');
    expect(service.canRedo()).toBe(false);
  });

  it('drops redo states when a new snapshot is added after undo', () => {
    const service = new PaintHistoryService();

    service.push('first');
    service.push('second');
    service.undo();
    service.push('third');

    expect(service.currentSnapshot()).toBe('third');
    expect(service.canRedo()).toBe(false);
    expect(service.undo()).toBe('first');
  });

  it('resets the stack to a supplied snapshot', () => {
    const service = new PaintHistoryService();

    service.push('first');
    service.reset('imported');

    expect(service.currentSnapshot()).toBe('imported');
    expect(service.canUndo()).toBe(false);
    expect(service.canRedo()).toBe(false);
  });
});
