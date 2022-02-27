const moment = require('moment-timezone')


const getTimeString = (timestamp) => {
    /**
     * If timestamp is valid return the datetime string 
     * else return Not Applicable
     */

    return timestamp === null ? "N/A" : moment(timestamp).format("YYYY-MM-DD HH:mm:ss")

}

const getTimeDuration = (timestamp) => {

    /**
     * Get the duration in string for any give timestamp w.r.t to current time
     */
    
    if(timestamp !== null){
        const currentTime = new moment()
        const timestampTime = new moment(timestamp)

        const duration = moment.duration(currentTime.diff(timestampTime))

        return duration.locale("en").humanize()

    }
    else{
        return "N/A"
    }

}

module.exports = {

    getTimeString : getTimeString,
    getTimeDuration : getTimeDuration

}