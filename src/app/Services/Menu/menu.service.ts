import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  //Create A Match
  createGame(gameCreateDetail) {
    return this.http.post(environment.CREATE_GAME, gameCreateDetail)
  }

  //Retreive Available Game List From Web Service
  getGameList() {
    return this.http.get(environment.GET_GAME_LIST)
  }

  //Join to a Game from List
  joinGame(requestBody) {
    return this.http.post(environment.JOIN_GAME, requestBody)
  }


}
