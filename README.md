# Project Tracking System - Enterprise Grade

A full-stack enterprise-grade project tracking and visualization system built with Python FastAPI, React, and MySQL.

## 🚀 Features

### ✅ Implemented (Backend)
- FastAPI backend with async SQLAlchemy
- MySQL 8.0 database with comprehensive schema
- JWT authentication with refresh tokens
- RESTful API for all CRUD operations
- User roles (admin, editor, viewer)
- Project management with history/audit trail
- Comments system with threading
- File upload/attachment system
- Tag management
- Notifications system
- Reports generation
- Analytics and statistics
- Bulk actions

### ✅ Implemented (Frontend - In Progress)
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- React Query for data fetching
- React Router for navigation
- Dark mode support
- Responsive design

### 🚧 To Implement
- WebSocket for real-time updates
- Map with Leaflet.markercluster
- Interactive charts with Recharts
- Custom report builder
- PDF export functionality
- Email notifications
- Activity feed
- Heat map visualization
- Trend analysis
- Progress tracking
- Advanced filters

## 📁 Project Structure

```
mays/
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── api/endpoints/   # API route handlers
│   │   ├── core/           # Security, config
│   │   ├── db/             # Database session
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── crud/            # Database operations
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utilities
│   ├── tests/                # Test suite
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend container
│   └── .env.example         # Environment variables template
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/        # API client
│   │   ├── store/           # Zustand store
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   └── main.tsx        # Entry point
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts       # Vite config
│   ├── tailwind.config.js    # Tailwind config
│   └── Dockerfile            # Frontend container
├── scripts/
│   └── init.sql             # Database initialization
├── uploads/                     # File storage
│   ├── avatars/
│   ├── documents/
│   └── photos/
├── docker-compose.yml           # Multi-container setup
├── .gitignore
└── README.md
```

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts with roles
- **projects** - Main project data
- **project_history** - Audit trail for changes
- **comments** - Project discussions
- **attachments** - File uploads
- **tags** - Project categorization
- **project_tags** - Many-to-many relationship
- **notifications** - User notifications
- **saved_filters** - Custom filter presets
- **saved_reports** - Report configurations
- **activity_log** - Global activity feed
- **sessions** - JWT refresh tokens

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd mays

# Copy environment file
cp backend/.env.example backend/.env

# Start all services
docker-compose up -d

# Access services
# Backend API: http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/api/docs
```

### Option 2: Manual Setup

#### Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your settings

# Initialize database
mysql -u root -p < ../scripts/init.sql

# Run migrations (when using Alembic)
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env

# Start development server
npm run dev
```

## 📝 Configuration

### Backend Environment Variables (.env)

```env
# Application
SECRET_KEY=your-secret-key-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/project_tracker

# Redis
REDIS_URL=redis://localhost:6379/0

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 🔒 Default Credentials

**Admin User:**
- Username: `admin`
- Email: `admin@projecttracker.local`
- Password: `admin123`

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🏗️ Deployment

### Production Deployment

1. Update environment variables with production values
2. Change `SECRET_KEY` to a strong random value
3. Set up SSL certificates (Let's Encrypt recommended)
4. Configure nginx reverse proxy
5. Run with `--profile production`:
   ```bash
   docker-compose --profile production up -d
   ```

### Cloud Deployment Options

- **AWS:** EC2 + RDS + S3
- **DigitalOcean:** Droplets + Managed Databases + Spaces
- **Render:** Full-stack deployment
- **Railway:** Simple container deployment

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/token/refresh` - Refresh access token

### Projects
- `GET /api/v1/projects` - List projects (with filters)
- `GET /api/v1/projects/{id}` - Get project by ID
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project
- `POST /api/v1/projects/bulk` - Bulk actions
- `GET /api/v1/projects/map/all` - Get all for map
- `GET /api/v1/projects/stats/overview` - Get statistics

### Comments
- `GET /api/v1/comments/project/{project_id}` - Get project comments
- `POST /api/v1/comments` - Create comment
- `PUT /api/v1/comments/{id}` - Update comment
- `DELETE /api/v1/comments/{id}` - Delete comment

### Attachments
- `GET /api/v1/attachments/project/{project_id}` - Get project files
- `POST /api/v1/attachments/upload` - Upload file
- `DELETE /api/v1/attachments/{id}` - Delete file

### Tags
- `GET /api/v1/tags` - List all tags
- `POST /api/v1/tags` - Create tag
- `PUT /api/v1/tags/{id}` - Update tag
- `DELETE /api/v1/tags/{id}` - Delete tag

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/{id}` - Mark as read
- `POST /api/v1/notifications/mark-all-read` - Mark all as read
- `DELETE /api/v1/notifications/{id}` - Delete notification
- `GET /api/v1/notifications/unread/count` - Get unread count

### Reports
- `GET /api/v1/reports/summary` - Summary report
- `GET /api/v1/reports/province/{province}` - Province report
- `GET /api/v1/reports/timeline` - Timeline report
- `GET /api/v1/reports/status` - Status report
- `GET /api/v1/reports/export/pdf` - Export PDF
- `GET /api/v1/reports/saved` - Get saved reports

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard stats
- `GET /api/v1/analytics/heatmap` - Heat map data
- `GET /api/v1/analytics/trends` - Trend analysis
- `GET /api/v1/analytics/activity-feed` - Activity feed
- `GET /api/v1/analytics/province-performance` - Province metrics
- `GET /api/v1/analytics/completion-rate` - Completion rate

## 🔧 Development

### Backend

```bash
# Run with hot reload
uvicorn app.main:app --reload

# Format code
black app/
# Lint
flake8 app/
# Type check
mypy app/
```

### Frontend

```bash
# Run dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## 📦 Technology Stack

### Backend
- **Framework:** FastAPI 0.104
- **Language:** Python 3.11
- **Database:** MySQL 8.0 with aiomysql
- **ORM:** SQLAlchemy 2.0 (async)
- **Authentication:** JWT (python-jose)
- **Password:** bcrypt (passlib)
- **Email:** aiosmtplib
- **Caching:** Redis
- **WebSocket:** websockets

### Frontend
- **Framework:** React 18
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.3
- **State:** Zustand 4.4
- **Data Fetching:** TanStack Query 5.12
- **Routing:** React Router 6.20
- **Maps:** Leaflet + Leaflet.markercluster
- **Charts:** Recharts 2.10
- **PDF:** ReportLab / WeasyPrint
- **Forms:** React Hook Form 7.48
- **UI Components:** Radix UI + Headless UI
- **Notifications:** React Hot Toast
- **Icons:** Lucide React
- **Build:** Vite 5.0

### Infrastructure
- **Containers:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **SSL:** Let's Encrypt

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 👥 Support

For issues, questions, or support:
- Email: support@example.com
- Documentation: [Link to docs]
- Issue Tracker: [Link to issues]

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Backend API
- ✅ Database schema
- ✅ Authentication system
- 🚧 Basic frontend structure
- 🚧 Core components

### Phase 2 (Next)
- ⏳ Complete all UI components
- ⏳ Map integration with clustering
- ⏳ Charts and analytics
- ⏳ Real-time updates (WebSocket)
- ⏳ Email notifications

### Phase 3 (Future)
- ⏳ Mobile app (React Native)
- ⏳ Advanced AI analytics
- ⏳ Data export in multiple formats
- ⏳ Integration with external systems

---

**Built with ❤️ using FastAPI, React, and Tailwind CSS**
