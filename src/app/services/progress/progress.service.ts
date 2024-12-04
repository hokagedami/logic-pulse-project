import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LessonProgress {
  lessonCode: string;
  completed: boolean;
  completedAt?: Date;
  timeSpent?: number; // in minutes
}

export interface UserProgress {
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  totalTimeSpent: number;
  streakDays: number;
  lastActivity?: Date;
}

export interface ActivityLog {
  id: string;
  type: 'lesson_completed' | 'challenge_completed' | 'circuit_created';
  title: string;
  timestamp: Date;
  details?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly STORAGE_KEY = 'logic_pulse_progress';
  private readonly ACTIVITY_KEY = 'logic_pulse_activity';
  
  private progressSubject = new BehaviorSubject<Map<string, LessonProgress>>(new Map());
  private activitySubject = new BehaviorSubject<ActivityLog[]>([]);
  
  public progress$: Observable<Map<string, LessonProgress>> = this.progressSubject.asObservable();
  public activity$: Observable<ActivityLog[]> = this.activitySubject.asObservable();

  constructor() {
    this.loadProgress();
    this.loadActivity();
  }

  /**
   * Mark a lesson as completed
   */
  markLessonComplete(lessonCode: string, timeSpent: number = 0): void {
    const currentProgress = this.progressSubject.value;
    const lessonProgress: LessonProgress = {
      lessonCode,
      completed: true,
      completedAt: new Date(),
      timeSpent
    };
    
    currentProgress.set(lessonCode, lessonProgress);
    this.progressSubject.next(currentProgress);
    this.saveProgress();
    
    // Add to activity log
    this.addActivity({
      id: Date.now().toString(),
      type: 'lesson_completed',
      title: `Completed lesson: ${lessonCode}`,
      timestamp: new Date(),
      details: timeSpent > 0 ? `Time spent: ${timeSpent} minutes` : undefined
    });
  }

  /**
   * Mark a lesson as incomplete
   */
  markLessonIncomplete(lessonCode: string): void {
    const currentProgress = this.progressSubject.value;
    const lessonProgress: LessonProgress = {
      lessonCode,
      completed: false
    };
    
    currentProgress.set(lessonCode, lessonProgress);
    this.progressSubject.next(currentProgress);
    this.saveProgress();
  }

  /**
   * Check if a lesson is completed
   */
  isLessonCompleted(lessonCode: string): boolean {
    const progress = this.progressSubject.value.get(lessonCode);
    return progress?.completed || false;
  }

  /**
   * Get overall user progress statistics
   */
  getUserProgress(totalLessonsAvailable: number = 10): UserProgress {
    const progressMap = this.progressSubject.value;
    const completedLessons = Array.from(progressMap.values()).filter(p => p.completed).length;
    const totalTimeSpent = Array.from(progressMap.values())
      .reduce((total, progress) => total + (progress.timeSpent || 0), 0);
    
    const completionPercentage = totalLessonsAvailable > 0 
      ? Math.round((completedLessons / totalLessonsAvailable) * 100) 
      : 0;

    return {
      totalLessons: totalLessonsAvailable,
      completedLessons,
      completionPercentage,
      totalTimeSpent,
      streakDays: this.calculateStreak(),
      lastActivity: this.getLastActivityDate()
    };
  }

  /**
   * Get progress for a specific lesson
   */
  getLessonProgress(lessonCode: string): LessonProgress | undefined {
    return this.progressSubject.value.get(lessonCode);
  }

  /**
   * Add activity to log
   */
  addActivity(activity: ActivityLog): void {
    const currentActivity = this.activitySubject.value;
    currentActivity.unshift(activity); // Add to beginning
    
    // Keep only last 50 activities
    if (currentActivity.length > 50) {
      currentActivity.splice(50);
    }
    
    this.activitySubject.next(currentActivity);
    this.saveActivity();
  }

  /**
   * Get recent activities (last N items)
   */
  getRecentActivities(limit: number = 10): ActivityLog[] {
    return this.activitySubject.value.slice(0, limit);
  }

  /**
   * Calculate completion percentage for a specific section
   */
  getSectionProgress(lessonCodes: string[]): number {
    if (lessonCodes.length === 0) return 0;
    
    const completedCount = lessonCodes.filter(code => this.isLessonCompleted(code)).length;
    return Math.round((completedCount / lessonCodes.length) * 100);
  }

  /**
   * Get today's learning statistics
   */
  getTodayStats(): { lessonsCompleted: number; timeSpent: number } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayActivities = this.activitySubject.value.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    });

    const lessonsCompleted = todayActivities.filter(a => a.type === 'lesson_completed').length;
    
    // Calculate time spent today (rough estimate from activities)
    const timeSpent = lessonsCompleted * 5; // Assume 5 minutes per lesson on average
    
    return { lessonsCompleted, timeSpent };
  }

  /**
   * Get completed lessons
   */
  getCompletedLessons(): LessonProgress[] {
    return Array.from(this.progressSubject.value.values()).filter(progress => progress.completed);
  }

  /**
   * Reset all progress (for testing/demo purposes)
   */
  resetProgress(): void {
    this.progressSubject.next(new Map());
    this.activitySubject.next([]);
    this.saveProgress();
    this.saveActivity();
  }

  private loadProgress(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const progressArray = JSON.parse(stored);
        const progressMap = new Map<string, LessonProgress>();
        
        progressArray.forEach((item: any) => {
          if (item.completedAt) {
            item.completedAt = new Date(item.completedAt);
          }
          progressMap.set(item.lessonCode, item);
        });
        
        this.progressSubject.next(progressMap);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }

  private saveProgress(): void {
    try {
      const progressArray = Array.from(this.progressSubject.value.values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progressArray));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  private loadActivity(): void {
    try {
      const stored = localStorage.getItem(this.ACTIVITY_KEY);
      if (stored) {
        const activities = JSON.parse(stored).map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }));
        this.activitySubject.next(activities);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    }
  }

  private saveActivity(): void {
    try {
      const activities = this.activitySubject.value;
      localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  }

  private calculateStreak(): number {
    const activities = this.activitySubject.value;
    if (activities.length === 0) return 0;

    const today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    let streakDays = 0;
    let currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);

    // Check each day backwards from today
    while (true) {
      const hasActivityOnDate = activities.some(activity => {
        const activityDate = new Date(activity.timestamp);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === currentDate.getTime();
      });

      if (hasActivityOnDate) {
        streakDays++;
        currentDate = new Date(currentDate.getTime() - oneDayMs);
      } else {
        break;
      }
    }

    return streakDays;
  }

  private getLastActivityDate(): Date | undefined {
    const activities = this.activitySubject.value;
    return activities.length > 0 ? activities[0].timestamp : undefined;
  }
}