import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { PaintCanvasBase } from './paint-canvas.base';

@Component({
  selector: 'app-paint-canvas',
  standalone: true,
  templateUrl: './paint-canvas.component.html',
  styleUrl: './paint-canvas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintCanvasComponent extends PaintCanvasBase {
  @ViewChild('canvas', { static: true })
  protected readonly canvasRef!: ElementRef<HTMLCanvasElement>;
}
