
const CalendarModule = require('calendar');
const calendar = new CalendarModule.Calendar();

module.exports = (num = 0) => {
    const today = new Date();
    let monthNumber = today.getMonth() + num;
    let year = today.getFullYear();
    const monthNamesArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthText = monthNamesArray[monthNumber];

    if (monthNumber > 12) {
        monthNumber = monthNumber - 12;
        year = year + 1;
    }
    const monthCalendar = calendar.monthDays(year, monthNumber);

    const returnObj = {monthCalendar, monthText, monthNumber}
    
    return returnObj;
}




