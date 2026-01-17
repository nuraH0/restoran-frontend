import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Ukloni RouterLink

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent {}
