import { Routes } from '@angular/router';
import { AuthGuard } from 'app/authGuard';
import { LoginComponent } from 'app/login/login.component';
import { AboutUsComponent } from 'app/modules/about-us/about-us.component';
import { AtmTransactionComponent } from 'app/modules/atm-transaction/atm-transaction.component';
import { CustomerListComponent } from 'app/modules/customer-list/customer-list.component';
import { DashboardComponent } from 'app/modules/dashboard/dashboard.component';
import { DipStockReportComponent } from 'app/modules/dip-stock/dip-stock-report/dip-stock-report.component';
import { DipStockComponent } from 'app/modules/dip-stock/dip-stock.component';
import { ExtraDipComponent } from 'app/modules/extra-dip/extra-dip.component';
import { ExtraPurchaseListComponent } from 'app/modules/extra-purchase-list/extra-purchase-list.component';
import { IconsComponent } from 'app/modules/icons/icons.component';
import { JamaBakiComponent } from 'app/modules/jama-baki/jama-baki.component';
import { KharchComponent } from 'app/modules/kharch/kharch.component';
import { MainPanelComponent } from 'app/modules/main-panel/main-panel.component';
import { MapsComponent } from 'app/modules/maps/maps.component';
import { NotificationsComponent } from 'app/modules/notifications/notifications.component';
import { PowerDiesellistComponent } from 'app/modules/power-diesellist/power-diesellist.component';
import { TableListComponent } from 'app/modules/table-list/table-list.component';
import { TypographyComponent } from 'app/modules/typography/typography.component';
import { UpgradeComponent } from 'app/modules/upgrade/upgrade.component';
import { UserMasterComponent } from 'app/modules/user-master/user-master.component';
import { XpPetrolListComponent } from 'app/modules/xp-petrol-list/xp-petrol-list.component';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'User', component: UserMasterComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'Report', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'purchasedetails', component: TableListComponent, canActivate: [AuthGuard] },
    { path: 'extraPurchasedetails', component: ExtraPurchaseListComponent, canActivate: [AuthGuard] },
    { path: 'petroldetails', component: TypographyComponent, canActivate: [AuthGuard] },
    { path: 'dieseldetails', component: IconsComponent, canActivate: [AuthGuard] },
    { path: 'XPpetrol', component: XpPetrolListComponent, canActivate: [AuthGuard] },
    { path: 'powerDiesel', component: PowerDiesellistComponent, canActivate: [AuthGuard] },
    { path: 'oilsell', component: MapsComponent, canActivate: [AuthGuard] },
    { path: 'Dipp', component: DipStockComponent, canActivate: [AuthGuard] },  
    { path: 'extraDipp', component: ExtraDipComponent, canActivate: [AuthGuard] },  
    { path: 'Kharch', component: KharchComponent, canActivate: [AuthGuard] },
    { path: 'atm', component: AtmTransactionComponent, canActivate: [AuthGuard] },
    { path: 'Jama&Baki', component: JamaBakiComponent, canActivate: [AuthGuard] },
    { path: 'DipTable', component: DipStockReportComponent, canActivate: [AuthGuard] },
    { path: 'image', component: NotificationsComponent, canActivate: [AuthGuard] },
    { path: 'feedback', component: UpgradeComponent, canActivate: [AuthGuard] },
    { path: 'aboutus', component: AboutUsComponent, canActivate: [AuthGuard] },
    { path: 'dailyReport', component: MainPanelComponent, canActivate: [AuthGuard] },
    { path: 'customer', component: CustomerListComponent, canActivate: [AuthGuard] },
// { path: 'map', component: MapComponent , canActivate: [AuthGuard]},
];
// {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    // , canActivate: [AuthGuard]