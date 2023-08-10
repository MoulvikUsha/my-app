import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isPasswordVisible = false;
  userData: any;

  constructor(private fb: FormBuilder, public authService: AuthService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // this.authService.login(this.loginForm.value).subscribe((res: any) => {
      //   localStorage.setItem('accessToken', res.accessToken);
      //   localStorage.setItem('refreshToken', res.refreshToken);
      //   this.router.navigate([`/first`]);
      // })

      if (this.loginForm.valid) {
        this.authService.getUserById(this.loginForm.value.userName).subscribe(res => {
          this.userData = res;
          if (this.userData.password == this.loginForm.value.password) {
            if (this.userData.isActive) {
              sessionStorage.setItem('username', this.userData.id);
              sessionStorage.setItem('role', this.userData.role);
              this.toastr.success('Logged in Successfully.');
              this.router.navigate(['home']);
            }
            else {
              this.toastr.error('Inactive User. Please contact Admin.');
            }
          } else {
            this.toastr.error('Invalid Credentials');
          }
        })
      }
    }
  }

  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
