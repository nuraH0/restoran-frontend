import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; 
import { CommonModule } from '@angular/common';

// DODAJ OVE IMPORTS (child components)
import { HeroComponent } from './hero/hero';
import { GalerijaONamaComponent } from './galerija-o-nama/galerija-o-nama';
import { SpecijalitetiComponent } from './specijaliteti/specijaliteti';
import { ContactFormComponent } from './contact-form/contact-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    GalerijaONamaComponent,
    SpecijalitetiComponent,
    ContactFormComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // fallback za nepoznate
})
export class AppComponent implements OnInit {
  private meta = inject(Meta);
  private title = inject(Title);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.title.setTitle('Restoran Kockica Moševac-Maglaj');
      this.meta.updateTag({ 
        name: 'description', 
        content: 'Restoran Kockica Moševac – ćevapi, roštilj Maglaj. Besplatna dostava!' 
      });
      this.meta.updateTag({ name: 'keywords', content: 'restoran Moševac, Kockica Maglaj' });
      this.meta.addTags([
        { property: 'og:title', content: 'Restoran Kockica Moševac' },
        { property: 'og:description', content: 'Najbolji grill u Maglaju' },
        { property: 'og:image', content: '/assets/og-image.jpg' }
      ]);
    }
  }
}
