import {Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../app/services/api-service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit  {
  title = 'fhir-app-test';
  data: any;
  currentDateTime: Date = new Date();
  displayedColumns: string[] = ['id', 'name', 'birthdate'];
  search: FormGroup;
  submitted = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.search = this.fb.group({
      name: [''],
      minDate: [moment(new Date('1960-01-01')).toDate()],
      maxDate: [moment(new Date('1965-01-01')).toDate()],
    });
    this.apiRequest({startDate: 'ge1960-01-01', endDate: 'le1965-01-01', name: ''});
  }

  searchFilter(e: FormGroup) {
    this.submitted = true;
    const name = e.controls['name'].value;
    const startDate = moment(new Date(e.controls['minDate'].value)).format('[ge]YYYY-MM-DD');
    const endDate = moment(new Date(e.controls['maxDate'].value)).format('[le]YYYY-MM-DD');
    const params = {name, startDate, endDate};
    this.apiRequest(params);
  }

  apiRequest(params: any) {
    this.apiService.getPatients(params).subscribe(
        (data: any) => {
          this.data = data.entry;
          this.submitted = false;
          this.search.markAsPristine();
        }
    );
  }
}


