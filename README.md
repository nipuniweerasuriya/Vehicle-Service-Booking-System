# Vehicle Service Booking System UI

A modern, professional, and fully responsive Vehicle Service Booking System with customer and admin portals.

## 🎨 Design Features

### Design Aesthetic

- **Color Scheme**: Professional blue (#0284c7) with dark gray accents (#1a2332)
- **Typography**: Inter for body text, Poppins for headings
- **Layout**: Card-based design with minimal, clean aesthetic
- **Effects**: Smooth hover effects, fade animations, responsive transitions
- **Accessibility**: WCAG compliant, semantic HTML, keyboard navigation

### UI Components

- Custom styled buttons (primary, secondary, outline)
- Reusable card components with interactive hover states
- Professional input fields with focus states
- Status badges with color coding
- Static card layouts
- Responsive grid systems

---

## 📁 Project Structure

```
src/
├── main.jsx                    # React entry point
├── App.jsx                     # Main app component with routing
├── index.css                   # Tailwind + custom styles
├── context/
│   ├── AuthContext.jsx        # Authentication state
│   └── BookingContext.jsx     # Booking management state
├── components/
│   ├── Header.jsx             # Navigation header
│   ├── Footer.jsx             # Footer component
│   └── StatCard.jsx           # Admin dashboard stat cards
└── pages/
    ├── Home.jsx               # Landing page
    ├── ServiceList.jsx        # Services catalog
    ├── BookingForm.jsx        # Service booking form
    ├── BookingConfirmation.jsx # Confirmation page
    ├── TrackBooking.jsx       # Booking status tracking
    ├── AdminLogin.jsx         # Admin login page
    ├── AdminDashboard.jsx     # Admin overview dashboard
    ├── ManageBookings.jsx     # Admin booking management
    └── ServiceManagement.jsx  # Admin service management
```

---

## 🚀 Customer Features

### Home Page

- Hero section with brand messaging
- Feature highlights (Quick Booking, Expert Technicians, etc.)
- Popular services showcase
- Call-to-action buttons

### Service List

- 6 pre-defined service categories with icons
- Service descriptions and pricing
- FAQ section for customer education
- Service booking links

### Booking Form

- Multi-step form with validation
- Personal information collection (name, phone)
- Vehicle details (registration number, model)
- Service selection dropdown
- Date and time slot selection
- Real-time validation with error messages
- Form submission handling

### Booking Confirmation

- Success message with visual confirmation
- Booking ID display with copy functionality
- Complete booking details summary
- Service center information
- Important notes and instructions
- Print/download functionality
- Track booking link

### Track Booking

- Search by Booking ID
- Search by Phone Number
- Real-time booking status display
- Status timeline visualization
- Booking details display
- Example bookings for demo

---

## 👨‍💼 Admin Features

### Admin Login

- Secure login interface
- Email and password authentication
- Demo credentials (admin@vehiclecare.com / admin123)
- Error handling and feedback

### Admin Dashboard

- Key statistics at a glance
  - Total Bookings
  - Pending Bookings
  - Approved Bookings
  - Completed Bookings
- Completion rate visualization
- Key performance metrics
- Recent bookings table
- Quick action cards

### Manage Bookings

- Search functionality (ID, Name, Phone, Vehicle)
- Filter by status (Pending, Approved, Completed)
- Status update dropdown menu
- Booking details table
- Bulk action capabilities
- Results counter

### Service Management

- Add new services form
- Edit existing services
- Delete services
- Service card management
- Icon selection for services
- Price and description management

---

## 🔐 Authentication

**Demo Admin Credentials:**

```
Email: admin@vehiclecare.com
Password: admin123
```

Admin routes are protected and redirect to login if not authenticated.

---

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- Responsive navigation with mobile menu
- Touch-friendly button sizes
- Adaptive grid layouts
- Optimized for all screen sizes

---

## 🛠️ Tech Stack

### Frontend

- **React 18.2.0** - UI library
- **React Router 6.20.0** - Client-side routing
- **Tailwind CSS 3.4.0** - Utility-first styling
- **Lucide React 0.293.0** - Icon library

### Build Tools

- **Vite 5.0.0** - Build tool and dev server
- **PostCSS 8.4.31** - CSS processing
- **Autoprefixer 10.4.16** - CSS vendor prefixes

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn installed

### Installation

1. **Clone the repository**

   ```bash
   cd Vehicle-Service-Booking-System
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📋 Pages Overview

| Page            | Route              | Type      | Description                         |
| --------------- | ------------------ | --------- | ----------------------------------- |
| Home            | `/`                | Public    | Landing page with services overview |
| Services        | `/services`        | Public    | Complete service catalog            |
| Book Service    | `/book`            | Public    | Service booking form                |
| Confirmation    | `/confirmation`    | Public    | Booking confirmation                |
| Track Booking   | `/track`           | Public    | Status tracking                     |
| Admin Login     | `/admin/login`     | Public    | Admin authentication                |
| Dashboard       | `/admin/dashboard` | Protected | Admin overview                      |
| Manage Bookings | `/admin/bookings`  | Protected | Booking management                  |
| Services        | `/admin/services`  | Protected | Service management                  |

---

## 🎯 Key Features

✅ **Fully Responsive** - Works on mobile, tablet, and desktop
✅ **Professional Design** - Clean, modern aesthetic
✅ **Form Validation** - Real-time input validation
✅ **Status Tracking** - Track bookings in real-time
✅ **Admin Management** - Complete admin dashboard
✅ **Service Management** - Add/edit/delete services
✅ **Smooth Animations** - Professional transitions and effects
✅ **Mobile Navigation** - Responsive menu
✅ **Context API** - State management
✅ **Icons** - Lucide React icons throughout

---

## 🔄 State Management

Uses React Context API for:

- **AuthContext** - Admin authentication state
- **BookingContext** - All booking and service data

---

## 📊 Demo Data

The app includes 3 sample bookings for demonstration:

- BK001 - Pending status
- BK002 - Approved status
- BK003 - Completed status

---

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* ... */ },
      automotive: { /* ... */ }
    }
  }
}
```

### Fonts

Update Google Fonts in `index.html` and `tailwind.config.js`

### Components

All components are reusable and can be customized in the `src/components` directory

---

## ⚡ Performance

- Optimized bundle size (~100KB gzipped)
- Lazy loading for routes
- CSS-in-JS optimization
- No external API calls (demo mode)
- Fast development with Vite HMR

---

## 📝 Notes

- This is a **frontend-only** application with mock data
- Services will reset on page refresh (no persistence)
- For production, integrate with a real backend API
- Authentication is simulated with local state
- All data is stored in React Context (non-persistent)

---

## 🔗 Navigation

**Customer Flow:**
Home → Services → Book Service → Confirmation → Track Booking

**Admin Flow:**
Login → Dashboard → Manage Bookings/Services

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 👨‍💻 Development

### Code Style

- ES6+ syntax
- Functional components with hooks
- Clear component separation
- Semantic HTML

### Best Practices

- Reusable components
- Props validation
- Error handling
- Responsive design patterns
- Accessibility considerations

---

## 🚀 Future Enhancements

- Backend API integration
- Payment gateway
- Email notifications
- SMS confirmations
- User authentication
- Profile management
- Rating and reviews
- Business analytics
- Multi-language support
- Dark mode

---

## 📄 License

This project is part of an internship project at Fuchsius Company.

---

## 👥 Support

For questions or issues, please contact your project mentor or team lead.

---

## ✨ Credits

**Tech Stack**: React, Vite, Tailwind CSS, Lucide Icons

**Design**: Professional automotive service booking system UI/UX

**Purpose**: Internship learning project demonstrating real-world web application development

---

**Version**: 1.0.0  
**Last Updated**: February 2026
