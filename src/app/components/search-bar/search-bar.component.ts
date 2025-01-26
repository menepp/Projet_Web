import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent  implements OnInit {
  imageURL! : string;
  searchTerm: string = ''; 
  @Output() searchChange = new EventEmitter<string>(); // Émettre les recherches vers le parent
   // Variable liée à ngModel
  
  onSearchChange() {
      this.searchChange.emit(this.searchTerm.trim()); // Émettre l'événement à chaque frappe
    }

ngOnInit() {
  this.imageURL = 'https://e7.pngegg.com/pngimages/306/24/png-clipart-google-search-android-search-box-search-engine-optimization-loupe-technic-symbol-thumbnail.png';

}}
