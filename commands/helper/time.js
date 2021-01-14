const format = (num) =>  num.toString().length  === 1 ? "0" + num.toString() : num.toString();

const timeToMinutes = (time) => {
    time = time.split(":");
    return Number(time[0])*60 + Number(time[1])*1 // converts time to minutes 
}

const currentMinutes = () => {
    let d = new Date;
    return d.getHours()*60 + d.getMinutes()*1 // minutes passed since 00:00
}

module.exports.getDay = () => {
    let d = new Date;
    return d.getDay() - 1 // Monday = 0
}

module.exports.isInPeriod = (time=String) => {
    let start = timeToMinutes(time) - 1; // 1 min failsafe
    let end = timeToMinutes(time);
    end = (start > end) ? end + timeToMinutes("24:00") : end; // if comparing from a different day, add 24 hours

    return (currentMinutes() >= start) && (currentMinutes() <= end)
}

module.exports.isInRange = (startTime=String,endTime=String) => {
    let start = timeToMinutes(startTime);
    let end = timeToMinutes(endTime);
    end = (start > end) ? end + timeToMinutes("24:00") : end; // if comparing from a different day, add 24 hours

    return (currentMinutes() >= start) && (currentMinutes() <= end)
}

module.exports.changeMinutes = (time, d) => {
    let times = time.split(":");
    let format = (num) => num.toString().length  == 1 ? "0" + num.toString() : num.toString()
    hour = Number(times[0]);
    min = Number(times[1]);

    min += d;
    if (min >= 60) {
        min -= 60;
        hour++;
    } else if (min < 0) {
        min += 60;
        hour--;
    }

    if (hour >= 24) {
        hour -= 24;
    } else if (hour < 0) {
        hour += 24;
    }

    return format(hour) + ':' + format(min)
}