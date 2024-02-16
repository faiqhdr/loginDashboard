import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Arrays to store chart and table data from API
  chartDonut: any[] = [];
  chartBar: any[] = [];
  tableUsers: any[] = [];

  // Responses
  responseData: any;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch data from API using token
    const headers = this.authService.getHeaders();

    this.http
      .get<any>('http://test-demo.aemenersol.com/api/dashboard', { headers })
      .subscribe(
        (data) => {
          // API response handling
          this.chartDonut = data.chartDonut || [];
          this.chartBar = data.chartBar || [];
          this.tableUsers = data.tableUsers || [];

          this.responseData = data;
          this.successMessage = 'Successfully retrieved data from API.';
          alert(this.successMessage);
          console.log('API Data:', data);

          // Initialize charts after data retrieval
          this.initDonutChart();
          this.initBarChart();
        },
        (error) => {
          if (error.status === 401) {
            // Unauthorized access, redirect to Sign In page
            this.errorMessage = 'Unauthorized access. Redirecting to Sign In.';
            alert(this.errorMessage);
            this.authService.clearToken();
            this.router.navigate(['/sign-in']);
          } else {
            // Other API error, display error message
            this.errorMessage =
              'Error fetching data from the API. Check your API.';
            alert(this.errorMessage);
          }
        }
      );
  }

  ngOnDestroy(): void {
    am4core.disposeAllCharts();
  }

  signOut(): void {
    // Clear user token, navigate to Sign In page
    this.authService.clearToken();
    this.router.navigate(['/sign-in']);
  }

  // Initialize donut chart using amCharts
  private initDonutChart(): void {
    const donutChart = am4core.create('donutChart', am4charts.PieChart);
    donutChart.data = this.chartDonut;

    // Donut chart settings
    const pieSeries = donutChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.tooltipText = '{name}: {value.value}';

    donutChart.innerRadius = am4core.percent(40);
  }

  // Initialize bar chart using amCharts
  private initBarChart(): void {
    const barChart = am4core.create('barChart', am4charts.XYChart);
    barChart.data = this.chartBar;

    // Bar chart settings
    const categoryAxis = barChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.location = 0;

    const valueAxis = barChart.yAxes.push(new am4charts.ValueAxis());

    const series = barChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'name';
    series.name = 'Value';

    series.columns.template.tooltipText = '{categoryX}: {valueY}';

    barChart.cursor = new am4charts.XYCursor();
  }
}
