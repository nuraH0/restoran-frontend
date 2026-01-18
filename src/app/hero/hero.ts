import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements AfterViewInit {
  
  @ViewChild('menuButton') menuButton!: ElementRef<HTMLAnchorElement>;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const menuBtn = this.el.nativeElement.querySelector('.hero-button') as HTMLElement;
      const menuSection = document.getElementById('menu-section');
      
      if (menuBtn && menuSection) {
        this.renderer.listen(menuBtn, 'click', (e: Event) => {
          e.preventDefault();
          
          // 🎬 PERFECT SMOOTH SCROLL - HERO NEVIDLJIV!
          this.customSmoothScroll(menuSection);
        });
      }
    }, 100); 

    this.initTabs();
  }

  private customSmoothScroll(element: HTMLElement) {
    const startY = window.pageYOffset;
    const targetY = element.getBoundingClientRect().top + startY - 0; // 🎯 HERO NEVIDLJIV!
    const distance = targetY - startY;
    const duration = 2000; // 1.4s - lagano i elegantno
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 🌊 EASE-OUT QUINT - SUPER glatko usporavanje
      const easeOutQuint = 1 - Math.pow(1 - progress, 5);
      
      window.scrollTo(0, startY + distance * easeOutQuint);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  private initTabs() {
    const tabBtns = this.el.nativeElement.querySelectorAll('.tab-btn') as NodeListOf<HTMLElement>;
    const tabPanels = this.el.nativeElement.querySelectorAll('.tab-panel') as NodeListOf<HTMLElement>;

    tabBtns.forEach((btn) => {
      this.renderer.listen(btn, 'click', () => {
        // ❌ Ukloni sve active
        tabBtns.forEach(b => this.renderer.removeClass(b, 'active'));
        tabPanels.forEach(p => this.renderer.removeClass(p, 'active'));

        // ✅ Aktiviraj ovaj
        this.renderer.addClass(btn, 'active');
        
        const targetTab = btn.dataset['tab'];
        const targetPanel = this.el.nativeElement.querySelector(`#${targetTab}`) as HTMLElement;
        
        if (targetPanel) {
          this.renderer.addClass(targetPanel, 'active');
        }
      });
    });
  }
}
