import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('menuButton') menuButton!: ElementRef<HTMLAnchorElement>;
  private observer: IntersectionObserver | null = null;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const menuBtn = this.el.nativeElement.querySelector('.hero-button') as HTMLElement;
      const menuSection = document.getElementById('menu-section');
      
      if (menuBtn && menuSection) {
        this.renderer.listen(menuBtn, 'click', (e: Event) => {
          e.preventDefault();
          this.customSmoothScroll(menuSection);
        });
      }
    }, 100); 

    this.initTabs();
    this.initScrollAnimations(); // 🔥 NOVO - SCROLL ANIMACIJE
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private customSmoothScroll(element: HTMLElement) {
    const startY = window.pageYOffset;
    const targetY = element.getBoundingClientRect().top + startY - 0;
    const distance = targetY - startY;
    const duration = 1700;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
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

    tabBtns.forEach((btn, index) => {
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
          
          // 🎬 Animiraj sadržaj tab-a nakon što se pojavi
          setTimeout(() => {
            this.animateTabContent(targetPanel, index);
          }, 100);
        }
      });
    });
  }

  /**
   * 🔥 SCROLL-TRIGGERED ANIMACIJE - Michelin level
   */
  private initScrollAnimations() {
    const menuSection = document.getElementById('menu-section');
    
    if (!menuSection) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 🎯 Aktiviraj glavnu sekciju
          this.renderer.addClass(entry.target as HTMLElement, 'animate-section');
          
          // 🎬 Animiraj sve elemente unutar sekcije
          const elementsToAnimate = entry.target.querySelectorAll(
            '.section-title, .tab-btn, .tabs-content, .menu-item, .tab-panel h3'
          ) as NodeListOf<HTMLElement>;
          
          elementsToAnimate.forEach((el, index) => {
            // Staggered delay za svaki element
            setTimeout(() => {
              this.renderer.addClass(el, 'animate');
            }, index * 80); // 80ms između svakog elementa
          });
          
          // 🛑 Observer se disconnect-a nakon prvog ulaska
          this.observer?.disconnect();
        }
      });
    }, {
      threshold: 0.15, // Počni kada je 15% vidljivo
      rootMargin: '-50px 0px -10% 0px' // Počni malo ranije
    });

    this.observer.observe(menuSection);
  }

  /**
   * 🎨 Animiraj sadržaj aktivnog tab-a (jela)
   */
  private animateTabContent(panel: HTMLElement, tabIndex: number) {
    const menuItems = panel.querySelectorAll('.menu-item') as NodeListOf<HTMLElement>;
    const panelTitle = panel.querySelector('h3') as HTMLElement;
    
    // Naslov tab-a
    if (panelTitle) {
      setTimeout(() => {
        this.renderer.addClass(panelTitle, 'animate');
      }, 150);
    }
    
    // Jela - staggered animacija
    menuItems.forEach((item, index) => {
      setTimeout(() => {
        this.renderer.addClass(item, 'animate');
      }, 250 + (index * 120)); // 120ms između svakog jela
    });
  }

  /**
   * 🧹 Utility - ukloni sve animacije (cleanup)
   */
  private resetAnimations() {
    const animatedElements = this.el.nativeElement.querySelectorAll(
      '.animate, .animate-section'
    ) as NodeListOf<HTMLElement>;
    
    animatedElements.forEach(el => {
      this.renderer.removeClass(el, 'animate');
      this.renderer.removeClass(el, 'animate-section');
    });
  }
}
