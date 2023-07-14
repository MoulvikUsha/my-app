import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as moment from 'moment';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getJson();
    this.generateRandomDates();
  }

  getJson() {
    this.http.get('https://jsonplaceholder.typicode.com/todos').subscribe((res: any) => {
      this.response = res;
      this.collection = [...this.response];
    });
  }

  // SEARCHING THE DATA
  performFilter(searchTerm: string) {
    this.collection = this.response.filter((item: { title: string; }) =>
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
    // this.collection.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
    //   const a_Value = a[value];
    //   const b_Value = b[value];

    //   if (a_Value < b_Value) {
    //     return this.sortDirection === 'ascending' ? 1 : -1;
    //   } else if (a_Value > b_Value) {
    //     return this.sortDirection === 'ascending' ? -1 : 1;
    //   }
    // });
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
      this.collection = this.response.filter((item: any) => item.completed === true);
    }
    if (booleanValue == false) {
      this.button1Active = false;
      this.button2Active = true;
      this.collection = this.response.filter((item: any) => item.completed === false);
    }
  }

  // DATE
  generateRandomDates() {
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        this.collection.forEach((element: any) => {
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

}
