import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { JoyrideService } from 'ngx-joyride';
declare let Tour: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tour: any;

  constructor(public router: Router, public authService: AuthService, public path: AuthGuard, public joyrideService: JoyrideService) { }

  ngOnInit(): void {
    // this.joyrideService.startTour({
    //   steps: ['firstStep@home', 'secondStep@home', 'thirdStep@users', 'fourthStep@dashboard', 'd3Step@d3-tree'],
    //   stepDefaultPosition: 'bottom',
    //   themeColor: '#9b9b9b'
    // });
  }

  reStart() {
    this.joyrideService.startTour({
      steps: ['firstStep@home', 'secondStep@home', 'thirdStep@users', 'fourthStep@dashboard', 'd3Step@d3-tree'],
      stepDefaultPosition: 'bottom',
      themeColor: '#9b9b9b',
      // customTexts: {
      //   next: '>>',
      //   prev: '<<',
      //   done: 'Ok'
      // }
    });
  }

}
