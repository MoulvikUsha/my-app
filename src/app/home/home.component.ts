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
    // this.tour = new Tour({
    //   name: "tour",
    //   keyboard: true,
    //   storage: false,
    //   steps: [
    //     {
    //       element: ".header",
    //       title: "This is the Title",
    //       content: "Welcome to Our Website",
    //       smartPlacement: true,
    //       animation: true,
    //       backdrop: true,
    //       placement: "bottom",
    //     },
    //     {
    //       element: "#globe",
    //       title: "Global Reach",
    //       content: "Connect with users from around the world",
    //       smartPlacement: true
    //     },
    //     {
    //       element: "#users",
    //       title: "User Communityp",
    //       content: "Join our active community and share your thoughts",
    //       smartPlacement: true
    //     },
    //     {
    //       element: "#my-element",
    //       title: "Title of my step",
    //       content: "Content of my step",
    //       smartPlacement: true,
    //       backdrop: true,
    //       placement: "top",
    //     },
    //     {
    //       element: "#my-other-element",
    //       title: "Title of my step",
    //       content: "Content of my step",
    //       smartPlacement: true,
    //       backdrop: true,
    //       placement: "top",
    //       onNext: () => {
    //         this.router.navigateByUrl('[users]')
    //       }
    //     },
    //     {
    //       element: ".usersList",
    //       title: "This is UsersList",
    //       content: "Content of my step",
    //       smartPlacement: true,
    //       backdrop: true,
    //       onNext: () => {
    //         this.router.navigateByUrl('[dashboard]')
    //       }
    //     },
    //     {
    //       element: ".myElement",
    //       title: "This is the Lorem Definition",
    //       content: "Content of my step",
    //       smartPlacement: true,
    //       backdrop: true,
    //     },

    //   ]
    // });
    // this.tour.init();
    // this.tour.start();
  }

  reStart() {
    this.joyrideService.startTour({
      steps: ['firstStep@home', 'secondStep@home', 'thirdStep@users', 'fourthStep@dashboard', 'd3Step@d3-tree'],
      stepDefaultPosition: 'bottom',
      themeColor: '#bebebe',
      customTexts: {
        next: '>>',
        prev: '<<',
        done: 'Ok'
      }
    });
  }

}
