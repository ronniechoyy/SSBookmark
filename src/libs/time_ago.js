import Tran from "./translater";

function Time_ago({ New_time, Old_time }) {
  let Time_between = New_time - Old_time;
  
  const Minisecond_ago = 1;
  const Second_ago = 1000;
  const Min_ago = 1000 * 60;
  const Hour_ago = 1000 * 60 * 60;
  const Day_ago = 1000 * 60 * 60 * 24;
  const Month_ago = 1000 * 60 * 60 * 24 * 30;
  const Year_ago = 1000 * 60 * 60 * 24 * 30 * 12;

  let Output_time;
  let isFuture = Time_between < 0;

  if (isFuture) {
    Time_between = -Time_between; // Make the time difference positive
  }

  if (Time_between > Year_ago) {
    Output_time = <>{Math.round(Time_between / Year_ago)} <Tran text={{ en: isFuture ? 'year from now' : 'year ago', "zh-TW": isFuture ? '年後' : '年前', }} /></>;
  }
  else if (Time_between > Month_ago) {
    Output_time = <>{Math.round(Time_between / Month_ago)} <Tran text={{ en: isFuture ? 'month from now' : 'month ago', "zh-TW": isFuture ? '個月後' : '個月前', }} /></>;
  }
  else if (Time_between > Day_ago) {
    Output_time = <>{Math.round(Time_between / Day_ago)} <Tran text={{ en: isFuture ? 'day from now' : 'day ago', "zh-TW": isFuture ? '天後' : '天前', }} /></>;
  }
  else if (Time_between > Hour_ago) {
    Output_time = <>{Math.round(Time_between / Hour_ago)} <Tran text={{ en: isFuture ? 'hour from now' : 'hour ago', "zh-TW": isFuture ? '小時後' : '小時前', }} /></>;
  }
  else if (Time_between > Min_ago) {
    Output_time = <>{Math.round(Time_between / Min_ago)} <Tran text={{ en: isFuture ? 'minute from now' : 'minute ago', "zh-TW": isFuture ? '分鐘後' : '分鐘前', }} /></>;
  }
  else if (Time_between > Second_ago) {
    Output_time = <>{Math.round(Time_between / Second_ago)} <Tran text={{ en: isFuture ? 'second from now' : 'second ago', "zh-TW": isFuture ? '秒後' : '秒前', }} /></>;
  }
  else if (Time_between > Minisecond_ago) {
    Output_time = <>{Math.round(Time_between / Minisecond_ago)} <Tran text={{ en: isFuture ? 'millisecond from now' : 'millisecond ago', "zh-TW": isFuture ? '毫秒後' : '毫秒前', }} /></>;
  }
  // console.log('Output_time', Output_time);
  return (<>{Output_time}</>);
}

export default Time_ago;