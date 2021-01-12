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

    return (currentMinutes() > start) && (currentMinutes() < end)
}
