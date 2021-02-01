import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  all_meta: any;
  questionnaireForm: FormGroup;
  constructor(private httpClient: HttpClient, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.httpClient.get('../assets/questionnaire.json').subscribe((data) => console.log(data));

    this.questionnaireForm = this.fb.group({
      header: this.fb.group({
        item1: this.fb.control(''),
        item2: this.fb.group({
          gender: [''],
          birth: [''],
          country: [''],
          maritalStatus: ['']
        }),
        item3: this.fb.group({
          smoker: [''],
          alcohol: ['']
        })
      })
    });
    this.buildFormGroupMeta()
  }

  buildFormGroupMeta() {
    this.all_meta = this.formControlRecursiveMeta(this.questionnaireForm);
  }

  formControlRecursiveMeta(form): {}{
    let myMeta = {};
    let i = 0;
    let j = 0;
    Object.keys(form.controls).forEach(key =>{
      if(!!form.controls[key].controls){
        myMeta['group'+ i.toString()] = {
          group: this.formControlRecursiveMeta(form.controls[key]),
          order: i + j,
          name: key,
          label: this.fixLabel(key)
        };
        i = i + 1;
      }else{
        myMeta['input' + j.toString()] = {
          type: this.inputType(form.controls[key]),
          name: key,
          disabled: false,
          label: this.fixLabel(key),
          order: i + j,
          value: form.controls[key].value
        };
        j = j + 1;
      }
    });
    console.log(myMeta)
    return myMeta
  }

  keys(input){
    if(input){
      return Object.keys(input);
    }else{
      return []
    }
  }
  fixLabel(key: string): string{
    let returnLabel = key.toUpperCase()

    return returnLabel
  }
  inputType(info): string{
    console.log(info);
    return 'text'
  }


}
