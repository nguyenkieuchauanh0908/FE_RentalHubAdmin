import { Component, OnDestroy } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { yearsDataSourceEmployees } from '../data';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employees-statistics',
  templateUrl: './employees-statistics.component.html',
  styleUrls: ['./employees-statistics.component.scss'],
})
export class EmployeesStatisticsComponent implements OnDestroy {
  totalEmployees: number = 0;
  multi: any[] | undefined;
  yearsDataSourceEmployees!: [{ name: string; value: boolean }];
  employeesByStatus: any[] | undefined;
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
  yAxisLabel = 'Nhân viên và người dùng mới';

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  view: [number, number] = [450, 300];

  //Pie chart
  // options
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  //line chart
  // options
  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = true;

  onSelectPie(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  constructor(
    private statisticsService: StatisticsService,
    private router: Router
  ) {
    Object.assign(this, { yearsDataSourceEmployees });
    this.view = [450, 300];
    this.yearsDataSourceEmployees[
      this.yearsDataSourceEmployees.length - 1
    ].value = true;
    //Lấy số lượng employees
    this.statisticsService
      .countAllEmployees()
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.totalEmployees = res.data;
        }
      });

    //Đếm số lượng employees theo status (Active and Inactive)
    this.statisticsService
      .countEmployeessByStatus()
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.employeesByStatus = res.data;
        }
      });

    //Lấy data employees and users theo tháng trong một năm
    this.statisticsService
      .countHostsAndUsersByMonthInAYear(
        this.yearsDataSourceEmployees[this.yearsDataSourceEmployees.length - 1]
          .name
      )
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.multi = res.data;
        }
      });
  }
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  onSelect(event: any) {
    console.log(event);
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
      this.yearsDataSourceEmployees?.forEach((year) => {
        if (year.name !== yearStamp) {
          year.value = !checked;
        }
      });
    }
    this.multi = [];
    if (yearStamp === 'All year') {
      this.xAxisLabel = 'Năm';
      this.statisticsService
        .countEmployeesAndUsersByYears(yearStamp)
        .subscribe((res) => {
          if (res.data) {
            this.multi = res.data;
          }
        });
    } else {
      this.xAxisLabel = 'Tháng';
      this.statisticsService
        .countEmployeesAndUsersByMonthInAYear(yearStamp)
        .subscribe((res) => {
          if (res.data) {
            this.multi = res.data;
          }
        });
    }
  }

  toEmployeesManage() {
    this.router.navigate(['dashboard/manage-employees']);
  }
}
