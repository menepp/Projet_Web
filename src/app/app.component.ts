import { Component } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ButtonComponent } from './components/button/button.component';
import { MenuComponent } from './menu/menu.component';


@Component({
  selector: 'app-root',
  imports: [SearchBarComponent, EmployeesComponent, ButtonComponent, MenuComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Projet-Web';
}
