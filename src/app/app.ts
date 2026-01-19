import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero';
import { ContactFormComponent } from "./contact-form/contact-form";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroComponent, ContactFormComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}
