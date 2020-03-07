import React, { Component } from "react";
import moment from "moment";
import styles from "./calendar.css";

class Calendar extends Component {
  state = {
    dateContext: moment(),
    today: moment(),
    showMonthPopUp: false,
    showYearPopUp: false
  };

  constructor(props) {
    super(props);
  }

  //Monday, Tuesday,...
  weekdays = moment.weekdays();
  //Mon, Tues,...
  weekdaysShort = moment.weekdaysShort();
  month = moment.months();

  year = () => {
    return this.state.dateContext.format("Y");
  };

  month = () => {
    return this.state.dateContext.format("MMMM");
  };

  daysInMonth = () => {
    return this.state.dateContext.daysInMonth();
  };

  currentDate = () => {
    return this.state.dateContext.get("date");
  };

  currentDay = () => {
    return this.state.dateContext.format("D");
  };

  firstDayOfMonth = () => {
    let dateContext = this.state.dateContext;
    let firstDay = moment(dateContext)
      .startOf("month")
      .format("d");
    return firstDay;
  };

  setMonth = (month) =>{
    let monthNo = moment.months().indexOf(month);
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("month", monthNo);
    this.setState({
      dateContext: dateContext
    });
  };

  onSelectChange = (e, data)=>{
    this.setMonth(data);
    this.props.onMonthChange && this.props.onMonthChange();
  };

  SelectList = (props) =>{
    let popup = props.data.map((data)=>{
      return(
          <div key={data}>
            <a href="#" onClick={(e)=>{this.onSelectChange(e,data)}}>
              {data}
            </a>
          </div>
      );
    });
    return(
        <div className={styles.monthpopup}>
          {popup}
        </div>
    );
  };

  onChangeMonth = (e, month) =>{
    this.setState({
      showMonthPopUp: !(this.state.showMonthPopUp)
    });
  };

  MonthNav = () => {
      return(
          <span className={styles.labelMonth}
              onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
            {this.month()}
            {this.state.showMonthPopUp && <this.SelectList data={moment.months()}/>}

          </span>
      );
  };

  showYearEditor = () =>{
    this.setState({
      showYearNav: true
    });
  };

  setYear = (year) =>{
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("year", year);
    this.setState({
      dateContext: dateContext
    });
  };

  onYearChange = (e)=>{
    this.setYear(e.target.value);
    this.props.onYearChange && this.props.onYearChange();
  };

  onKeyUpYear = (e) =>{
    //13 is Enter, 27 is Escape
    if(e.which===13 || e.which ===27){
      this.setYear(e.target.value);
      this.setState({
        showYearNav: false
      });
    }
  };

  YearNav = () =>{
    return(
        this.state.showYearNav ?
            <input defaultValue={this.year()}
            className={styles.editorYear}
            ref={(yearInput)=>{this.yearInput = yearInput}}
            onKeyUp={(e)=>this.onKeyUpYear(e)}
            onChange={(e)=>this.onYearChange(e)}
            type="number"
            placeholder="year"/>
            :
        <span
            className={styles.labelYear}
            onDoubleClick={(e)=>{this.showYearEditor()}}>
          {this.year()}
        </span>
    )
  };

  render() {
    //Map the weekdays i.e. Sun, Mon,...
    let weekdays = this.weekdaysShort.map(day => {
      return (
        <td key={day} className={styles.weekday}>
          {day}
        </td>
      );
    });

    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(
        <td key={i * 80} className={styles.emptySlot}>
          {""}
        </td>
      );
    }
    console.log("blanks: ", blanks);

    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let day = d === this.currentDay() ? "day current-day" : "day";
      daysInMonth.push(
        <td className={styles.day}>
          <span>{d}</span>
        </td>
      );
    }

    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        let insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }

      if (i === totalSlots.length - 1) {
        let insertRow = cells.slice();
        rows.push(insertRow);
      }
    });

    let trElems = rows.map((d, i) => {
      return <tr key={i * 100}>{d}</tr>;
    });

    console.log("daysInMonth: ", daysInMonth);

    return (
      <div className={styles.calendarContainer}>
        <table className={styles.calendarTable}>
          <thead>
            <tr className={styles.calHeader}>
              <td colSpan="5">
                <this.MonthNav />
                {" "}
                <this.YearNav/>
              </td>

            </tr>
          </thead>
          <tbody>
            <tr>{weekdays}</tr>
            {trElems}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Calendar;
