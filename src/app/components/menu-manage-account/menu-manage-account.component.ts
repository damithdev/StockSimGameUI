import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { AuthenticationService } from '../../services/Authentication/authentication.service'
import { environment } from 'src/environments/environment';

declare var $: any

@Component({
  selector: 'app-menu-manage-account',
  templateUrl: './menu-manage-account.component.html',
  styleUrls: ['./menu-manage-account.component.scss']
})
export class MenuManageAccountComponent implements OnInit {

  //mUserName
  mUserName: String = ''

  //Full name change
  mChangeFullName: String = ''
  mPersistFullName: String = ''
  mConfirmNameChange: String = ''
  nameChangeErrorMessage: String = ''
  showNameChangeError: Boolean = true
  disableSaveFullNameButton: Boolean = false

  //Password Change
  mCurrentPassword: String = ''
  mNewPassword: String = ''
  mRetypePassword: String = ''
  passwordChangeErrorMessage: String = ''
  showPasswordErrors: Boolean = true
  disableChangePasswordButton: Boolean = false

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.initFromLocalStorage()
    this.handleServiceError('/menu', false)
  }


  //Full name change methods

  initFromLocalStorage() {

    var localData = JSON.parse(localStorage.getItem("User"))

    this.mChangeFullName = this.mPersistFullName = localData['fullName']
    this.mUserName = localData['username']
  }

  changeFullName() {

    this.disableSaveFullNameButton = true

    this.authenticationService.manageAccountName(
      {
        "fullName": this.mChangeFullName,
        "username": this.mUserName,
        "password": this.mConfirmNameChange
      }).subscribe(response => {

        response = JSON.parse(response.toString())
        console.log(response)

        if (response['status'] === environment.SUCCESS) {
          localStorage.setItem(
            "User",
            JSON.stringify({
              username: response['username'],
              fullName: response['fullName']
            })
          )

          this.mPersistFullName = response['fullName']

        } else if (response['status'] === environment.ERROR) {
          this.setNameChangeError("Password Incorrect")
        } else {
          this.setNameChangeError("Unknown Error Occured !")
        }

        // var userStorageDetails = JSON.parse(localStorage.getItem("User"))
        // userStorageDetails.fullName = response['fullName']



      }, error => {
        $('#modalManageAccount').modal('hide')
        this.router.navigate(['/service-error'])
      })

    this.disableSaveFullNameButton = false
  }

  setNameChangeError(message) {
    this.nameChangeErrorMessage = message
    this.showNameChangeError = false
  }


  //Change Password
  changePassword() {

    this.disableChangePasswordButton = true

    if (this.mNewPassword === this.mRetypePassword) {

      this.authenticationService.manageAccountPassword(
        {
          "newPassword": this.mNewPassword,
          "username": this.mUserName,
          "password": this.mCurrentPassword
        }).subscribe(response => {

          response = JSON.parse(response.toString())
          console.log(response)
          if (response['status'] === environment.ERROR) {
            this.setPassowrdChangeError('Current Password Incorrect !')

          } else if (response['status'] === environment.SUCCESS) {
            this.mCurrentPassword = ''
            this.mNewPassword = ''
            this.mRetypePassword = ''

          } else {
            this.setNameChangeError("Unknown Error Occured !")
          }

        })

    } else {
      this.setPassowrdChangeError('Password Does Not Match !')
    }

    this.disableChangePasswordButton = false

  }

  setPassowrdChangeError(message) {
    this.passwordChangeErrorMessage = message
    this.showPasswordErrors = false
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
