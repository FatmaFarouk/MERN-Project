import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private ApiUrl='http://localhost:3000/analysis'
  constructor(private http: HttpClient) { }

  getAllAnalysis():Observable<any>{

    return this.http.get(this.ApiUrl+"/AllAnalysis")
  }

  getOnlineAnalysis():Observable<any>{
    return this.http.get(this.ApiUrl+"/OnlineAnalysis")
  }

  getBranchAnalysis(BranchId:string | undefined):Observable<any>{
    const params = new HttpParams().set('userId', BranchId!);
    return this.http.get(`${this.ApiUrl}/BranchAnalysis/${BranchId}`);
  }
  getProductAnalysis(ProductId:string):Observable<any>{
    return this.http.get(`${this.ApiUrl}/ProductAnalysis/${ProductId}`)
  }
  
}
