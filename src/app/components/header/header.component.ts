import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule]
})
export class HeaderComponent {
  @Input() isLoginPage: boolean = false;  

}
