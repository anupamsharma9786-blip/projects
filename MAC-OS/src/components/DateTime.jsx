import React, { useState, useEffect } from 'react'

const DateTime = () => {
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const dayName = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = now.getFullYear().toString().slice(2, 4)
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')

      setDateTime(`${dayName} ${month} ${year} ${hours}:${minutes}`)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <p>{dateTime}</p>
    </div>
  )
}

export default DateTime
