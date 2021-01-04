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

module.exports.isInRange = (minTime, maxTime) => {
    const currentTime = () => {
        let d = new Date();
        return d.toTimeString().split(' ')[0].slice(0, 5) // gets time in HH:MM (from ["20:32:01", "GMT+0530", "(India", "Standard", "Time)"])
    };
    let toMins = (currTime) => {
        let times = currTime.toString().split(":");
        return Number(times[0]) * 60 + Number(times[1])
    }
    
    return toMins(currentTime()) <= toMins(maxTime) && toMins(currentTime()) >= toMins(minTime)
}