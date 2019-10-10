import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-play-wait',
  templateUrl: './game-play-wait.component.html',
  styleUrls: ['./game-play-wait.component.scss']
})
export class GamePlayWaitComponent implements OnInit {

  waitingPlayers: any = []
  gameHoster: { name: string; shortName: string; };

  constructor() { }

  ngOnInit() {
    //this.initPlayers()
  }

  

}
