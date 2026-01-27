import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-galerija-o-nama',
  standalone: true,
  templateUrl: './galerija-o-nama.html',
  styleUrls: ['./galerija-o-nama.scss']
})
export class GalerijaONamaComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;
  @ViewChild('indicators') indicators!: ElementRef<HTMLDivElement>;
  @ViewChild('carousel') carouselRef!: ElementRef<HTMLDivElement>;  // ✅ Za observer root

  private cardWidth = 324;
  private currentIndex = 0;
  private maxIndex = 0;
  private isDragging = false;
  private startX = 0;
  private currentTranslate = 0;
  
  // ✅ AUTO CENTER DETECTION
  private intersectionObserver?: IntersectionObserver;

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCarousel();
      this.initAutoCenterObserver();  // ✅ Dodano
      this.currentIndex = 0;
      this.updateCarousel();
      this.updateIndicators();
    }, 200);
  }

  ngOnDestroy() {
    // ✅ Cleanup
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private initCarousel() {
    const track = this.carouselTrack.nativeElement;
    const cards = track.querySelectorAll('.netflix-card').length;
    this.maxIndex = cards - 1;
    this.cardWidth = 324; // 300px + 24px gap
    
    console.log('👆 PERFECT DRAG + AUTO-CENTER:', { cards, maxIndex: this.maxIndex, cardWidth: this.cardWidth });
    
    this.initDrag();
  }

  // ✅ AUTO CENTER MAGIC - detektira >50% vidljive karte
  private initAutoCenterObserver() {
    if (!this.carouselRef?.nativeElement) return;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target as HTMLElement;
        if (entry.intersectionRatio > 0.5) {  // >50% vidljivo = centrirano
          card.classList.add('center-active');
          // Update indicators based on which card is center
          const cardIndex = Array.from(card.parentElement!.children).indexOf(card);
          if (cardIndex !== this.currentIndex) {
            this.currentIndex = cardIndex;
            this.updateIndicators();
          }
        } else {
          card.classList.remove('center-active');
        }
      });
    }, {
      root: this.carouselRef.nativeElement,  // Carousel kao viewport
      threshold: 0.5  // Trigger na 50%
    });

    // Observe sve karte
    this.carouselTrack.nativeElement.querySelectorAll('.netflix-card').forEach((card: HTMLElement) => {
      this.intersectionObserver!.observe(card);
    });
  }

  // ✅ Drag/Touch podrška (ostaje ista)
  private initDrag() {
    const track = this.carouselTrack.nativeElement;
    
    // Ukloni stare listener-e
    track.removeEventListener('mousedown', this.handleDragStart.bind(this));
    track.removeEventListener('touchstart', this.handleDragStart.bind(this));
    document.removeEventListener('mousemove', this.handleDragMove.bind(this));
    document.removeEventListener('touchmove', this.handleDragMove.bind(this));
    document.removeEventListener('mouseup', this.handleDragEnd.bind(this));
    document.removeEventListener('touchend', this.handleDragEnd.bind(this));
    
    // Dodaj nove listener-e
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
    this.carouselTrack.nativeElement.style.transition = 'none';
  }

  private handleDragMove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diffX = currentX - this.startX;
    
    // ✅ Real-time pomicanje
    const dragTranslate = this.currentTranslate + diffX;
    this.carouselTrack.nativeElement.style.transform = `translateX(${dragTranslate}px)`;
    
    this.startX = currentX;
  }

  private handleDragEnd(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    // ✅ Snap na najbližu kartu
    const snappedIndex = Math.round(-this.currentTranslate / this.cardWidth);
    this.currentIndex = Math.max(0, Math.min(snappedIndex, this.maxIndex));
    
    this.updateCarousel();
    this.updateIndicators();
    
    console.log('👆 DRAG END + AUTO-CENTER:', { snappedIndex: this.currentIndex });
  }

  private updateIndicators() {
    if (!this.indicators?.nativeElement) return;
    
    const dots = this.indicators.nativeElement.querySelectorAll('.indicator');
    dots.forEach((dot: HTMLElement, index: number) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  onIndicatorClick(index: number) {
    this.currentIndex = index;
    this.updateCarousel();
    this.updateIndicators();
  }

  private updateCarousel() {
    const track = this.carouselTrack?.nativeElement;
    if (!track) return;
    
    // 📦 Centriraj aktivnu kartu
    this.currentTranslate = -(this.currentIndex * this.cardWidth) + 50;
    track.style.transform = `translateX(${this.currentTranslate}px)`;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    console.log('📦 AUTO-CENTER POSITION:', { index: this.currentIndex, translate: this.currentTranslate });
  }
}
