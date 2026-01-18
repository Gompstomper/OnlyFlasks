import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import roles from "../../public/json/wow_role_info.json";
import classes from "../../public/json/wow_classes_info.json";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule,FormsModule,HttpClientModule,ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Only-Flasks';

  //Form Variables
  ofRecruitForm!: FormGroup;
  formSubmitted: boolean = false;

  roles: string[]= ["Tank", "Healer", "DPS"];
  classes: string[] = [];
  specs: string[] = [];
  alt1Classes: string[] = [];
  alt1Specs: string[] = [];
  alt2Classes: string[] = [];
  alt2Specs: string[] = [];

  private scriptUrl = "https://script.google.com/macros/s/AKfycbzoPqQjq72zxaC5kUgSh99KCKxHmaLZiWSh8-101JfVevHPVDYySA-URYWn6LAl7IwwGQ/exec";

  constructor(
    private fb: FormBuilder, 
    private ref: ChangeDetectorRef,
    private httpSer: HttpClient
  ) {}

  ngOnInit() {
    this.buildForm();
    this.setClassDropdowns("MainRole", "MainClass");
    this.setClassDropdowns("Alt1Role", "Alt1Class");
    this.setClassDropdowns("Alt2Role", "Alt2Class");
    this.setSpecDropdowns("MainRole", "MainClass", "MainSpec")
    this.setSpecDropdowns("Alt1Role", "Alt1Class", "Alt1Spec")
    this.setSpecDropdowns("Alt2Role", "Alt2Class", "Alt2Spec")
  }

  buildForm(){
    this.ofRecruitForm = this.fb.group({
      PlayerName: ['', Validators.required],
      DiscordName: [''],
      MainRole: ['', Validators.required],
      MainClass: [{value: '', disabled: true}, Validators.required],
      MainSpec: [{value: '', disabled: true}, Validators.required],
      Alt1Role: [''],
      Alt1Class: [{value: '', disabled: true}],
      Alt1Spec: [{value: '', disabled: true}],
      Alt2Role: [''],
      Alt2Class: [{value: '', disabled: true}],
      Alt2Spec: [{value: '', disabled: true}],
      Sales: [false],
      RecruitingHelp: [false],
      HOF: [false],
      StretchWeek: [false],
      Splits: [false],
      Comments: ['']
    });  
  }

  onSubmit(FormData: NgForm){
    const payload = this.ofRecruitForm.getRawValue();

    this.httpSer.post(this.scriptUrl, payload).subscribe({
      next: () => {this.formSubmitted = true},
      error: err => console.error(err)
    });
  }

  setClassDropdowns(mainValue: string, classValue: string)
  {
    let returnValue: any;
    this.ofRecruitForm.get(mainValue)?.valueChanges.subscribe(value => {
      if (value != ""){
        this.ofRecruitForm.get(classValue)?.enable();
        this.ofRecruitForm.get(classValue)?.patchValue("");
        returnValue = this.updateClassDropdownOptions(this.ofRecruitForm.get(mainValue)?.value);
        switch (mainValue){
          case "MainRole":
            this.classes = returnValue;
            break;
          case "Alt1Role":
            this.alt1Classes = returnValue;
            break;
          case "Alt2Role":
            this.alt2Classes = returnValue;
            break;
        }
        this.ref.detectChanges();
      }else{
        this.ofRecruitForm.get(classValue)?.disable();
        this.ofRecruitForm.get(classValue)?.patchValue("");  
      }
    })
  }

  setSpecDropdowns(mainValue: string, classValue: string, specValue: string)
  {
    let returnValue: any;
    this.ofRecruitForm.get(classValue)?.valueChanges.subscribe(value => {
      if (value != ""){
        this.ofRecruitForm.get(specValue)?.enable();
        this.ofRecruitForm.get(specValue)?.patchValue("");
        returnValue = this.updateSpecDropdownOptions(this.ofRecruitForm.get(mainValue)?.value, this.ofRecruitForm.get(classValue)?.value);
        switch (mainValue){
          case "MainRole":
            this.specs = returnValue;
            break;
          case "Alt1Role":
            this.alt1Specs = returnValue;
            break;
          case "Alt2Role":
            this.alt2Specs = returnValue;
            break;
        }
        this.ref.detectChanges();
      }else{
        this.ofRecruitForm.get(specValue)?.disable();
        this.ofRecruitForm.get(specValue)?.patchValue("");  
      }
    })
  }


  updateClassDropdownOptions(value: string): string[]
  {
    let returnObject;
    console.log(roles);
    return roles?.[value as keyof typeof returnObject];
  }

  updateSpecDropdownOptions(roleValue:string, classValue:string)
  {
    let returnObject;
    console.log(classes);
    return classes?.[classValue as keyof typeof returnObject]?.[roleValue as keyof typeof returnObject]
  }

  resetCharacterInfo(property:string){
    this.ofRecruitForm.get(property)?.patchValue("");
  }

  clearFields(){
    this.ofRecruitForm.reset({
      PlayerName: '',
      DiscordName: '',
      MainRole: '',
      MainClass: '',
      MainSpec: '',
      Alt1Role: '',
      Alt1Class: '',
      Alt1Spec: '',
      Alt2Role: '',
      Alt2Class: '',
      Alt2Spec: '',
      Sales: false,
      RecruitingHelp: false,
      HOF: false,
      StretchWeek: false,
      Splits: false,
      Comments: ''  
    });
  }
}
