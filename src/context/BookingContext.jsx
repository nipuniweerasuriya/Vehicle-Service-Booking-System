import { createContext } from "react";

export const BookingContext = createContext({
  bookings: [],
  setBookings: () => {},
  currentBooking: null,
  setCurrentBooking: () => {},
  addBooking: () => {},
  updateBookingStatus: () => {},
  services: [],
  setServices: () => {},
  addService: () => {},
});
