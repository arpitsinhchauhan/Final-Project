import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'app/services/user-service.service';
import PerfectScrollbar from 'perfect-scrollbar';

declare const $: any;
declare interface RouteInfo {
  path?: string;
  title: string;
  icon?: string;
  class?: string;
  children?: RouteInfo[]; // ✅ for nested menus
}

export const ROUTES: RouteInfo[] = [
  { path: '/User', title: 'User Master', icon: 'supervised_user_circle', class: '' },
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/dailyReport', title: 'Daily Report', icon: 'picture_as_pdf', class: '' },
  { path: '/Report', title: 'Report Excel', icon: 'picture_as_pdf', class: '' },
  {
    title: 'Report',
    icon: 'local_gas_station',
    class: 'group',
    children: [
      { path: '/Dipp', title: 'Petrol/Diesel Dip', icon: 'open_with', class: '' },
      { path: '/atm', title: 'ATM & Cash', icon: 'money', class: '' },
      { path: '/Jama&Baki', title: 'Bill Credit & Debit', icon: 'money', class: '' },
    ]
  },
  {
    title: 'Purchase',
    icon: 'local_gas_station',
    class: 'group',
    children: [
      { path: '/purchasedetails', title: 'Purchase Petrol & Diesel', icon: 'content_paste', class: '' },
     { path: '/extraPurchasedetails', title: 'Extra Purchase Petrol & Diesel', icon: 'content_paste', class: '' },
    ]
  },
  {
    title: 'Sales',
    icon: 'local_gas_station',
    class: 'group',
    children: [
      { path: '/petroldetails', title: 'Petrol Sales', icon: 'library_books', class: '' },
      { path: '/dieseldetails', title: 'Diesel Sales', icon: 'ev_station', class: '' },
       { path: '/XPpetrol', title: 'Extra Premium Petrol', icon: 'library_books', class: '' },
      { path: '/powerDiesel', title: 'Extra Premium Diesel', icon: 'ev_station', class: '' },
       { path: '/oilsell', title: 'OilSell', icon: 'meeting_room', class: '' },
    ]
  },
  { path: '/Kharch', title: 'Indirect Expance', icon: 'money', class: '' }

  // {
  //   title: 'Petrol/Diesel',
  //   icon: 'local_gas_station',
  //   class: 'group',
  //   children: [
  //     { path: '/purchasedetails', title: 'Purchase Petrol & Diesel', icon: 'content_paste', class: '' },
  //     { path: '/petroldetails', title: 'Petrol Sales', icon: 'library_books', class: '' },
  //     { path: '/dieseldetails', title: 'Diesel Sales', icon: 'ev_station', class: '' },
  //     { path: '/Dipp', title: 'Petrol/Diesel Dip', icon: 'open_with', class: '' }
  //   ]
  // },
  // {
  //   title: 'Extra Petrol/Diesel',
  //   icon: 'local_gas_station',
  //   class: 'group',
  //   children: [
  //     { path: '/extraPurchasedetails', title: 'Extra Purchase Petrol & Diesel', icon: 'content_paste', class: '' },
  //     { path: '/XPpetrol', title: 'Extra Premium Petrol', icon: 'library_books', class: '' },
  //     { path: '/powerDiesel', title: 'Extra Premium Diesel', icon: 'ev_station', class: '' },
  //     { path: '/extraDipp', title: 'Extra Petrol/Diesel Dip', icon: 'open_with', class: '' }
  //   ]
  // },

  // { path: '/oilsell', title: 'OilSell', icon: 'meeting_room', class: '' },
  // { path: '/Kharch', title: 'Indirect Expance', icon: 'money', class: '' },
  // { path: '/atm', title: 'ATM & Cash', icon: 'money', class: '' },
  // { path: '/Jama&Baki', title: 'Bill Credit & Debit', icon: 'money', class: '' },
  // { path: '/feedback', title: 'User Feedback', icon: 'unarchive', class: '' },

  // { path: '/feedback', title: 'User Feedback', icon: 'unarchive', class: 'active-pro' },

  // { path: '/image', title: 'Image',  icon:'image', class: '' },
  // { path: '/map', title: 'Map',  icon:'map', class: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  role: string = '';
  ps: any;

  constructor(private userService: UserServiceService) { }


  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.role = localStorage.getItem('role') || '';
  
    this.userService.getUserPump(userId).subscribe(response => {
      const data = response?.data || {};
  
      const xpPetrolEnabled = data?.xp_petrol_nozzle !== '0';
      const powerDieselEnabled = data?.powe_diesel_nozzle !== '0';
  
      // ✅ Step 1: Apply nozzle conditions
      let filteredRoutes = ROUTES.map(route => {
        if (route.children) {
          // ✅ Filter children first
          const filteredChildren = route.children.filter(child => {
            if (child.path === '/XPpetrol' && !xpPetrolEnabled) return false;
            if (child.path === '/powerDiesel' && !powerDieselEnabled) return false;
            if ((child.path === '/extraDipp' || child.path === '/extraPurchasedetails') &&
                !xpPetrolEnabled && !powerDieselEnabled) return false;
            return true;
          });
      
          // ✅ If no children left, remove the parent group too
          if (filteredChildren.length === 0) {
            return null;
          }
      
          return { ...route, children: filteredChildren };
        } else {
          // ✅ Single routes — filter directly
          if (route.path === '/XPpetrol' && !xpPetrolEnabled) return null;
          if (route.path === '/powerDiesel' && !powerDieselEnabled) return null;
          if ((route.path === '/extraDipp' || route.path === '/extraPurchasedetails') &&
              !xpPetrolEnabled && !powerDieselEnabled) return null;
          return route;
        }
      }).filter(Boolean); // ✅ Removes nulls from array
      
      
  
      // ✅ Step 2: Apply role-based filter *on top of* nozzle filter
      if (this.role === 'admin') {
        this.menuItems = filteredRoutes.filter(item => item.path === '/User');
      } else if (this.role === 'user') {
        this.menuItems = filteredRoutes.filter(item => item.path !== '/User');
      } else {
        this.menuItems = filteredRoutes;
      }
  
      // ✅ Step 3: Initialize scrollbar
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
        this.ps = new PerfectScrollbar(elemSidebar);
      }
    });
  }
  
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      this.ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }
  expandOrCollapseMenu(id) {
    let parent = document.getElementById(id + "-p");
    let child = document.getElementById(id);
    parent.ariaExpanded = parent.ariaExpanded === "true" ? "false" : "true";
    child.style.height = child.style.height === "0px" || child.style.height === "" ? "100%" : "0";
  }
}