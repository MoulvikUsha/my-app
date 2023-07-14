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
  newArray: any[] = [];
  button1Active: boolean = false;
  button2Active: boolean = false;
  p: any;
  searchText: any;

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
  onSelectChange(value: any) {
    return this.itemsPerPage = value;
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

  // DATA SELECTION
  activateButton(booleanValue: boolean) {
    if (booleanValue === true) {
      this.button1Active = true;
      this.button2Active = false;
      this.collection.forEach((element: any) => {
        if (element.completed == true) {
          this.newArray.push(element);
          this.collection = this.newArray;
        }
      });
    } else if (booleanValue === false) {
      this.button1Active = false;
      this.button2Active = true;
      this.collection.forEach((element: any) => {        
        if (element.completed == false) {
          this.newArray.push(element);
          this.collection = this.newArray;
        }
      });
    }
  }

  // DATE
  generateRandomDates() {
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        this.collection.forEach((element: any) => {
          const randomDate = this.getRandomDate();
          const currentDate = moment(randomDate).format('DD/MM/YYYY');
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
}
