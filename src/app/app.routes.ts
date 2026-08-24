import { Routes } from '@angular/router';
import { EngineerDetail } from './components/engineer-detail/engineer-detail';
import { EngineerSmartprioritization } from './components/engineer-smartprioritization/engineer-smartprioritization';
import { EngineerDetailById } from './components/engineer-detail-by-id/engineer-detail-by-id';
import { OperatorDashboardById } from './components/operator-dashboard-by-id/operator-dashboard-by-id';
import { OperatorDashboardSelectedMachine } from './components/operator-dashboard-selected-machine/operator-dashboard-selected-machine';
import { OperatorDashboardCallTechnicianByIdDialog } from './components/operator-dashboard-call-technician-by-id-dialog/operator-dashboard-call-technician-by-id-dialog';
import { TechnicianDashboard } from './components/technician-dashboard/technician-dashboard';
import { TechnicianDashboardById } from './components/technician-dashboard-by-id/technician-dashboard-by-id';

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
  },
  {
    path: 'operatordashboardcalltechnicianbyiddialog',
    component: OperatorDashboardCallTechnicianByIdDialog,
  },
  {
    path: 'techniciandashboard',
    component: TechnicianDashboard,
  },
  {
    path: 'techniciandashboardbyid',
    component: TechnicianDashboardById,
  }
];
