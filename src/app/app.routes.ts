import { Routes } from '@angular/router';
import { EngineerDetail } from './components/engineer-detail/engineer-detail';
import { EngineerSmartprioritization } from './components/engineer-smartprioritization/engineer-smartprioritization';

export const routes: Routes = [
  {
    path: '',
    component:  EngineerSmartprioritization,
  },
  {
    path: 'detail',
    component: EngineerDetail,
  },
];
