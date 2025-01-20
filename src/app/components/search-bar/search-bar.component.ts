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
  this.imageURL = 'https://e7.pngegg.com/pngimages/306/24/png-clipart-google-search-android-search-box-search-engine-optimization-loupe-technic-symbol-thumbnail.png';

}}
