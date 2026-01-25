import { Component, AfterViewInit, ElementRef, Renderer2, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  menuOpen = false; 
  
  @ViewChild('mainVideo') mainVideo!: ElementRef<HTMLVideoElement>;


  private observer: IntersectionObserver | null = null;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

ngAfterViewInit() {
  setTimeout(() => {
    // Hero button
    const menuBtn = this.el.nativeElement.querySelector('.hero-button') as HTMLElement;
    const menuSection = document.getElementById('menu-section');
    if (menuBtn && menuSection) {
      this.renderer.listen(menuBtn, 'click', (e: Event) => {
        e.preventDefault();
        this.smoothScrollTo(menuSection);
      });
    }

    // ✅ LOGO - GLATKI SCROLL NA VRH
    const logoTitle = this.el.nativeElement.querySelector('.top-title') as HTMLElement;
    if (logoTitle) {
      this.renderer.listen(logoTitle, 'click', () => {
        const navbar = document.querySelector('.hero-nav-bar') as HTMLElement;
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        const targetY = 0 - navbarHeight;
        
        const startY = window.pageYOffset;
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
        this.closeMenu();
      });
      this.renderer.setStyle(logoTitle, 'cursor', 'pointer');
    }
    this.initVideoAutoplay();
  }, 50);

  this.initTabs();
  this.initScrollAnimations();
}

private initVideoAutoplay() {
  console.log('🎥 VIDEO CHECK:', this.mainVideo?.nativeElement); // DEBUG
  
  if (!this.mainVideo?.nativeElement) {
    console.error('❌ VIDEO NIJE PRONAĐEN!');
    return;
  }
  
  const video = this.mainVideo.nativeElement;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  
  video.play().then(() => {
    console.log('✅ VIDEO AUTOPLAY USPJEŠAN!');
  }).catch(e => {
    console.log('⚠️ Autoplay blokiran:', e);
  });
}



  onNavClick(event: Event, targetId: string) {
    event.preventDefault();
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      this.smoothScrollTo(targetElement);
    }
    
    this.menuOpen = false;
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // 🔥 SMOOTH SCROLL
  private smoothScrollTo(element: HTMLElement) {
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

  // TABS LOGIKA
  private initTabs() {
    const tabBtns = this.el.nativeElement.querySelectorAll('.tab-btn') as NodeListOf<HTMLElement>;
    const tabPanels = this.el.nativeElement.querySelectorAll('.tab-panel') as NodeListOf<HTMLElement>;

    tabBtns.forEach((btn, index) => {
      this.renderer.listen(btn, 'click', () => {
        tabPanels.forEach(p => this.renderer.removeClass(p, 'active'));
        tabBtns.forEach(b => this.renderer.removeClass(b, 'active'));

        this.renderer.addClass(btn, 'active');
        
        const targetTab = btn.dataset['tab'];
        const targetPanel = this.el.nativeElement.querySelector(`#${targetTab}`) as HTMLElement;
        
        if (targetPanel) {
          requestAnimationFrame(() => {
            this.renderer.addClass(targetPanel, 'active');
          });
        }
      });
    });

    // Default prvi tab
    if (tabBtns[0]) {
      this.renderer.addClass(tabBtns[0], 'active');
      const firstPanelId = (tabBtns[0] as HTMLElement).dataset['tab'];
      const firstPanel = this.el.nativeElement.querySelector(`#${firstPanelId}`) as HTMLElement;
      setTimeout(() => {
        if (firstPanel) this.renderer.addClass(firstPanel, 'active');
      }, 200);
    }
  }

  // SCROLL ANIMACIJE - POBOLJŠANE
  private initScrollAnimations() {
    const menuSection = document.getElementById('menu-section');
    
    if (!menuSection) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // ✅ TRIGGER MENU ANIMACIJE
          this.renderer.addClass(entry.target as HTMLElement, 'animate-section');
          
          // ✅ Staggered tabs buttons
          const tabBtns = entry.target.querySelectorAll('.tab-btn') as NodeListOf<HTMLElement>;
          tabBtns.forEach((btn, index) => {
            setTimeout(() => {
              this.renderer.addClass(btn, 'animate');
            }, 600 + (index * 60));
          });
          
          this.observer?.disconnect(); // SAMO PRVI PUT
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-100px 0px -20% 0px'
    });

    this.observer.observe(menuSection);
  }

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
