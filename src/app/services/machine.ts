import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
import { Machine } from '../models/machine';
import { Createandupdatemachinerequest } from '../models/createandupdatemachinerequest';
import { Detailmachine } from '../models/detailmachine';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  private http = inject(HttpClient);
  // Endpoint mengarah ke api/Machine sesuai atribut [Route("api/[controller]")] di .NET
  private apiUrl = environment.apiUrl;

  // GET: api/Machine
  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(`${this.apiUrl}/Machine`);
  }

  // GET: api/Machine/{id}
  getMachineById(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/Machine/${id}`);
  }

  // POST: api/Machine
  createMachine(machineData: Createandupdatemachinerequest): Observable<Machine> {
    return this.http.post<Machine>(`${this.apiUrl}/Machine`, machineData);
  }

  // PUT: api/Machine/{id}
  updateMachine(id: number, machineData: Machine): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Machine/${id}`, machineData);
  }

  // DELETE: api/Machine/{id}
  deleteMachine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Machine/${id}`);
  }

  // GET: api/Machine/details
  getMachineDetails(): Observable<Detailmachine[]> {
    return this.http.get<Detailmachine[]>(`${this.apiUrl}/Machine/details`);
  }

  // GET: api/Machine/details/{id}
  getMachineDetailById(id: number): Observable<Detailmachine> {
    return this.http.get<Detailmachine>(`${this.apiUrl}/Machine/details/${id}`);
  }
}
