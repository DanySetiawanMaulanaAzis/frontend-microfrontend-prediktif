import { Routes } from '@angular/router';
import { EngineerDetail } from './components/engineer-detail/engineer-detail';
import { EngineerSmartprioritization } from './components/engineer-smartprioritization/engineer-smartprioritization';
import { EngineerDetailById } from './components/engineer-detail-by-id/engineer-detail-by-id';
import { OperatorDashboardById } from './components/operator-dashboard-by-id/operator-dashboard-by-id';
import { OperatorDashboardSelectedMachine } from './components/operator-dashboard-selected-machine/operator-dashboard-selected-machine';

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
  },
  {
    path: 'operatordashboardbyid',
    component: OperatorDashboardById,
  },
  {
    path: 'operatordashboardselectedmachine',
    component: OperatorDashboardSelectedMachine,
  }
];
