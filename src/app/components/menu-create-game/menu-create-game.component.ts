import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router"
import { first, take } from 'rxjs/operators';
import { MenuService } from '../../services/Menu/menu.service'
import { environment } from 'src/environments/environment';

declare var $: any

@Component({
  selector: 'app-menu-create-game',
  templateUrl: './menu-create-game.component.html',
  styleUrls: ['./menu-create-game.component.scss']
})
export class MenuCreateGameComponent implements OnInit, OnDestroy {

  mGameHoster: String = ''

  //Create Game HTTP Req
  subscription: any;

  constructor(private router: Router, private menuService: MenuService) { }

  ngOnInit() {
    this.mGameHoster = JSON.parse(localStorage.getItem("User")).username || null
    this.handleServiceError('/menu', false)
  }

  hostGame() {
    this.subscription = this.menuService.createGame({
      "username": this.mGameHoster,
      "password": "rog"
    }).pipe(take(1)).subscribe(response => {

      if (JSON.parse(response.toString())['status'] == environment.SUCCESS) {

        var matchHoster = {
          matchId: JSON.parse(response.toString())['matchid'],
          hoster: true
        }

        localStorage.setItem('MATCH', JSON.stringify(matchHoster))
        $("#modalCreateNewGame").modal('hide')
        this.router.navigate(['/game-play'])
      }

    }, error => {
      $("#modalCreateNewGame").modal('hide')
      this.handleServiceError('/menu', true)
      this.router.navigate(['/service-error'])
    })

  }

  ngOnDestroy() {
    //this.subscription.unsubscribe()
  }

  handleServiceError(router, boolValue) {
    localStorage.setItem("SERVICE_ERROR", JSON.stringify(
      {
        currentRout: router,
        showPage: boolValue
      }
    ))
  }

}
