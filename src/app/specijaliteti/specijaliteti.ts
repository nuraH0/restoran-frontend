import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-specijaliteti',  // ✅ Promijenjeno!
  standalone: true,
  templateUrl: './specijaliteti.html',  // ✅ Ispravno
  styleUrls: ['./specijaliteti.scss']
})
export class SpecijalitetiComponent implements AfterViewInit, OnDestroy {  // ✅ Export OK
  
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;
  @ViewChild('carousel') carouselRef!: ElementRef<HTMLDivElement>;

  private cardWidth = 324;
  private currentIndex = 0;
  private maxIndex = 0;
  private isDragging = false;
  private startX = 0;
  private currentTranslate = 0;
  
  private intersectionObserver?: IntersectionObserver;

  ngAfterViewInit() {
    setTimeout(() => {
      const resetCarousel = () => {
        const carousel = this.carouselRef?.nativeElement;
        const track = this.carouselTrack?.nativeElement;
        if (carousel) carousel.scrollLeft = 0;
        if (track) {
          track.scrollLeft = 0;
          track.style.transform = 'translateX(0px)';
        }
      };
      
      resetCarousel();
      setTimeout(resetCarousel, 200);
      setTimeout(resetCarousel, 500);
      
      this.initCarousel();
      this.initScrollAnimation();  // ✅ Stagger animacija
    }, 100);
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private initCarousel() {
    const track = this.carouselTrack.nativeElement;
    const cards = track.querySelectorAll('.netflix-card').length;
    this.maxIndex = cards - 1;
    this.initDrag();
  }

  // ✅ Netflix stagger animacija
  private initScrollAnimation() {
    const cards = this.carouselTrack.nativeElement.querySelectorAll('.netflix-card');
    cards.forEach((card: HTMLElement, i: number) => {
      card.style.animationDelay = `${i * 0.1}s`;
      card.classList.add('animate-card');
    });
  }

  // Drag logika (samo ključne metode)
  private initDrag() {
    const track = this.carouselTrack.nativeElement;
    track.addEventListener('mousedown', this.handleDragStart.bind(this));
    track.addEventListener('touchstart', this.handleDragStart.bind(this), { passive: true });
    document.addEventListener('mousemove', this.handleDragMove.bind(this));
    document.addEventListener('touchmove', this.handleDragMove.bind(this), { passive: false });
    document.addEventListener('mouseup', this.handleDragEnd.bind(this));
    document.addEventListener('touchend', this.handleDragEnd.bind(this));
  }

  private handleDragStart(e: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    (this.carouselTrack.nativeElement as HTMLElement).style.transition = 'none';
  }

  private handleDragMove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diffX = currentX - this.startX;
    const dragTranslate = this.currentTranslate + diffX;
    (this.carouselTrack.nativeElement as HTMLElement).style.transform = `translateX(${dragTranslate}px)`;
    this.startX = currentX;
  }

  private handleDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const snappedIndex = Math.round(-this.currentTranslate / this.cardWidth);
    this.currentIndex = Math.max(0, Math.min(snappedIndex, this.maxIndex));
    this.updateCarousel();
  }

  private updateCarousel() {
    const track = this.carouselTrack?.nativeElement as HTMLElement;
    if (!track) return;
    this.currentTranslate = -(this.currentIndex * this.cardWidth) + 50;
    track.style.transform = `translateX(${this.currentTranslate}px)`;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
}
