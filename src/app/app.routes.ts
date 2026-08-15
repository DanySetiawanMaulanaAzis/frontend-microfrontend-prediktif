import { Routes } from '@angular/router';
import { EngineerDetail } from './components/engineer-detail/engineer-detail';
import { EngineerSmartprioritization } from './components/engineer-smartprioritization/engineer-smartprioritization';
import { EngineerDetailById } from './components/engineer-detail-by-id/engineer-detail-by-id';

export const routes: Routes = [
  {
    path: '',
    component:  EngineerSmartprioritization,
  },
  {
    path: 'detail',
    component: EngineerDetail,
  },
  {
    path: 'detailbyid',
    component: EngineerDetailById,
  }
];
