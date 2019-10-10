import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { environment } from "../../../environments/environment";

import { AuthenticationService } from "../../services/Authentication/authentication.service";

declare var $: any;

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"]
})
export class LandingPageComponent implements OnInit {
  //Get Server Path
  mServerPath: String = "";
  mIsURLCorrect: Boolean = false;
  serverPathCheckMessage: String = "";

  //Register User
  mFullName: String = "";
  mUserName: String = "";
  mPassword: String = "";
  mRetypePassword: String = "";

  isPasswordsNotMatching: boolean = false;
  registerWarningMessage: String = "";

  //Sign Up User
  mSignInUserName: String = "";
  mSignInPassword: String = "";

  isUserNameOrPasswordIncorrect: boolean = false;
  signInErrorMessage: String = "";

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.checkSession("User");
    this.checkInLocalStorage("SERVER_PATH");
    this.handleServiceError("/landing", true);
  }

  userSignIn() {
    if (this.mSignInUserName !== "" && this.mSignInPassword !== "") {
      this.authenticationService
        .userSignIn({
          username: this.mSignInUserName,
          password: this.mSignInPassword
        })
        .subscribe(
          response => {
            response = JSON.parse(response.toString());

            if (response["status"] === environment.SUCCESS) {
              localStorage.setItem(
                "User",
                JSON.stringify({
                  username: response["username"],
                  fullName: response["fullName"]
                })
              );
              this.router.navigate(["/menu"]);
            } else {
              this.setSignInErrorMessage("Username or Password incorrect");
              this.isUserNameOrPasswordIncorrect = true;
            }
          },
          error => {
            this.handleServiceError("/landing", true);
            this.router.navigate(["/service-error"]);
          }
        );
    } else {
      this.setSignInErrorMessage("Username & Password Cannot Be Empty");
    }
  }

  createUser() {
    if (
      this.mFullName !== "" &&
      this.mUserName !== "" &&
      this.mPassword !== "" &&
      this.mRetypePassword !== ""
    ) {
      if (this.mPassword === this.mRetypePassword) {
        //Your Code goes here
        this.authenticationService
          .userSignUp({
            fullName: this.mFullName,
            username: this.mUserName,
            password: this.mPassword
          })
          .subscribe(
            response => {
              response = JSON.parse(response.toString());

              if (response["status"] === environment.USER_ALREADY_EXIT) {
                this.setSignUpWarningMessage("Username Already Taken !");
              } else {
                $("#modalSignUp").modal("hide");
              }
            },
            error => {
              $("#modalSignUp").modal("hide");
              this.handleServiceError("/landing", true);
              this.router.navigate(["/service-error"]);
            }
          );
      } else {
        this.setSignUpWarningMessage("Password does Not Match");
        this.isPasswordsNotMatching = true;
      }
    } else {
      this.setSignUpWarningMessage(
        "Full name, Username and Password Cannot be Empty"
      );
      this.isPasswordsNotMatching = true;
    }
  }

  setSignUpWarningMessage(message) {
    this.registerWarningMessage = message;
  }

  setSignInErrorMessage(message) {
    this.signInErrorMessage = message;
    this.isUserNameOrPasswordIncorrect = true;
  }

  getServerPath() {
    if (this.mServerPath !== "") {
      var url =
        "http://" +
        this.mServerPath +
        "/comp3005l/wolverine/stock-simulation/ping";

      this.authenticationService.pingServer(url).subscribe(
        response => {
          if (JSON.parse(response.toString()).status == environment.SUCCESS) {
            localStorage.setItem("SERVER_PATH", this.mServerPath.toString());
            this.checkInLocalStorage("SERVER_PATH");
            window.location.reload();
          }
        },
        error => {
          this.setServerPathCheckMessage("Server Path Not Working");
        }
      );
    } else {
      this.setServerPathCheckMessage("Server Path Cannot Be Empty");
    }
  }

  setServerPathCheckMessage(message) {
    this.serverPathCheckMessage = message;
    this.mIsURLCorrect = true;
  }

  checkInLocalStorage(key) {
    if (
      localStorage.getItem(key) === null ||
      localStorage.getItem(key) === ""
    ) {
      $("#modalEndPoint").modal("show");
    } else {
      $("#modalEndPoint").modal("hide");
    }
  }

  checkSession(key) {
    if (
      localStorage.getItem(key) === null ||
      localStorage.getItem(key) === ""
    ) {
      this.router.navigate(["landing"]);
    } else {
      this.router.navigate(["/menu"]);
    }
  }

  handleServiceError(router, boolValue) {
    localStorage.setItem(
      "SERVICE_ERROR",
      JSON.stringify({
        currentRout: router,
        showPage: boolValue
      })
    );
  }

  onSignInEnter() {
    this.userSignIn();
  }

  onGetServerPathEnter() {
    this.getServerPath();
  }

  onSignUpEnter() {
    this.createUser();
  }
}
