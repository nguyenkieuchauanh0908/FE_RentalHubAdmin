import { Component, OnDestroy } from '@angular/core';
import { yearsDataSourceUsers } from '../data';
import { StatisticsService } from '../statistics.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-statistics',
  templateUrl: './users-statistics.component.html',
  styleUrls: ['./users-statistics.component.scss'],
})
export class UsersStatisticsComponent implements OnDestroy {
  totalUsers: number = 0;
  single: any[] | undefined;
  usersByStatus: any[] | undefined;
  yearsDataSourceUsers!: [{ name: string; value: boolean }];
  $destroy: Subject<boolean> = new Subject<boolean>();
  //bar chart
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Tháng';
  showYAxisLabel = true;
  yAxisLabel = 'Người dùng mới';

  //Pie chart
  // options
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  view: [number, number] = [450, 300];

  constructor(
    private statisticsService: StatisticsService,
    private router: Router
  ) {
    Object.assign(this, { yearsDataSourceUsers });
    this.view = [450, 300];
    //Đếm số lượng người dùng
    this.statisticsService
      .countAllUsers()
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.totalUsers = res.data;
        }
      });

    //Đếm số lượng người dùng mới theo tháng trong năm
    this.statisticsService
      .countNewUsersByMonthInYear(
        this.yearsDataSourceUsers[this.yearsDataSourceUsers.length - 1].name
      )
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.single = res.data;
        }
      });

    //Đếm số lượng users theo status (Active and Inactive)
    this.statisticsService
      .countUsersByStatus()
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.usersByStatus = res.data;
        }
      });
  }
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  onSelect(event: any) {
    console.log(event);
  }

  onSelectPie(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onResize(event: any) {
    if (event.target.innerWidth < 768 && event.target.innerWidth > 480) {
      this.view = [event.target.innerWidth / 1.75, 300];
    } else if (event.target.innerWidth > 320 && event.target.innerWidth < 480) {
      this.view = [event.target.innerWidth / 1.35, 300];
    } else {
      {
        this.view = [450, 300];
      }
    }
  }

  checkYear(checked: boolean, yearStamp: string) {
    if (checked) {
      this.yearsDataSourceUsers?.forEach((year) => {
        if (year.name !== yearStamp) {
          year.value = !checked;
        }
      });
    }
    this.single = [];

    if (yearStamp === 'All year') {
      this.xAxisLabel = 'Năm';
      this.statisticsService
        .countNewUsersByYear(yearStamp)
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.single = res.data;
          }
        });
    } else {
      this.xAxisLabel = 'Tháng';
      this.statisticsService
        .countNewUsersByMonthInYear(yearStamp)
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.single = res.data;
          }
        });
    }
  }
  toUsersMange() {
    this.router.navigate(['dashboard/manage-users']);
  }
}
