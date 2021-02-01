import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getPatients(prms) {
    let params = new HttpParams();
    params =  prms.startDate ? params.append('birthdate', prms.startDate) : params;
    params = prms.startDate ? params.append('birthdate', prms.endDate): params;
    params = prms.name ? params.append('name', prms.name): params;

    return this.httpClient.get(environment.queryURI + '/Patient',
      { params, headers: this.getHeaders() })
        .pipe(
            map((ai: any) => {
              return {
                entry: ai.entry?.sort(this.compareDate)
              };
            })
        );
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/fhir+json'
    });
    return headers;
  }

    private compareDate(a: any, b: any) {
        return (
            new Date(a.resource.birthDate).getTime() -
            new Date(b.resource.birthDate).getTime()
        );
    }
}


