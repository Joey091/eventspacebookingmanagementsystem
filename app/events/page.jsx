// Events.jsx
"use client"
import React, { useState, useEffect } from 'react'
import EventList from '@/components/event/EventList'

function Events() {



  return (
    <div className="container mx-auto p-6">
      <EventList />
    </div>
  )
}

export default Events
