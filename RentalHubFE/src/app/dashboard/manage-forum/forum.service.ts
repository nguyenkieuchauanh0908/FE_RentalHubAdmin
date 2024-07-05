import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { handleError } from 'src/app/shared/handle-errors';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  constructor(private http: HttpClient) {}

  getReportedSocialPosts(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('limit', limit)
      .append('page', page);
    return this.http
      .get<resDataDTO>(
        environment.baseUrl + 'social/get-reported-social-post',
        {
          params: queryParams,
        }
      )
      .pipe(catchError(handleError));
  }

  getSocialPostStatus(status: number | null, page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    //Nếu không truyền status thì lấy tất cả post
    if (status) {
      queryParams = queryParams.append('status', status);
    }
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'social/get-social-posts-status', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  unlockReportedPost(postId: string) {
    let queryParams = new HttpParams().append('postId', postId);
    return this.http
      .patch<resDataDTO>(
        environment.baseUrl + 'social/admin/block-social-post',
        {},
        {
          params: queryParams,
        }
      )
      .pipe(catchError(handleError));
  }

  lockReportedPost(reportId: string, status: number) {
    let queryParams = new HttpParams().append('reportedId', reportId);
    if (status === 2) {
      return this.http
        .patch<resDataDTO>(
          environment.baseUrl + 'social/sensor-reported-request',
          { status: status },
          {
            params: queryParams,
          }
        )
        .pipe(catchError(handleError));
    } else {
      return this.http
        .patch<resDataDTO>(
          environment.baseUrl + 'social/sensor-reported-request',
          {},
          {
            params: queryParams,
          }
        )
        .pipe(catchError(handleError));
    }
  }
}
