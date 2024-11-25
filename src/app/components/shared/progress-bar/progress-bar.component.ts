import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  @Input() progress: number = 0; // Progress percentage (0-100)
  @Input() height: string = '8px';
  @Input() backgroundColor: string = '#e0e0e0';
  @Input() progressColor: string = '#4caf50';
  @Input() showPercentage: boolean = true;
  @Input() showLabel: boolean = false;
  @Input() label: string = '';
  @Input() animated: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  progressWidth: string = '0%';
  displayProgress: number = 0;

  ngOnInit(): void {
    this.updateProgress();
  }

  ngOnChanges(): void {
    this.updateProgress();
  }

  private updateProgress(): void {
    // Ensure progress is within bounds
    this.displayProgress = Math.max(0, Math.min(100, this.progress));
    
    if (this.animated) {
      // Animate progress bar
      setTimeout(() => {
        this.progressWidth = `${this.displayProgress}%`;
      }, 100);
    } else {
      this.progressWidth = `${this.displayProgress}%`;
    }
  }

  get barHeight(): string {
    switch (this.size) {
      case 'small': return '4px';
      case 'large': return '12px';
      default: return this.height;
    }
  }

  get textSize(): string {
    switch (this.size) {
      case 'small': return '0.75rem';
      case 'large': return '1.1rem';
      default: return '0.9rem';
    }
  }
}