import { Component, OnInit, Input } from '@angular/core';
import { NgForOf, NgIf, DatePipe } from '@angular/common';
import { ProgressService } from '../../../services/progress/progress.service';

export interface ActivityEntry {
  id: string;
  type: 'lesson_completed' | 'lesson_started' | 'section_completed' | 'streak_milestone';
  lessonCode?: string;
  lessonTitle?: string;
  timestamp: Date;
  timeSpent?: number;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [NgForOf, NgIf, DatePipe],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.css'
})
export class RecentActivityComponent implements OnInit {
  @Input() maxItems: number = 10;
  @Input() showTitle: boolean = true;
  @Input() compact: boolean = false;

  activities: ActivityEntry[] = [];
  
  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    this.loadRecentActivities();
  }

  private loadRecentActivities(): void {
    // Get completed lessons from progress service
    const completedLessons = this.progressService.getCompletedLessons();
    const userProgress = this.progressService.getUserProgress();
    
    // Convert completed lessons to activity entries
    const lessonActivities: ActivityEntry[] = completedLessons.map(lesson => ({
      id: `lesson_${lesson.lessonCode}_${lesson.completedAt?.getTime()}`,
      type: 'lesson_completed',
      lessonCode: lesson.lessonCode,
      lessonTitle: this.getLessonTitle(lesson.lessonCode),
      timestamp: lesson.completedAt || new Date(),
      timeSpent: lesson.timeSpent,
      description: `Completed lesson: ${this.getLessonTitle(lesson.lessonCode)}`,
      icon: '✅',
      color: '#4caf50'
    }));

    // Add streak milestones
    const streakActivities: ActivityEntry[] = [];
    if (userProgress.streakDays >= 7) {
      streakActivities.push({
        id: `streak_weekly_${userProgress.streakDays}`,
        type: 'streak_milestone',
        timestamp: new Date(Date.now() - (userProgress.streakDays - 7) * 24 * 60 * 60 * 1000),
        description: `Achieved 7-day learning streak! 🔥`,
        icon: '🔥',
        color: '#ff9800'
      });
    }
    
    if (userProgress.streakDays >= 30) {
      streakActivities.push({
        id: `streak_monthly_${userProgress.streakDays}`,
        type: 'streak_milestone',
        timestamp: new Date(Date.now() - (userProgress.streakDays - 30) * 24 * 60 * 60 * 1000),
        description: `Amazing! 30-day learning streak achieved! 🚀`,
        icon: '🚀',
        color: '#9c27b0'
      });
    }

    // Add section completion milestones
    const sectionActivities: ActivityEntry[] = [];
    const completionPercentage = userProgress.completionPercentage;
    
    if (completionPercentage >= 25 && completionPercentage < 50) {
      sectionActivities.push({
        id: 'section_25_percent',
        type: 'section_completed',
        timestamp: this.estimateCompletionTime(0.25),
        description: 'Reached 25% course completion milestone! 🎯',
        icon: '🎯',
        color: '#2196f3'
      });
    }
    
    if (completionPercentage >= 50 && completionPercentage < 75) {
      sectionActivities.push({
        id: 'section_50_percent',
        type: 'section_completed',
        timestamp: this.estimateCompletionTime(0.5),
        description: 'Halfway there! 50% course completion! 🎊',
        icon: '🎊',
        color: '#ff5722'
      });
    }
    
    if (completionPercentage >= 75 && completionPercentage < 100) {
      sectionActivities.push({
        id: 'section_75_percent',
        type: 'section_completed',
        timestamp: this.estimateCompletionTime(0.75),
        description: 'Excellent progress! 75% course completion! 🌟',
        icon: '🌟',
        color: '#795548'
      });
    }
    
    if (completionPercentage === 100) {
      sectionActivities.push({
        id: 'section_100_percent',
        type: 'section_completed',
        timestamp: this.estimateCompletionTime(1.0),
        description: 'Course completed! Congratulations! 🏆',
        icon: '🏆',
        color: '#ffc107'
      });
    }

    // Combine all activities and sort by timestamp (newest first)
    this.activities = [...lessonActivities, ...streakActivities, ...sectionActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, this.maxItems);
  }

  private getLessonTitle(lessonCode: string): string {
    // This would typically come from the lessons service
    // For now, we'll generate a generic title
    const codeMap: { [key: string]: string } = {
      'intro': 'Introduction to Logic Gates',
      'and': 'AND Gate Fundamentals',
      'or': 'OR Gate Fundamentals',
      'not': 'NOT Gate Fundamentals',
      'nand': 'NAND Gate Operations',
      'nor': 'NOR Gate Operations',
      'xor': 'XOR Gate Logic',
      'complex': 'Complex Circuit Design',
      'truth-tables': 'Truth Tables',
      'boolean-algebra': 'Boolean Algebra'
    };
    
    return codeMap[lessonCode] || `Lesson ${lessonCode.toUpperCase()}`;
  }

  private estimateCompletionTime(percentage: number): Date {
    // Estimate when a percentage milestone was reached based on current progress
    const now = new Date();
    const userProgress = this.progressService.getUserProgress();
    
    if (userProgress.completedLessons === 0) {
      return now;
    }
    
    // Rough estimation: if user completed X% recently, back-calculate when they hit this milestone
    const estimatedDaysAgo = Math.max(1, (1 - percentage) * 30); // Assume 30 days max range
    return new Date(now.getTime() - estimatedDaysAgo * 24 * 60 * 60 * 1000);
  }

  formatTime(minutes?: number): string {
    if (!minutes || minutes === 0) {
      return '';
    }
    
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - timestamp.getTime());
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

  refresh(): void {
    this.loadRecentActivities();
  }

  trackByActivity(index: number, activity: ActivityEntry): string {
    return activity.id;
  }
}