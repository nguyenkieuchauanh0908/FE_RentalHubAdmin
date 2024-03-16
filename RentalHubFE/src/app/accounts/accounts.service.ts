import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject, catchError, tap } from 'rxjs';
import { User } from '../auth/user.model';
import { handleError } from '../shared/handle-errors';

@Injectable({ providedIn: 'root' })
export class AccountService {
  currentUserId = new Subject<string>();
  private currentUser = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient) {}

  getCurrentUser = this.currentUser.asObservable();
  setCurrentUser(updatedUser: User | null) {
    this.currentUser.next(updatedUser);
  }

  getCurrentUserId(): string | null {
    console.log('on getting current userId ...');
    let uId: string | null | undefined = null;
    this.getCurrentUser.subscribe((user) => {
      uId = user?._id;
    });
    console.log('current uId: ', uId);
    return uId;
  }

  getProfile(uId: string) {
    console.log('current uId: ', uId);
    let profile: User | null = null;
    this.getCurrentUser.subscribe((user) => {
      profile = user;
    });
    return profile;
  }

  getAllInspectors(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'admin/get-inspectors-list', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  getInspectorById(id: string) {
    let queryParams = new HttpParams().append('inspectId', id);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'admin/get-inspector-by-id', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  blockInspectorById(id: string) {
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'admin/block-inspector', {
        inspectId: id,
      })
      .pipe(catchError(handleError));
  }

  updateProfile(updatedProfile: any) {
    console.log('on calling update profile api...', updatedProfile);
    let updatedtUser: User;
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'users/update-profile', {
        _fname: updatedProfile._fname,
        _lname: updatedProfile._lname,
        _dob: updatedProfile._dob,
        _address: '',
        _phone: updatedProfile._phone,
        _email: updatedProfile._email,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.getCurrentUser.subscribe((currentUser) => {
            if (currentUser) {
              currentUser._fname = res.data._fname;
              currentUser._lname = res.data._lname;
              currentUser._email = res.data._email;
              currentUser._phone = res.data._phone;
              updatedtUser = currentUser;
            }
          });
          this.setCurrentUser(updatedtUser);
        })
      );
  }

  updateAvatar(avatar: File) {
    console.log('Your updated avatar type: ', avatar);
    let body = new FormData();
    body.append('_avatar', avatar);
    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );
    let updatedtUser: User;
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'users/update-avatar', body, {
        headers: headers,
      })
      .pipe(
        tap((res) => {
          this.getCurrentUser.subscribe((currentUser) => {
            if (currentUser) {
              currentUser._avatar = res.data._avatar;
              updatedtUser = currentUser;
            }
          });
          this.setCurrentUser(updatedtUser);
        })
      )
      .pipe(catchError(handleError));
  }

  verifyAccount(phone: string) {
    console.log('your phone is: ', phone);
    console.log('sending otp to mail ...');
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/active-host', {
        _phone: phone,
      })
      .pipe(catchError(handleError));
  }

  confirmOtp(otp: string) {
    console.log('On verify otp...', otp);
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/verify-host', {
        otp: otp,
      })
      .pipe(catchError(handleError));
    //Xử lý otp hết hạn hoặc yêu cầu gửi lại otp
  }

  resetOtp() {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/reset-otp', {})
      .pipe(catchError(handleError));
  }

  updateEmailPassword(email: string, pw: string, repw: string) {
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'users/update-login-info', {
        _email: email,
        _pw: pw,
        _pwconfirm: repw,
      })
      .pipe(catchError(handleError));
  }

  updateInspectorPass(inspectId: string, pw: string, repw: string) {
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'admin/update-inspector-pass', {
        _inspectId: inspectId,
        _pw: pw,
        _pwconfirm: repw,
      })
      .pipe(catchError(handleError));
  }

  addNewInspector(email: string, pw: string, repw: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'admin/create-inspector', {
        _email: email,
        _pw: pw,
        _pwconfirm: repw,
      })
      .pipe(catchError(handleError));
  }
}
