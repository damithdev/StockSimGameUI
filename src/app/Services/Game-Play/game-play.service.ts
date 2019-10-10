import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GamePlayService {

  constructor(private http: HttpClient) { }

  //Request to Start Game Stream Data from Web Service
  requestGameStream(requestBody) {
    let params = new HttpParams().set("username", requestBody.username).set("hash", requestBody.hash)
    return this.http.get(environment.REQUEST_STREAM, { params: params })
  }

  //Start Game - This action affect to every player connected
  startGame(requestBody) {
    return this.http.post(environment.START_GAME, requestBody)
  }

  //Purchase Stock
  purchaseStock(requestBody){
    return this.http.post(environment.PURCHASE_STOCK, requestBody)
  }
}
