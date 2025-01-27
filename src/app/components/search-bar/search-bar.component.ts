import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent  implements OnInit {
  imageURL! : string;

ngOnInit() {
  this.imageURL = 'https://i.pinimg.com/originals/a0/88/10/a0881023763e13874bf497e680a3594a.png';

}}
