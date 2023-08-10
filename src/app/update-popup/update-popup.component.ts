import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-popup',
  templateUrl: './update-popup.component.html',
  styleUrls: ['./update-popup.component.scss']
})
export class UpdatePopupComponent implements OnInit {
  
  registerForm!: FormGroup;
  isPasswordVisible = false;
  roleList: any;
  editData: any;

  constructor(private fb: FormBuilder, public authService: AuthService, private toastr: ToastrService, private route: Router, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<UpdatePopupComponent>) { }
  
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      id: ['', Validators.compose([Validators.required])],
      name: ['', [Validators.required]],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      role: ['', [Validators.required]],
      password: ['', [Validators.required]],
      isActive: [false]
    });

    this.authService.getAllRoles().subscribe(res => {
      this.roleList = res;

      if (this.data.userId != null && this.data.userId != '') {
        this.authService.getUserById(this.data.userId).subscribe(res => {
          this.editData = res;
          this.registerForm.patchValue({
            id: this.editData.id,
            name: this.editData.name,
            email: this.editData.email,
            password: this.editData.password,
            role: this.editData.role,
            isActive: this.editData.isActive
          })
        })
      }
    })
  }

  onSubmit() {
    if (this.registerForm.valid) { 
      this.authService.updateUser(this.registerForm.value.id, this.registerForm.value).subscribe(res => {        
        this.toastr.success('Updated Successfully.');
        this.dialog.close();
      })
    }
    else {
      this.toastr.warning('Please select role');
    }
  }

}
