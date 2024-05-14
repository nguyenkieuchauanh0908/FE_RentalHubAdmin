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

  //Users statistics
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

  countUsersByStatus() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-users-status')
      .pipe(catchError(handleError));
  }
  //Posts Statistics
  countAllPosts() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-all-posts')
      .pipe(catchError(handleError));
  }

  countPostsByMonth(year: string) {
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-posts-month', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  countPostsByYear(year: string) {
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-posts-year', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  countPostsByStatus() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-posts-status')
      .pipe(catchError(handleError));
  }

  //Host statistics
  countAllHosts() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-all-hosts')
      .pipe(catchError(handleError));
  }

  countHostsByMonth(year: string) {
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-host-month', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  countHostsByYear(year: string) {
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-host-year', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  countHostsByStatus() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-host-status')
      .pipe(catchError(handleError));
  }

  countHostsAndUsersByMonthInAYear(year: string) {
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(
        environment.baseUrl + 'statistic/count-host-user-month',
        {
          params: queryParams,
        }
      )
      .pipe(catchError(handleError));
  }

  countHostsAndUsersByYears(year: string) {
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-host-user-year', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  //Employees statistics
  countAllEmployees() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-all-inspectors')
      .pipe(catchError(handleError));
  }

  countEmployeessByStatus() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'statistic/count-inspector-status')
      .pipe(catchError(handleError));
  }

  countEmployeesAndUsersByMonthInAYear(year: string) {
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(
        environment.baseUrl + 'statistic/count-employee-user-month',
        {
          params: queryParams,
        }
      )
      .pipe(catchError(handleError));
  }

  countEmployeesAndUsersByYears(year: string) {
    console.log('countEmployeesAndUsersByYears');
    let queryParams = new HttpParams().append('year', year);
    return this.http
      .get<resDataDTO>(
        environment.baseUrl + 'statistic/count-employee-user-year',
        {
          params: queryParams,
        }
      )
      .pipe(catchError(handleError));
  }
}
