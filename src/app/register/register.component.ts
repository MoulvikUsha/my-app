import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  isPasswordVisible = false;

  constructor(private fb: FormBuilder, public authService: AuthService, private toastr: ToastrService, private route: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      id: ['', Validators.compose([Validators.required])],
      name: ['', [Validators.required]],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      role: ['', [Validators.required]],
      password: ['', [Validators.required]],
      isActive: [false]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) { 
      this.authService.registerUser(this.registerForm.value).subscribe(res => {
        this.toastr.success('Registered Successfully. Please contact Admin to get access');
        this.route.navigate(['/login']);
      })
    }
    else {
      this.toastr.warning('Please enter valid data');
    }
  }

  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
