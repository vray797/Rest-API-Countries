import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedService } from './shared.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'rest-countries-api';

  darkMode!: boolean;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.getDarkMode().subscribe((darkMode: boolean) => {
      this.darkMode = darkMode;
    })
  }

  toggleDarkMode() {
    this.sharedService.setDarkMode(!this.darkMode);
  }
}
