import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../../core/header/header.component";

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

  constructor(private router: Router) {}

  shopNow() {
    this.router.navigate(['/products']);
  }
  
}
