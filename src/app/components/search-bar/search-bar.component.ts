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
  @Output() searchChange = new EventEmitter<string>(); 

  
  onSearchChange() {
      this.searchChange.emit(this.searchTerm.trim()); 
    }

ngOnInit() {
  this.imageURL = 'https://i.pinimg.com/originals/a0/88/10/a0881023763e13874bf497e680a3594a.png';

}}
