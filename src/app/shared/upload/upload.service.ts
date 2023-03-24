import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map, Observable, tap } from 'rxjs';
import { Upload } from './upload.type';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private _httpClient: HttpClient) { }

  upload(file: any): Observable<any> {
    const formData = new FormData();

    formData.append("file", file, file.name);

    return this._httpClient.post(`${environment.API_URL}/api/upload`, formData)
  }

  uploads(files: any): Observable<Upload[]> {
    const formData = new FormData();

    for (const file of files) {
      formData.append("files", file);
    }

    return this._httpClient.post<{data: Upload[]}>(`${environment.API_URL}/api/uploads`, formData)
      .pipe(
        map(e => e.data),
      )
  }

  get(url: string): Observable<any> {
    return this._httpClient.get(url, { responseType: 'blob' })
  }
}
