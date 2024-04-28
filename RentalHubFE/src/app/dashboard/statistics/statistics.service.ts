import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { handleError } from 'src/app/shared/handle-errors';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  get5RecentYearsList() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/get-recent-years')
      .pipe(catchError(handleError));
  }

  countAllUsers() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-all-users')
      .pipe(catchError(handleError));
  }

  countNewUsersByMonthInYear(year: string) {
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-users-month', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  countNewUsersByYear(year: string) {
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-users-year', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }
}
