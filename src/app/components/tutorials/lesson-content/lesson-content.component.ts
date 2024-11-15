import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Lesson} from "../../../models/lesson.model";
import {LessonsService} from "../../../services/lessons/lessons.service";

@Component({
  selector: 'lesson-content',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './lesson-content.component.html',
  styleUrl: './lesson-content.component.css'
})
export class LessonContentComponent implements OnInit, OnChanges {

  constructor(private lessonService: LessonsService) {
  }

  @ViewChild('lessonTop', { static: true }) lessonTop!: ElementRef;
  @Input() code: string = 'intro';
  @Output() nextLesson = new EventEmitter<void>();
  @Output() previousLesson = new EventEmitter<void>();
  
  lessons: Lesson[] = [];
  currentLesson!: Lesson;
  imageLoaded: boolean[] = [];
  selectedImage: string | null = null;
  selectedImageIndex: number = 0;

  ngOnInit(): void {
    this.lessons = this.lessonService.getLessons();
    this.currentLesson = this.lessons[0];
    this.setLesson(this.code);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code']) {
      this.setLesson(this.code);
      this.scrollToTop();
    }
  }

  setLesson(code: string): void {
    const lesson = this.lessonService.getLesson(code);
    this.currentLesson = !lesson ? this.lessons[0] : lesson;
    this.initializeImageStates();
  }

  private initializeImageStates(): void {
    if (this.currentLesson?.content?.images) {
      this.imageLoaded = new Array(this.currentLesson.content.images.length).fill(false);
    }
    this.selectedImage = null;
    this.selectedImageIndex = 0;
  }

  onNextLesson(): void {
    this.nextLesson.emit();
    // Small delay to ensure the lesson content has updated before scrolling
    setTimeout(() => {
      this.scrollToTop();
    }, 50);
  }

  onPreviousLesson(): void {
    this.previousLesson.emit();
    // Small delay to ensure the lesson content has updated before scrolling
    setTimeout(() => {
      this.scrollToTop();
    }, 50);
  }

  private scrollToTop(): void {
    if (this.lessonTop && this.lessonTop.nativeElement) {
      // Add highlight animation class
      this.lessonTop.nativeElement.classList.add('scroll-highlight');
      
      // Scroll to top
      this.lessonTop.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Remove highlight class after animation completes
      setTimeout(() => {
        if (this.lessonTop && this.lessonTop.nativeElement) {
          this.lessonTop.nativeElement.classList.remove('scroll-highlight');
        }
      }, 800);
    }
  }

  hasNextLesson(): boolean {
    return this.lessonService.hasNextLesson(this.code);
  }

  hasPreviousLesson(): boolean {
    return this.lessonService.hasPreviousLesson(this.code);
  }

  getCurrentLessonNumber(): number {
    return this.lessonService.getCurrentLessonIndex(this.code) + 1;
  }

  getTotalLessons(): number {
    return this.lessons.length;
  }

  // Image modal methods
  onImageLoad(index: number): void {
    this.imageLoaded[index] = true;
  }

  onImageError(index: number): void {
    this.imageLoaded[index] = true; // Hide loading placeholder even on error
  }

  openImageModal(imageSrc: string, index: number): void {
    this.selectedImage = imageSrc;
    this.selectedImageIndex = index;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeImageModal(): void {
    this.selectedImage = null;
    this.selectedImageIndex = 0;
    document.body.style.overflow = ''; // Restore scrolling
  }

  nextImage(): void {
    if (this.currentLesson?.content?.images && this.selectedImageIndex < this.currentLesson.content.images.length - 1) {
      this.selectedImageIndex++;
      this.selectedImage = this.currentLesson.content.images[this.selectedImageIndex];
    }
  }

  previousImage(): void {
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
      this.selectedImage = this.currentLesson.content.images[this.selectedImageIndex];
    }
  }
}
