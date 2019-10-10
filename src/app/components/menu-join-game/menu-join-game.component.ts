import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MenuService } from 'src/app/services/Menu/menu.service';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

declare var $: any

@Component({
  selector: 'app-menu-join-game',
  templateUrl: './menu-join-game.component.html',
  styleUrls: ['./menu-join-game.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class MenuJoinGameComponent implements OnInit {

  //Game List
  @Input() gameList: any = []

  //Player Username
  playerUserName: String = ''

  constructor(private menuService: MenuService, private router: Router) { }

  ngOnInit() {
    this.playerUserName = JSON.parse(localStorage.getItem("User")).username || null
    this.getGameList()
  }

  getGameList() {
    this.menuService.getGameList().subscribe(response => {
      this.gameList = JSON.parse(response.toString())['games']
    })
  }

  joinGame(data) {
    this.menuService.joinGame({
      username: this.playerUserName,
      hash: data.gamehash
    }).pipe(take(1)).subscribe(response => {
      if (JSON.parse(response.toString())['status'] == environment.SUCCESS) {

        var joiner = {
          matchId: JSON.parse(response.toString())['matchid'],
          hoster: false
        }

        console.log(joiner)

        localStorage.setItem('MATCH', JSON.stringify(joiner))
        $("#modalJoinGame").modal('hide')
        this.router.navigate(['/game-play'])

      }
    })
  }

  reloadGameList() {
    this.getGameList()
  }

}
