import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {

  developers: any = ['Kamitha', 'Prasad', 'Damith', 'Lakdinu', 'Sachintha', 'Shehan']

  constructor(private router: Router) { }

  ngOnInit() {
    var serviceError = JSON.parse(localStorage.getItem("SERVICE_ERROR"))
    if (serviceError.showPage) {
      setTimeout(() => {
        this.router.navigate([serviceError.currentRout])
      }, environment.SERVICE_ERROR_WAIT)
    } else {
      this.router.navigate(['/invalid-route'])
    }
  }

}
