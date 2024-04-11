import { Component, OnInit } from '@angular/core';
import { Country } from '../country';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { Location, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit{

  name!: string;

  selectedCountry!: Country|undefined;

  darkMode!: boolean;

  countryCodes!: string[];

  countryNames: string[] = [];

  private routeParamSub!: Subscription;
  private countryNameSub!: Subscription;

  constructor(private route: ActivatedRoute, private sharedService: SharedService, 
    private location: Location, private router: Router) {}

    ngOnInit(): void {
      this.routeParamSub = this.route.params.subscribe(params => {
        const name = params['name']
  
        this.name = name
      })
  
      //this.selectedCountry = this.sharedService.getSelectedCountry();
      // using this method will make the page load only when it is being accessed through the homepage as it uses
      // the data from the homepage to load its content, the selectedCountry is fetched from the homepage, so 
      // without the homepage being loaded first, there is no data fetched, this method is good to prevent direct 
      // access from links to pages
  
      this.countryNameSub = this.sharedService.getCountryByName(this.name).subscribe((country: Country|undefined) => {
        
        this.selectedCountry = country;
  
        this.selectedCountry?.borders!==undefined ? this.countryCodes = this.selectedCountry?.borders!
        : this.countryCodes = [' '];
        
        this.countryCodes.forEach(code => {
          this.sharedService.getCountryNameByCode(code).subscribe((name: string|undefined) => {
            const n: string = name ? name : 'None';
            this.countryNames.push(n)
            
          })
          
        })
      })
      // the above method allows to make the request when the page is opened without passing through the homepage
      // the page will load with correct data based on the name gotten from the url, this method is ideal for this 
      // particular route in this project.
  
      this.sharedService.getDarkMode().subscribe((darkMode: boolean) => {
        this.darkMode = darkMode;
      })
    }

onBack() {
  this.location.back();
}

ngOnDestroy(): void {
    if (this.routeParamSub) this.routeParamSub.unsubscribe();
    if (this.countryNameSub) this.countryNameSub.unsubscribe();
  
}
}