import { Component } from '@angular/core';

import {
  single,
  multi,
  hostPieChartDataSource,
  postByStatusDataSource,
  yearsDataSourceUsers,
  yearsDataSourceEmployees,
} from './data';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
  single: any[] | undefined;
  multi: any[] | undefined;
  hostPieChartDataSource: any[] | undefined;
  postByStatusDataSource: any[] | undefined;
  yearsDataSourceUsers!: [{ name: string; value: boolean }];
  yearsDataSourceEmployees!: [{ name: string; value: boolean }];
  checked = false;

  view: [number, number] = [450, 300];

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

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor() {
    Object.assign(this, { single });
    Object.assign(this, { multi });
    Object.assign(this, { hostPieChartDataSource });
    Object.assign(this, { postByStatusDataSource });
    Object.assign(this, { yearsDataSourceUsers });
    Object.assign(this, { yearsDataSourceEmployees });
    this.view = [450, 300];
  }

  onResize(event: any) {
    console.log(
      '🚀 ~ StatisticsComponent ~ onResize ~ event.target.innerWidth:',
      event.target.innerWidth
    );
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

  onSelect(event: any) {
    console.log(event);
  }

  //Pie chart
  // options
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  onSelectPie(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  //line chart
  // options
  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = true;

  checkYear(checked: boolean, yearStamp: string, statisticType: string) {
    if (checked) {
      switch (statisticType) {
        case 'users':
          this.yearsDataSourceUsers?.forEach((year) => {
            if (year.name !== yearStamp) {
              year.value = !checked;
            }
          });
          break;
        case 'employees':
          this.yearsDataSourceEmployees?.forEach((year) => {
            if (year.name !== yearStamp) {
              year.value = !checked;
            }
          });
          break;
        default:
      }
    }
  }
}
