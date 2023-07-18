import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-component',
  templateUrl: './dialog-component.component.html',
  styleUrls: ['./dialog-component.component.scss']
})
export class DialogComponentComponent implements OnInit {

  titleForm!: FormGroup;
  activity: string = 'Active';
  isPasswordVisible = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.titleForm = this.fb.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      active: [true, [Validators.requiredTrue]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]
    });
  }

  onSubmit() {
    if (this.titleForm.valid) {
      console.log('formValue:', this.titleForm.value);
    }
  }

  onToggleChange(event: any) {
    if (event.checked == true) {
      this.activity = 'Active'
    }
    else {
      this.activity = 'Inactive'
    }
  }

  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
