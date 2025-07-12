import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserServiceService } from 'app/services/user-service.service';
import { SingUp } from 'app/models/SingUp';
import { NotificationService } from 'app/services/notification.service';
import { AuthService } from 'app/AuthService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  data: any = [];
  sign: SingUp = new SingUp();
  dataArray!: any[];
  error: string = '';
  username: string = '';
  password: string = '';
  constructor(private user: UserServiceService,private notificationService:NotificationService,
    private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.createForm();
    if (localStorage.token) {
      (localStorage.token);
      localStorage.removeItem("token");
      (localStorage.token);
    }
  }
  // email: string = '';
  // password: string = '';
  loginError: string = '';



  createForm() {
    this.loginForm = this.fb.group(
      {
        username: [{ value: '' }],
        password: [{ value: '' }],
      }
    );
    this.loginForm.patchValue({
      username: '',
      password: '',
    });
  }
  // onLogin(): void {
  //   this.user.getAllData().subscribe((response: any[]) => {
  //     this.dataArray = response;
  //     const providedUsername = this.loginForm.controls['username'].value;
  //     const providedPassword = this.loginForm.controls['password'].value;
  //     let found = false;

  //     for (let i = 0; i < this.dataArray.length; i++) {
  //       const userData = this.dataArray[i];
  //       if (userData.username === providedUsername && userData.password === providedPassword) {
  //         found = true;
  //         break; // Exit the loop once a match is found
  //       }
  //     }

  //     if (found) {
  //       this.router.navigate(['/dashboard']);
  //     } else {
  //       this.error = 'Invalid username or password';
  //     }
  //   });
  // }

  // onLogin(): void {
  //   if (this.loginForm.invalid) {
  //     // Handle form validation errors
  //     return;
  //   }

  //   const { username, password } = this.loginForm.value;

  //   this.user.login(username, password).subscribe(
  //     (response: any) => {
  //       this.dataArray = response;
  //           const providedUsername = this.loginForm.controls['username'].value;
  //           const providedPassword = this.loginForm.controls['password'].value;
  //           let found = false;

  //           for (let i = 0; i < this.dataArray.length; i++) {
  //             const userData = this.dataArray[i];
  //             if (userData.username === providedUsername && userData.password === providedPassword) {
  //               found = true;
  //               break; // Exit the loop once a match is found
  //             }
  //           }
  //       if (found) {
  //         this.router.navigate(['/dashboard']);
  //       } else {
  //         this.error = response.message || 'Invalid username or password';
  //       }
  //     },
  //     (error) => {
  //       // Handle HTTP errors or other subscription errors
  //       console.error('Login error:', error);
  //       this.error = 'An error occurred while logging in';
  //     }
  //   );
  // }
  onLogin(): void {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    if (!username || !password) {
      this.notificationService.failure("Please enter username and password.");
      return;
    } 
    this.user.loginIN(username, password).subscribe(
      (response) => {
        console.log(response);
        // this.authService.setNozzleValues(response.xpPetrolNozzle, response.powerDieselNozzle);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('username', response.username);
        if (response.token) {
          this.user.setUserId(response.userId);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          if (response.role === 'user') {
            this.router.navigate(['/dashboard']);
          } else if (response.role === 'admin') {
            this.router.navigate(['/User']);
          } else {
            this.notificationService.failure("Unknown role. Please contact admin.");
          }
        } else {
          this.notificationService.failure("Please enter correct username and password.");
        }
        //  alert("Login successful");
        //  (">>>>>>>>>>>");
        // if (response.token && response.role === 'user') {
        //   this.router.navigate(['/dashboard']);
        // } else if (response.token && response.role === 'admin') {
        //   this.router.navigate(['/User']);
        // } else {
        //   alert("Please enter correct username and password.");
        // }
        
        // if (response.username === 'aaa'||response.token != null || response.token != "") {
        //   this.router.navigate(['/dashboard']);
        //   // localStorage.removeItem("token");    
        // } else if(response.username === 'arpit'||response.token != null || response.token != "" ){
        //   this.router.navigate(['/User']);
        //   // alert("Plz rightp username and password  ");
        // }
      },
      (error) => {
        this.notificationService.failure("Server Close? Start the Server:");
      }
    );
  }
}



