import { Person, Event } from '../types/FamilyTree';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const scheduleEventNotifications = (events: Event[], people: Person[]) => {
  events.forEach(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const timeDiff = eventDate.getTime() - now.getTime();
    
    // Schedule notification for events happening today or tomorrow
    if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
      const person = people.find(p => p.id === event.personId);
      if (person) {
        setTimeout(() => {
          showNotification(event, person);
        }, Math.max(0, timeDiff - 60 * 60 * 1000)); // 1 hour before
      }
    }
  });
};

export const showNotification = (event: Event, person: Person) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(event.title, {
      body: event.description || `Don't forget about ${person.name}'s special day!`,
      icon: person.photo || '/vite.svg',
      tag: event.id,
      requireInteraction: false
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
};

export const showBirthdayNotification = (person: Person) => {
  const age = new Date().getFullYear() - new Date(person.dateOfBirth).getFullYear();
  
  showNotification({
    id: `birthday-${person.id}`,
    type: 'birthday',
    title: `🎉 ${person.name}'s Birthday!`,
    date: new Date().toISOString(),
    personId: person.id,
    description: `${person.name} is turning ${age} today!`
  }, person);
};