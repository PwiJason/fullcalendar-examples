import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { Draggable } from '@fullcalendar/interaction';
import { addWeeks, startOfWeek, format } from 'date-fns';
import { subWeeks } from 'date-fns';
// ... other imports

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date state
  const calendarRef1 = useRef(null); // Ref for the first calendar
  const calendarRef2 = useRef(null); // Ref for the second calendar
  const nextWeekDate = addWeeks(currentDate, 1);
  const handleDatesSet = (arg) => {
    setCurrentDate(arg.start);
  };
  const handlePrev = () => {
    if (calendarRef1.current && calendarRef2.current) {
      calendarRef1.current.getApi().prev();
      calendarRef2.current.getApi().prev();
    }
  };

  const handleNext = () => {
    if (calendarRef1.current && calendarRef2.current) {
      calendarRef1.current.getApi().next();
      calendarRef2.current.getApi().next();
    }
  };

  // ... initialEvents and resources setup
  const initialEvents = [
    {
      title: '23564 Jayco Rubber Roof Cart',
      start: '2024-01-04',
      end: '2024-01-04',
      resourceId: 'techAnthony',
      allDay: true
    },
    {
      title: '23606 Forest River Bridge Crane',
      start: '2024-01-04',
      end: '2024-01-04',
      resourceId: 'techAnthony',
      allDay: true
    },
    {
      title: 'Anthony - 23232 ICM Products CHT USA Mezzanine',
      start: '2024-01-02',
      end: '2024-01-04',
      resourceId: 'techAnthony',
    },
    {
      title: 'Routine Check',
      start: '2023-12-29',
      end: '2023-12-29',
      resourceId: 'techC',
      allDay: true
    },
    {
      title: 'Emergency Repair',
      start: '2023-12-29',
      end: '2023-12-29',
      resourceId: 'techD',
      allDay: true
    },
    {
      title: 'System Upgrade',
      start: '2023-12-29',
      end: '2023-12-29',
      resourceId: 'techE',
      allDay: true
    },
    // ... add more events as needed
  ];
  const [resources, setResources] = useState([]);

  // useEffect(() => {
  //   const extractedResources = initialEvents
  //     .map(event => ({
  //       id: event.resourceId,
  //       title: `Crew ${event.resourceId}`
  //     }))
  //     .filter((resource, index, self) =>
  //       index === self.findIndex((r) => r.id === resource.id)
  //     );
  //
  //   setResources(extractedResources);
  // }, []);
  useEffect(() => {
    const unassignedResourceId = 'unassigned';

    const processedEvents = initialEvents.map(event => {
      if (!event.resourceId) {
        return { ...event, resourceId: unassignedResourceId };
      }
      return event;
    });

    const extractedResources = processedEvents
      .map(event => ({
        id: event.resourceId,
        title: `Crew ${event.resourceId}`
      }))
      .filter((resource, index, self) =>
        index === self.findIndex((r) => r.id === resource.id)
      );

    setResources([{ id: unassignedResourceId, title: 'Unassigned' }, ...extractedResources]);
  }, []);

  useEffect(() => {
    const externalEvents = document.getElementById('external-events');
    if (externalEvents) {
      new Draggable(externalEvents, {
        itemSelector: '.fc-event',
        eventData: function(eventEl) {
          let title = eventEl.getAttribute('data-event');
          title = title ? JSON.parse(title) : {};

          return {
            ...title,
            duration: { days: 1 }
          };
        }
      });
    }
  }, []);


  return (
    <div>
      <div id="external-events">
        <h4>Draggable Events</h4>
        <div className='fc-event' data-event='{"title":"New Event 1", "duration":"01:00"}'>New Event 1</div>
        <div className='fc-event' data-event='{"title":"New Event 2", "duration":"02:00"}'>New Event 2</div>
        {/* Add more draggable events as needed */}
      </div>
    <div>
      <h2>This Week</h2>
    <FullCalendar
      ref={calendarRef1}
      plugins={[interactionPlugin, resourceTimelinePlugin]}
      initialView='resourceTimelineWeek'
      nowIndicator={true}
      resourceAreaWidth="150px"
      height={"auto"}
      slotLabelFormat={{
        day: 'numeric',
        weekday: 'short'
      }}
      headerToolbar={{
        left: 'customPrev,customNext today',
        center: 'title',
        right: ''
      }}
      editable={true}
      resourceAreaHeaderContent="Crew"
      slotDuration={{ day: 1 }}
      droppable={true}
      duration={{ weeks: 4 }}
      datesSet={handleDatesSet}
      initialDate={format(startOfWeek(currentDate), 'yyyy-MM-dd')}
      events={initialEvents}
      resources={resources}

      customButtons={{
        customPrev: {
          text: 'prev',
          click: handlePrev,
        },
        customNext: {
          text: 'next',
          click: handleNext,
        }
      }}

    />
      <h2>Next Week</h2>
  <FullCalendar
    ref={calendarRef2}
    plugins={[interactionPlugin, resourceTimelinePlugin]}
    initialView='resourceTimelineWeek'
    initialDate={format(startOfWeek(nextWeekDate), 'yyyy-MM-dd')}
    resourceAreaWidth="150px"
    height={"auto"}
    slotDuration={{ day: 1 }}
    duration={{ weeks: 4 }}
    headerToolbar={{
      left: 'title',
      center: '',
      right: ''
    }}
    slotLabelFormat={{
      day: 'numeric',
      weekday: 'short'
    }}
    editable={true}
    droppable={true}
    datesSet={handleDatesSet}
    events={initialEvents}
    resources={resources}
    // ... other FullCalendar props, including events and resources

  />
</div>
    </div>
  );
}
