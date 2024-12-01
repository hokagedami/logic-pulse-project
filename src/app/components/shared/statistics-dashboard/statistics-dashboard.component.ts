import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ProgressService, UserProgress } from '../../../services/progress/progress.service';

export interface StatisticCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './statistics-dashboard.component.html',
  styleUrl: './statistics-dashboard.component.css'
})
export class StatisticsDashboardComponent implements OnInit {
  userProgress!: UserProgress;
  statisticCards: StatisticCard[] = [];
  
  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    this.loadUserProgress();
    this.generateStatisticCards();
  }

  private loadUserProgress(): void {
    this.userProgress = this.progressService.getUserProgress();
  }

  private generateStatisticCards(): void {
    this.statisticCards = [
      {
        title: 'Lessons Completed',
        value: this.userProgress.completedLessons,
        icon: '✅',
        color: '#4caf50',
        description: `${this.userProgress.completedLessons} out of ${this.userProgress.totalLessons} lessons finished`
      },
      {
        title: 'Completion Rate',
        value: `${Math.round(this.userProgress.completionPercentage)}%`,
        icon: '📊',
        color: '#2196f3',
        description: 'Overall progress through the course'
      },
      {
        title: 'Learning Streak',
        value: `${this.userProgress.streakDays} ${this.userProgress.streakDays === 1 ? 'day' : 'days'}`,
        icon: '🔥',
        color: '#ff9800',
        description: 'Consecutive days of learning activity'
      },
      {
        title: 'Time Invested',
        value: this.formatTime(this.userProgress.totalTimeSpent),
        icon: '⏱️',
        color: '#9c27b0',
        description: 'Total time spent learning'
      },
      {
        title: 'Last Activity',
        value: this.formatLastActivity(),
        icon: '📅',
        color: '#607d8b',
        description: 'When you last completed a lesson'
      },
      {
        title: 'Average Session',
        value: this.calculateAverageSession(),
        icon: '📈',
        color: '#795548',
        description: 'Average time per completed lesson'
      }
    ];
  }

  private formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }

  private formatLastActivity(): string {
    if (!this.userProgress.lastActivity) {
      return 'Never';
    }

    const now = new Date();
    const lastActivity = new Date(this.userProgress.lastActivity);
    const diffTime = Math.abs(now.getTime() - lastActivity.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else {
      return 'Just now';
    }
  }

  private calculateAverageSession(): string {
    if (this.userProgress.completedLessons === 0) {
      return '0m';
    }
    
    const averageMinutes = Math.round(this.userProgress.totalTimeSpent / this.userProgress.completedLessons);
    return this.formatTime(averageMinutes);
  }

  getProgressLevel(): string {
    const percentage = this.userProgress.completionPercentage;
    
    if (percentage === 0) return 'Getting Started';
    if (percentage < 25) return 'Beginner';
    if (percentage < 50) return 'Learning';
    if (percentage < 75) return 'Intermediate';
    if (percentage < 100) return 'Advanced';
    return 'Expert';
  }

  getProgressMessage(): string {
    const percentage = this.userProgress.completionPercentage;
    
    if (percentage === 0) {
      return 'Start your learning journey today!';
    } else if (percentage < 25) {
      return 'You\'re off to a great start! Keep going!';
    } else if (percentage < 50) {
      return 'Making good progress! You\'re learning well!';
    } else if (percentage < 75) {
      return 'You\'re more than halfway there! Excellent work!';
    } else if (percentage < 100) {
      return 'Almost there! You\'re doing amazing!';
    } else {
      return 'Congratulations! You\'ve mastered the course!';
    }
  }

  refresh(): void {
    this.loadUserProgress();
    this.generateStatisticCards();
  }

  trackByTitle(index: number, card: StatisticCard): string {
    return card.title;
  }
}