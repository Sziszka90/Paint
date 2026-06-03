import { Injectable, computed, signal } from '@angular/core';

export type CanvasSnapshot = string | null;

@Injectable()
export class PaintHistoryService {
  private readonly snapshotsSignal = signal<ReadonlyArray<CanvasSnapshot>>([null]);
  private readonly currentIndexSignal = signal(0);

  readonly currentSnapshot = computed(
    () => this.snapshotsSignal()[this.currentIndexSignal()] ?? null,
  );
  readonly canUndo = computed(() => this.currentIndexSignal() > 0);
  readonly canRedo = computed(
    () => this.currentIndexSignal() < this.snapshotsSignal().length - 1,
  );

  reset(snapshot: CanvasSnapshot = null): CanvasSnapshot {
    this.snapshotsSignal.set([snapshot]);
    this.currentIndexSignal.set(0);
    return snapshot;
  }

  push(snapshot: CanvasSnapshot): CanvasSnapshot {
    const snapshots = this.snapshotsSignal();
    const currentIndex = this.currentIndexSignal();
    const currentSnapshot = snapshots[currentIndex] ?? null;

    if (currentSnapshot === snapshot) {
      return currentSnapshot;
    }

    const nextSnapshots = [...snapshots.slice(0, currentIndex + 1), snapshot];
    this.snapshotsSignal.set(nextSnapshots);
    this.currentIndexSignal.set(nextSnapshots.length - 1);

    return snapshot;
  }

  undo(): CanvasSnapshot {
    if (!this.canUndo()) {
      return this.currentSnapshot();
    }

    this.currentIndexSignal.update((value) => value - 1);
    return this.currentSnapshot();
  }

  redo(): CanvasSnapshot {
    if (!this.canRedo()) {
      return this.currentSnapshot();
    }

    this.currentIndexSignal.update((value) => value + 1);
    return this.currentSnapshot();
  }
}
