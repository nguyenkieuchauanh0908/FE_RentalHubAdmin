import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { SendForgetPwEmailComponent } from 'src/app/shared/send-forget-pw-email/send-forget-pw-email.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginObs!: Observable<resDataDTO>;
  password: string = 'password';
  isPwShown: boolean = false;
  isLoading = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.password = 'password';
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const pw = form.value.password;

    this.loginObs = this.authService.login(email, pw);

    this.isLoading = true;
    this.notifierService.hideAll();
    this.loginObs.subscribe(
      (res) => {
        console.log(
          '🚀 ~ file: login.component.ts:32 ~ LoginComponent ~ onSubmit ~ res:',
          res
        );
        this.notifierService.notify('success', 'Đăng nhập thành công!');
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['']);
        }, 1000);
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log(this.error);
        this.notifierService.notify('error', errorMsg);
      }
    );
  }

  onEyesSeePwClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.isPwShown = true;
    } else {
      this.password = 'password';
      this.isPwShown = false;
    }
  }

  onForgetPasswordClick() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(SendForgetPwEmailComponent, {
      data: { title: 'Quên mật khẩu', inputLabel: 'Email' },
      width: '400px',
    });
    const sub = dialogRef.componentInstance.closeDialog.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
