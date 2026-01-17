import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero'; // ili putanja

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}
