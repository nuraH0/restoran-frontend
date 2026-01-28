import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero';
import { ContactFormComponent } from "./contact-form/contact-form";
import { GalerijaONamaComponent } from "./galerija-o-nama/galerija-o-nama";
import { SpecijalitetiComponent } from "./specijaliteti/specijaliteti";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroComponent, ContactFormComponent, GalerijaONamaComponent, SpecijalitetiComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}
