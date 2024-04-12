import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Country } from './country';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private countries!: Observable<Country[]>

  private selectedCountry!: Country|undefined;

  private dakrMode = new BehaviorSubject<boolean>(true);

  private searchState!: { keyword: string, countries: Country[]};

  private filterState!: { keyword: string, countries: Country[]};

  constructor(private http: HttpClient) { }

  getDarkMode() {
    return this.dakrMode.asObservable()
  }

  getCountries() {
    this.countries = this.http.get<Country[]>("../../assets/data.json");
    return this.countries
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    return this.countries.pipe(map((countries: Country[]) => countries.filter(country => country.region.toLowerCase() === region.toLowerCase())))
  }

  getCountriesByName(name: string): Observable<Country[]> {
    return this.countries.pipe( //this.getCountries will make the requests again to make the page accessible without the homepage
        map((countries: Country[]) => countries.filter(country => country.name.toLowerCase().includes(name.trim().toLowerCase())))
      );
}

getCountryByName(name: string): Observable<Country|undefined> {
    return this.getCountries().pipe(
      map((countries: Country[]) => countries.find(country => country.name.toLowerCase() === name.toLowerCase()))
    );
  }

getCountryNameByCode(code: string): Observable<string|undefined> {
    return this.getCountries().pipe(
        map((countries: Country[]) => {
            const country = countries.find(country => country.alpha3Code === code);
            return country?.name;
        })
    );
}

setSelectedCountry(country: Country) {
    this.selectedCountry = country;
}

getSelectedCountry() {
    return this.selectedCountry;
}

setSearchState(keyword: string, countries: Country[]) {
    this.searchState = { keyword, countries };
}

getSearchState(): {keyword: string, countries: Country[]} {
    return this.searchState;
}

setFilterState(keyword: string, countries: Country[]) {
    this.filterState = {keyword, countries};
}

getFilterState(): {keyword: string, countries: Country[]} {
    return this.filterState;
}

setDarkMode(value: boolean) {
  this.dakrMode.next(value)
}
}
