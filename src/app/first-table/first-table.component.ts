import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-first-table',
  templateUrl: './first-table.component.html',
  styleUrls: ['./first-table.component.scss']
})
export class FirstTableComponent implements OnInit {

  collection: any;
  response: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortColumn: any;
  sortDirection: any;
  newDateArray: any[] = [];
  button1Active: boolean = false;
  button2Active: boolean = false;
  p: any;
  searchText: any;
  startDates!: Date;
  endDates!: Date;
  firstDate: any;
  lastDate: any;
  randomDate: any;
  isButtonActive: boolean = true;
  editForm!: FormGroup;
  activity: string = 'Active';
  
  constructor(private http: HttpClient, public dialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit() {
    this.getJson();
    this.generateRandomDates();
    this.editForm = this.fb.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      active: ['']
    });
  }

  getJson() {
    this.http.get('https://jsonplaceholder.typicode.com/todos').subscribe((res: any) => {
      this.response = res;
      this.collection = [...this.response];
    });
  }

  // SEARCHING THE DATA
  performFilter(searchTerm: any) {
    this.collection = this.response.filter((item: any) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // PAGINATION BASED ON ROWS
  onSelectChange(event: any) {
    return this.itemsPerPage = event.value;
  }

  //SORTING OF TABLE
  sortTable(value: string) {
    if (this.sortColumn === value) {
      this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    }
    else {
      this.sortColumn = value;
      this.sortDirection = 'ascending';
    }
    this.collection.sort((a: any, b: any) => {
      const a_Value = a[value];
      const b_Value = b[value];

      if (a_Value < b_Value) {
        return this.sortDirection === 'ascending' ? 1 : -1;
      } else if (a_Value > b_Value) {
        return this.sortDirection === 'ascending' ? -1 : 1;
      }
    });
  }
  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
    }
    return "arrow_upward";
  }

  // DRAG AND DROP
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.collection, event.previousIndex, event.currentIndex);
  }

  // DATA SELECTION on TRUE/FALSE
  activateButton(booleanValue: any) {
    if (booleanValue == true) {
      this.button1Active = true;
      this.button2Active = false;
      if (this.searchText != undefined) {
        this.collection = this.response.filter((item: any) => item.title.toLowerCase().includes(this.searchText.toLowerCase()) && item.completed === true
        );
      }
      else {
        this.collection = this.response.filter((item: any) => item.completed === true);
      }
    }
    if (booleanValue == false) {
      this.button1Active = false;
      this.button2Active = true;
      if (this.searchText != undefined) {
        this.collection = this.response.filter((item: any) => item.title.toLowerCase().includes(this.searchText.toLowerCase()) && item.completed === false);
      }
      else {
        this.collection = this.response.filter((item: any) => item.completed === false);
      }
    }
  }

  // DATE
  generateRandomDates() {
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        this.collection!.forEach((element: any) => {
          this.randomDate = this.getRandomDate();
          const currentDate = moment(this.randomDate).format('DD/MM/YYYY');
          element.date = currentDate;
        });
      }, 110);
    }
  }
  getRandomDate(): Date {
    const startDate = new Date(2000, 0, 1);
    const endDate = new Date();
    const randomTimestamp = startDate.getTime() + (Math.random() * (endDate.getTime() - startDate.getTime()));
    return new Date(randomTimestamp);
  }

  // DATE RANGE
  onDateRangeChange() {
    this.collection.forEach((element: any) => {
      const date1 = this.convertToDateObject(element.date);
      if ((date1 > this.startDates) && (date1 < this.endDates)) {
        this.newDateArray.push(element)
        this.collection = this.newDateArray
      }
    });
  }

  convertToDateObject(dateStr: any): Date {
    const parts = dateStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based in JavaScript Date object
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  // OPEN FORM DIALOG BOX
  openDialog() {
    const dialogRef = this.dialog.open(DialogComponentComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // EDIT ROWS
  editRow(item: any) {
    this.editForm.patchValue(item);
    const selectedDate = moment(item.date, 'DD-YY-MMMM').format();
    this.editForm.get('date')?.patchValue(selectedDate);

    if (item.completed == true) {
      this.activity = 'Active';
      this.editForm.get('active')?.patchValue(item.completed);
    }
    else {
      this.activity = 'Inactive';
      this.editForm.get('active')?.patchValue(item.completed);
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

  onSubmit() {
    if (this.editForm.valid) {
      console.log('formValue:', this.editForm.value);
    }
  }

}
