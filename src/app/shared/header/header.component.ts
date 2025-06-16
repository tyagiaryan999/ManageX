import { Component, Input } from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(public router: Router) {}
  @Input() username!: string;
  @Input() email!: string;
  @Input() photo!: string;

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
