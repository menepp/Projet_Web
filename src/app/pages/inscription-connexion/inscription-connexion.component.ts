import { Component } from '@angular/core';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription-connexion',
  imports: [InscriptionComponent, ConnexionComponent, CommonModule],
  templateUrl: './inscription-connexion.component.html',
  styleUrls: ['./inscription-connexion.component.css']
})
export class InscriptionConnexionComponent {
  currentForm: string = 'connexion';  

  showForm(form: string) {
    this.currentForm = form;  
  }
}
