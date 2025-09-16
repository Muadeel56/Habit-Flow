# Habit Flow 🎯

A modern, intuitive habit tracking application built with Vue 3, TypeScript, and Supabase. Track your daily habits, visualize your progress, and achieve your goals with beautiful analytics and achievement systems.

![Habit Flow](https://img.shields.io/badge/Version-1.0.0-blue)
![Vue](https://img.shields.io/badge/Vue-3.5.18-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.57.4-3ECF8E?logo=supabase)

## ✨ Features

### 🎯 Core Functionality
- **Habit Management**: Create, edit, and delete habits with custom categories
- **Progress Tracking**: Mark habits as complete with streak tracking
- **Analytics Dashboard**: Visualize your progress with charts and statistics
- **Achievement System**: Unlock badges and milestones as you build habits
- **Notifications**: Smart reminders to keep you on track

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with dark/light theme support
- **Real-time Updates**: Instant synchronization across devices
- **Mobile-First**: Optimized for all screen sizes
- **Accessibility**: WCAG compliant with keyboard navigation

### 🔧 Technical Features
- **Type Safety**: Full TypeScript implementation
- **State Management**: Pinia for reactive state management
- **Testing**: Comprehensive test suite with Vitest and Cypress
- **Performance**: Optimized builds with Vite
- **PWA Ready**: Service worker for offline functionality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Muadeel56/Habit-Flow.git
   cd Habit-Flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the SQL scripts in the `database/` folder in order:
     ```sql
     -- Run these in your Supabase SQL editor
     database/profiles_schema.sql
     database/habits_schema.sql
     database/habit_completions_schema.sql
     database/achievements_schema.sql
     database/notification_preferences_migration.sql
     ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Clean, organized dashboard showing your daily habits and progress*

### Habit Management
![Habits](docs/screenshots/habits.png)
*Intuitive habit creation and management interface*

### Analytics
![Analytics](docs/screenshots/analytics.png)
*Comprehensive analytics with charts and progress tracking*

### Achievements
![Achievements](docs/screenshots/achievements.png)
*Gamified achievement system to keep you motivated*

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - Vue state management
- **Vue Router** - Official router for Vue.js
- **Chart.js** - Beautiful, responsive charts

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Secure data access

### Development & Testing
- **Vitest** - Fast unit testing
- **Cypress** - End-to-end testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

## 📁 Project Structure

```
Habit-Flow/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── achievements/    # Achievement-related components
│   │   ├── analytics/       # Analytics and charts
│   │   ├── habits/          # Habit management components
│   │   ├── layout/          # Layout components
│   │   ├── notifications/   # Notification components
│   │   └── theme/           # Theme and UI components
│   ├── views/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── Dashboard.vue    # Main dashboard
│   │   ├── Habits.vue       # Habit management page
│   │   └── Profile.vue      # User profile page
│   ├── store/               # Pinia stores
│   ├── router/              # Vue Router configuration
│   └── lib/                 # Utility libraries
├── database/                # Database schema and migrations
├── cypress/                 # E2E tests
└── docs/                    # Documentation
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run cypress:open
```

### Coverage Report
```bash
npm run test:coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build:production
```

### Deploy to Cloudflare Pages
1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Add environment variables in Cloudflare dashboard

## 📚 API Documentation

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Sign in user
- `POST /auth/signout` - Sign out user

### Habits
- `GET /habits` - Get user habits
- `POST /habits` - Create new habit
- `PUT /habits/:id` - Update habit
- `DELETE /habits/:id` - Delete habit

### Completions
- `POST /completions` - Mark habit as complete
- `DELETE /completions/:id` - Remove completion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the utility-first approach
- All contributors and testers

## 📞 Support

- 📧 Email: support@habitflow.app
- 🐛 Issues: [GitHub Issues](https://github.com/Muadeel56/Habit-Flow/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Muadeel56/Habit-Flow/discussions)

---

**Made with ❤️ by [Muadeel56](https://github.com/Muadeel56)**
