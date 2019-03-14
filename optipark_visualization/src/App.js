import React, { Component } from 'react';
import logo from './logo.svg';
import {Form, FormControl, FormLabel, FormGroup, ControlLabel, HelpBlock, Checkbox, Radio, Button} from 'react-bootstrap';


import './App.css';
import $ from 'jquery';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);



class App extends Component {
  state = {
    loading: true,
    predictedData: [],
    processedData: [],
    daysBackward: 1,
    daysForward: 1,
    oppositePredictedData: [],
  }

  constructor(props) {
    super(props)

  }

  componentDidMount = () => {
    let predictedData = [];
    let oppositePredictedData = [];
    fetch(require('./forecast_data_formatted.txt')).then((r) => r.text()).then((text => {
      //console.log(text.split(','));
      let data_split = text.split('\n');
      for (let i = 0; i < data_split.length; i++) {
        if (data_split[i].length > 0) {
          let date_split_spots = data_split[i].split(',');
          let date_from_split = new Date(date_split_spots[0]);
          let spots_from_split = 532 - parseInt(date_split_spots[1]);
          //console.log(new Date(date_from_split))
          predictedData.push({ date: date_from_split, value: spots_from_split, color: '#7dabf4' })
          oppositePredictedData.push({ date: date_from_split, value: (532-spots_from_split), color: '#7dabf4' })
          //console.log(spots_from_split)
        }

      }
      this.setState({
        predictedData: predictedData,
        oppositePredictedData: oppositePredictedData,
      })
      //predictedData.push({date: new Date(), spots: text.split(",")[1]})
    }))


    //column
    //am4core.useTheme(kelly);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart3D);
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = "date";
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 40;



    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.propertyFields.stroke = "color";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    var that = this;


    // AJAX QUERY

    $.ajax({
      url: "https://data.smgov.net/resource/tce2-7ir6.json",
      type: "GET",
      data: {
        "$limit": 100000,
        "lot_name": "Library",
        "$$app_token": "Ul8sMHNswBDXCzvlAxpqI6x1Q",
      },
      dataFilter: function (mydata) {
        var pdata = JSON.parse(mydata);
        let startDate = new Date();
        let endDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        //var startDate = new Date("2019-01-01 23:00:00");// hard coded :)
        var dateLess = pdata.filter(function (r) {
          //console.log("r",r.date);// each date
          var d = new Date(r['date_time']);

          return (d.toISOString() >= startDate.toISOString() && d.toISOString() <= endDate.toISOString());
        });
        return JSON.stringify(dateLess);//filtered data
      }

    }).done(function (data) {
      //alert("Retrieved " + data.length + " records from the dataset!");
      let dataProcessed = that.filterData(data, 0);
      chart.data = dataProcessed;
      that.chart = chart;
      that.setState({
        loading: false,
        processedData: dataProcessed,
      })
      that.initiateOtherCharts(data)
    })





  }


  initiateOtherCharts = (data) => {
    let chart2 = am4core.create("chartdiv2", am4charts.XYChart);


    chart2.paddingRight = 20;

    // standard stuff
    let dateAxis = chart2.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";
    chart2.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart2.scrollbarX = scrollbarX;

    chart2.data = this.filterData(data, 1);
    this.chart2 = chart2;

  }


  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // MAKE SURE LISTS IT NOT EMPTY WHEN TRYING TO CREATE
    this.loadData();
    // add to the list here
    // console.log(this.state);
  }



  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  filterData = (raw_data, number) => {
    if (number === 0) {
      console.log("here, number")
      let data = [];
      for (let i = 0; i < raw_data.length; i++) {
        let spots = 532 - parseInt(raw_data[i]['available_spaces'])
        let temp_data = raw_data[i]['date_time']
        if (new Date(temp_data).getMinutes() === 0) {
          data.push({ date: new Date(temp_data), value: spots, color: "#4181e7" })
  
          console.log((new Date(temp_data).getMinutes()))
        }
  
      }
      data[data.length - 1]["color"] = "#d02878";
      console.log(data[data.length - 1]);
  
      //let sd = [{ date: new Date(2018,11,24), nu: 4}, { date: new Date(2018,11,22), nu: 2}, { date: new Date(2018,11,26), nu: 3}]
      //console.log(sd);
  
      data.sort(function (x, y) { return new Date(x['date']).getTime() - new Date(y['date']).getTime() })
      let lastObject;
      if (data.length > 0) {
        lastObject = data[data.length - 1];
      }
      let endDate = new Date();
      endDate.setDate(lastObject["date"].getDate() + parseInt(this.state.daysForward));
      for (let j = 0; j < this.state.predictedData.length; j++) {
        if ((this.state.predictedData[j]["date"] > lastObject["date"]) && this.state.predictedData[j]["date"] <= endDate) {
          if (this.state.predictedData[j]["date"].getMinutes() === 0) {
            data.push((this.state.predictedData[j]))
          }
        }
      }
  
  
      return data
    } else {

      console.log("GETS IN HERE")




      let data2 = [];
      
    for (let i = 0; i < raw_data.length; i++) {
      let spots = parseInt(raw_data[i]['available_spaces'])
      let temp_data = raw_data[i]['date_time']
        data2.push({ date: new Date(temp_data), value: spots, color: "#4181e7" })


    }
    data2[data2.length - 1]["color"] = "#d02878";

    //let sd = [{ date: new Date(2018,11,24), nu: 4}, { date: new Date(2018,11,22), nu: 2}, { date: new Date(2018,11,26), nu: 3}]
    //console.log(sd);

    data2.sort(function (x, y) { return new Date(x['date']).getTime() - new Date(y['date']).getTime() })
    let lastObject;
    if (data2.length > 0) {
      lastObject = data2[data2.length - 1];
    }
    let endDate = new Date();
    endDate.setDate(lastObject["date"].getDate() + parseInt(this.state.daysForward));
    
    for (let j = 0; j < this.state.oppositePredictedData.length; j++) {
      if ((this.state.oppositePredictedData[j]["date"] > lastObject["date"]) && this.state.oppositePredictedData[j]["date"] <= endDate) {
          data2.push(this.state.oppositePredictedData[j])
      }
    }


    return data2
    }

    

  }



  render() {
    return (
      <div className="App">

        <div className="chart">
          <h1 className="title tracking-in-expand"><span className="blue">OPTI</span>PARK</h1>
          <h1 className="subtitle tracking-in-expand">FINDING YOUR OPTIMAL PARKING</h1>
          <h2>{this.state.loading ? <div class="lds-ring"><div></div><div></div><div></div><div></div></div> : null}</h2>
          <div className="subtext__container">
            {this.state.loading ?  null : <div className="subtext">Parking lot demand</div>}
          </div>
          <div id="chartdiv" style={{ height: "500px" }}></div>
          <div className="subtext__container" style={{marginTop: "50px", marginBottom: "0px"}}>
            {this.state.loading ?  null : <div className="subtext">Number of available spots</div>}
          </div>
            <Form className="flex" onSubmit={this.handleSubmit} >

              <FormGroup controlId="formBasicEmail">
                <FormControl type="text" placeholder="Enter backwards"  id="daysBackward" onChange={this.handleChange} />

              </FormGroup>

              <FormGroup controlId="formBasicPassword">
                <FormControl type="text" placeholder="Enter forwards" id="daysForward" onChange={this.handleChange}  />
              </FormGroup>

              <Button variant="primary" type="submit">
                Make changes
              </Button>
            </Form>
          <div id="chartdiv2" style={{ width: "90%", height: "500px" }}></div>

        </div>

      </div>
    );
  }

  loadData = () => {
    let predictedData = []
    
    let chart2 = am4core.create("chartdiv2", am4charts.XYChart);


    chart2.paddingRight = 20;

    // standard stuff
    let dateAxis = chart2.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";


    chart2.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart2.scrollbarX = scrollbarX;



    var that = this;


    // AJAX QUERY

    $.ajax({
      url: "https://data.smgov.net/resource/tce2-7ir6.json",
      type: "GET",
      data: {
        "$limit": 100000,
        "lot_name": "Library",
        "$$app_token": "Ul8sMHNswBDXCzvlAxpqI6x1Q",
      },
      dataFilter: function (mydata) {
        var pdata = JSON.parse(mydata);
        let startDate = new Date();
        let endDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(that.state.daysBackward));
        //var startDate = new Date("2019-01-01 23:00:00");// hard coded :)
        var dateLess = pdata.filter(function (r) {
          //console.log("r",r.date);// each date
          var d = new Date(r['date_time']);

          return (d.toISOString() >= startDate.toISOString() && d.toISOString() <= endDate.toISOString());
        });
        return JSON.stringify(dateLess);//filtered data
      }

    }).done(function (data) {
      //alert("Retrieved " + data.length + " records from the dataset!");
      let dataProcessed2 = that.filterData(data, 1);
      chart2.data = dataProcessed2;
      that.chart2 = chart2;
      that.setState({
        loading: false,
      })
    })


  }
}

export default App;
