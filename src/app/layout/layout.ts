import { Component } from '@angular/core';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Header, Footer, RouterOutlet],
  template: `
    <app-header></app-header>
    <main class="min-h-screen bg-gray-50">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
})
export class Layout {}
