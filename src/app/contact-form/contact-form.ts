import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.scss']
})
export class ContactFormComponent implements AfterViewInit {
  @ViewChild('contactSection', { static: false }) contactSection!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const section = this.contactSection?.nativeElement;
    if (section && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(section, 'animate');
            observer.unobserve(section);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      observer.observe(section);
    }
  }
}
