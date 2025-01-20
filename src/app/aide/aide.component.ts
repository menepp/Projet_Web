import { Component } from '@angular/core';

@Component({
  selector: 'app-aide',
  imports: [],
  templateUrl: './aide.component.html',
  styleUrl: './aide.component.css'
})
export class AideComponent {
  onHelpClick(): void {
    alert('Besoin d\'aide ? Contactez-nous ou consultez la documentation.');
   
  }
}
