# TourPlanner Frontend

A modern, production-quality React application for AI-powered travel planning with beautiful animations and intuitive user experience.

## 🚀 Features

### Core Functionality

- **AI-Powered Trip Planning** - Generate personalized itineraries using OpenAI
- **Drag & Drop Itinerary Editor** - Reorder stops, edit durations, delete items
- **Group Planning Hub** - Real-time collaboration with friends and family
- **Saved Trips Dashboard** - Manage and organize all your travel plans
- **Weather Alerts** - Animated weather badge with travel disruption alerts

### UI/UX Features

- **Modern Design System** - Chakra UI with custom gradients and animations
- **Responsive Design** - Mobile-first approach with breakpoint optimization
- **Smooth Animations** - Framer Motion with easing and stagger effects
- **Interactive Components** - Hover effects, loading states, and micro-interactions
- **Accessibility** - WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and functional components
- **Chakra UI** - Component library with custom theme
- **Framer Motion** - Animation library for smooth transitions
- **React Router** - Client-side routing with nested routes
- **@dnd-kit** - Modern drag and drop functionality
- **React Icons** - Comprehensive icon library
- **Axios** - HTTP client for API communication

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Layout.js              # Main layout with navigation
│   └── ui/
│       ├── WeatherBadge.js        # Animated weather component
│       ├── SortableItineraryItem.js # Drag & drop itinerary item
│       └── LoadingSkeleton.js     # Loading states
├── pages/
│   ├── HomePage.js               # Landing page with hero section
│   ├── TripPlannerPage.js        # Trip planning form
│   ├── ItineraryViewPage.js      # Itinerary with drag & drop
│   ├── GroupPlanningPage.js      # Group collaboration hub
│   └── SavedTripsPage.js         # Trip dashboard
├── constants/
│   └── index.js                  # App constants and configuration
├── utils/
│   └── index.js                  # Utility functions
├── App.js                        # Main app component
└── index.js                      # App entry point
```

## 🎨 Design System

### Colors

- **Primary Gradient**: `#0ea5e9` to `#6366f1`
- **Typography**: Inter font family
- **Shadows**: Subtle elevation with hover effects
- **Borders**: Rounded corners (xl radius)

### Animations

- **Duration**: 0.3-0.6s for smooth transitions
- **Easing**: `easeOut` for natural motion
- **Stagger**: 0.1s delay between child animations
- **Hover**: Scale and elevation changes

### Components

- **Cards**: Elevated with hover animations
- **Buttons**: Gradient variants with micro-interactions
- **Forms**: Clean inputs with validation states
- **Navigation**: Sticky header with breadcrumbs

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open [http://localhost:3002](http://localhost:3002) in your browser

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_API_URL=http://localhost:8000
```

## 📱 Pages Overview

### 1. Home Page (`/`)

- **Hero Section**: Animated background with call-to-action
- **Features**: Three-column feature showcase
- **Popular Destinations**: Grid of destination cards
- **CTA Section**: Gradient background with action buttons

### 2. Trip Planner (`/planner`)

- **Multi-step Form**: Destination, dates, interests, budget
- **Interest Selection**: Checkbox group with categories
- **Progress Indicator**: Loading state with AI planning simulation
- **Validation**: Real-time form validation with error messages

### 3. Itinerary View (`/itinerary/:tripId`)

- **Drag & Drop**: Reorder stops with @dnd-kit
- **Editable Items**: Click to edit name, duration, description
- **Day Organization**: Grouped by travel days
- **Breadcrumb Navigation**: Clear page hierarchy

### 4. Group Planning (`/group/:tripId`)

- **Live Updates**: Real-time activity feed
- **Voting System**: Thumbs up/down on itinerary items
- **Comments**: Threaded discussions on each stop
- **Member Management**: Online status and avatars

### 5. Saved Trips (`/saved`)

- **Trip Cards**: Grid layout with trip information
- **Search & Filter**: Find trips by destination or status
- **Statistics**: Overview of trip counts and metrics
- **Quick Actions**: Edit, share, delete operations

## 🎯 Key Components

### WeatherBadge

- **Animated Icon**: Pulsing animation for alerts
- **Popover Details**: Expandable weather information
- **Alert States**: Normal, warning, and alert modes
- **Real-time Updates**: Mock weather data with timestamps

### SortableItineraryItem

- **Drag Handle**: Visual grip for reordering
- **Time Display**: Start time and duration
- **Category Badges**: Color-coded activity types
- **Action Menu**: Edit and delete options

### LoadingSkeleton

- **Multiple Types**: Itinerary, cards, and form skeletons
- **Staggered Animation**: Progressive loading appearance
- **Responsive**: Adapts to different screen sizes

## 🔧 Customization

### Theme Configuration

The app uses a custom Chakra UI theme defined in `App.js`:

```javascript
const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  colors: {
    brand: {
      /* custom color palette */
    },
    purple: {
      /* secondary colors */
    },
  },
  components: {
    Button: {
      /* custom button variants */
    },
    Card: {
      /* custom card styles */
    },
  },
});
```

### Animation Configuration

Framer Motion animations are configured with consistent timing:

```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations

- **Touch-friendly**: Larger tap targets
- **Simplified Navigation**: Collapsible mobile menu
- **Stacked Layouts**: Single column on small screens
- **Optimized Images**: Responsive image sizing

## 🚀 Performance

### Optimization Techniques

- **Code Splitting**: Route-based lazy loading
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists (future enhancement)
- **Image Optimization**: WebP format with fallbacks

### Bundle Analysis

```bash
npm run build
npm install -g serve
serve -s build
```

## 🧪 Testing

### Component Testing

```bash
npm test
```

### E2E Testing

```bash
npm run test:e2e
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chakra UI** for the component library
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **@dnd-kit** for modern drag and drop
- **Unsplash** for beautiful travel images
