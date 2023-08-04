import { useState, useEffect } from 'react'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const useTimer = (deadline, interval = SECOND) => {
    const [timespan, setTimespan] = useState(new Date(deadline) - Date.now())

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimespan(new Date(deadline) - Date.now())
        }, interval)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    if (Math.floor(timespan / DAY) >= 1) {
        return {
            lockdownDate: deadline
        }
    } else {
        return {
            hours: Math.floor((timespan / HOUR) % 24),
            minutes: Math.floor((timespan / MINUTE) % 60),
            seconds: Math.floor((timespan / SECOND) % 60)
        }
    }
}

export default useTimer