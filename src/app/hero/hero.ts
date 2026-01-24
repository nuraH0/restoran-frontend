import { Component, AfterViewInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  
  menuOpen = false; 

  private observer: IntersectionObserver | null = null;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    // 1. SAMO hero button – uklanja globalne linkove
    setTimeout(() => {
      const menuBtn = this.el.nativeElement.querySelector('.hero-button') as HTMLElement;
      const menuSection = document.getElementById('menu-section');
      if (menuBtn && menuSection) {
        this.renderer.listen(menuBtn, 'click', (e: Event) => {
          e.preventDefault();
          this.smoothScrollTo(menuSection);
        });
      }
    }, 50);

    this.initTabs();
    this.initScrollAnimations();
  }

    onNavClick(event: Event, targetId: string) {
    event.preventDefault();
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      this.smoothScrollTo(targetElement);
    }
    
    this.menuOpen = false; // ✅ Ovo zatvara hamburger meni
  }


  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // 🔥 SMOOTH SCROLL (tvoja postojeća metoda)
private smoothScrollTo(element: HTMLElement) {
  // AUTOMATSKI navbar visina + dodatni prostor
  const navbar = document.querySelector('.hero-nav-bar') as HTMLElement;
  const navbarHeight = navbar ? navbar.offsetHeight : 70;
  const NAV_OFFSET = navbarHeight + -70;  
  
  const startY = window.pageYOffset;
  const targetY = element.getBoundingClientRect().top + startY - NAV_OFFSET;
  const distance = targetY - startY;
  const duration = 1700;
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuint = 1 - Math.pow(1 - progress, 5);
    window.scrollTo(0, startY + distance * easeOutQuint);
    if (progress < 1) requestAnimationFrame(animate);
  };
  
  requestAnimationFrame(animate);
}

  closeMenu() {
    this.menuOpen = false;
  }


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // TABS LOGIKA (tvoja postojeća)
  private initTabs() {
    const tabBtns = this.el.nativeElement.querySelectorAll('.tab-btn') as NodeListOf<HTMLElement>;
    const tabPanels = this.el.nativeElement.querySelectorAll('.tab-panel') as NodeListOf<HTMLElement>;

    tabBtns.forEach((btn, index) => {
      this.renderer.listen(btn, 'click', () => {
        // Ukloni sve active
        tabBtns.forEach(b => this.renderer.removeClass(b, 'active'));
        tabPanels.forEach(p => this.renderer.removeClass(p, 'active'));

        // Aktiviraj ovaj
        this.renderer.addClass(btn, 'active');
        
        const targetTab = btn.dataset['tab'];
        const targetPanel = this.el.nativeElement.querySelector(`#${targetTab}`) as HTMLElement;
        
        if (targetPanel) {
          this.renderer.addClass(targetPanel, 'active');
          
          // Animiraj sadržaj tab-a
          setTimeout(() => {
            this.animateTabContent(targetPanel, index);
          }, 100);
        }
      });
    });
  }

  // SCROLL ANIMACIJE (tvoja postojeća)
  private initScrollAnimations() {
    const menuSection = document.getElementById('menu-section');
    
    if (!menuSection) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Aktiviraj glavnu sekciju
          this.renderer.addClass(entry.target as HTMLElement, 'animate-section');
          
          // Animiraj sve elemente unutar sekcije
          const elementsToAnimate = entry.target.querySelectorAll(
            '.section-title, .tab-btn, .tabs-content, .menu-item, .tab-panel h3'
          ) as NodeListOf<HTMLElement>;
          
          elementsToAnimate.forEach((el, index) => {
            setTimeout(() => {
              this.renderer.addClass(el, 'animate');
            }, index * 80);
          });
          
         
          this.observer?.disconnect();
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '-50px 0px -10% 0px'
    });

    this.observer.observe(menuSection);
  }

  // TAB CONTENT ANIMACIJA (tvoja postojeća)
  private animateTabContent(panel: HTMLElement, tabIndex: number) {
    const menuItems = panel.querySelectorAll('.menu-item') as NodeListOf<HTMLElement>;
    const panelTitle = panel.querySelector('h3') as HTMLElement;
    
    if (panelTitle) {
      setTimeout(() => {
        this.renderer.addClass(panelTitle, 'animate');
      }, 150);
    }
    
    menuItems.forEach((item, index) => {
      setTimeout(() => {
        this.renderer.addClass(item, 'animate');
      }, 250 + (index * 120)); 
    });
  }

  // RESET ANIMACIJE (tvoja postojeća)
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
