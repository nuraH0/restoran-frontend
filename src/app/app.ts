import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero';
import { ContactFormComponent } from "./contact-form/contact-form";
import { GalerijaONamaComponent } from "./galerija-o-nama/galerija-o-nama";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroComponent, ContactFormComponent, GalerijaONamaComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}
