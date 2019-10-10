import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  //User Sign-Up
  userSignUp(userDetail) {
    return this.http.post(environment.SIGN_UP, userDetail)
  }

  //User Sign-In
  userSignIn(userCredentials) {
    return this.http.post(environment.SIGN_IN, userCredentials)
  }

  //Manage Account - change full name
  manageAccountName(userFullName) {
    return this.http.post(environment.MANAGE_ACCOUNT_NAME, userFullName)
  }

  //Manage Account - change password
  manageAccountPassword(userPassword) {
    return this.http.post(environment.MANAGE_ACCOUNT_PASSWORD, userPassword)
  }

  //Ping Server
  pingServer(url){
    return this.http.get(url)
  }

}
