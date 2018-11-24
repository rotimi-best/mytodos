
const CalendarModule = require('calendar');
const calendar = new CalendarModule.Calendar();

module.exports = (month) => {
    const today = new Date();
    let monthNumber = !isNaN(month) ? month: today.getMonth();
    let year = today.getFullYear();
    
    if (monthNumber > 12) {
        monthNumber = monthNumber - 12;
        year = year + 1;
    }
    const monthNamesArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthText = monthNamesArray[monthNumber];
    const monthCalendar = calendar.monthDays(year, monthNumber);

    const returnObj = {monthCalendar, monthText, monthNumber, year}
    
    return returnObj;
}




