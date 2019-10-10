import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { MenuService } from 'src/app/services/Menu/menu.service';

declare var $: any

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  //Particles
  particleStyle: object = {};
  particleParams: object = {};
  width: number = 100;
  height: number = 100;
  colors: any = ["#00bcd4", "#f44336", "#4caf50", "#2196f3", "#ffc107"]

  //Game List
  iGameList: any = []


  //Current User
  name_log: String = ''
  username_log: String = ''

  constructor(private router: Router, private menuService: MenuService) {
    this.checkSession("User")
  }

  ngOnInit() {
    this.initParticles()
    this.getCurrenUserDetails()
  }

  initParticles() {
    this.particleStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
      'background-color': '#1e233efa'
    };

    this.particleParams = {
      particles: {
        number: {
          value: 200,
          density: {
            enable: true,
            value_area: 1000
          }
        },
        color: {
          value: this.colors//"#ffffff"
        },
        shape: {
          type: "circle",
          stroke: {
            "width": 0,
            "color": "#000000"
          },
          polygon: {
            "nb_sides": 5
          }
        },
        opacity: {
          value: 1,
          random: true,
          anim: {
            enable: true,
            speed: 0.5,
            opacity_min: 0.1,
            sync: false
          }
        },
        "size": {
          "value": 3.5,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 94.69771699587272,
          "color": "#ffffff",
          "opacity": 0.02367442924896818,
          "width": 2
        },
        move: {
          enable: true,
          speed: 3,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    }
  }

  getCurrenUserDetails() {
    var userDetails = JSON.parse(localStorage.getItem("User"))
    this.name_log = userDetails.fullName
    this.username_log = userDetails.username
  }

  signOut() {
    localStorage.removeItem("User")
    this.router.navigate(['landing'])
  }

  checkSession(key) {
    if (localStorage.getItem(key) === null || localStorage.getItem(key) === '') {
      this.router.navigate(["/landing"])
    }
  }

  onJoinGameOpen() {
    this.menuService.getGameList().subscribe(response => {
      this.iGameList = JSON.parse(response.toString())['games']
      $('#modalJoinGame').modal('show')
    })
  }


}
