# 4P_MySkills - Employee Skills Management System

**Version:** 1.0.0  
**Status:** Backend Complete ✅ | Frontend In Progress 🚧

---

## 📋 Project Overview

**4P_MySkills** is an AI-powered employee skills management and project assignment system that helps organizations:

- 📊 **Track employee skills** with self-rating and manager approval workflows
- 🤖 **AI-powered project analysis** using Google Gemini to break down projects into deliverables
- 🎯 **Smart employee recommendations** matching skills to project requirements
- 📈 **Analytics & progress tracking** for skill development over time
- 👥 **Manager-employee hierarchy** with role-based access control
- ⚡ **Automated assignment workflows** with manager approval

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  Employee Portal | Manager Dashboard | HR Management        │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (JWT Auth)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                │
│  Auth | Projects | Skills | Recommendations | Analytics     │
└────────┬─────────────────────────┬──────────────────────────┘
         │                         │ Google Gemini API
         ▼                         ▼
┌──────────────────┐      ┌────────────────────┐
│   PostgreSQL     │      │   Gemini LLM       │
│   (Prisma ORM)   │      │   (AI Analysis)    │
└──────────────────┘      └────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Google Gemini API Key

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run database migrations
npx prisma migrate deploy
npx prisma generate

# Start development server
npm run dev

# Server runs at http://localhost:4000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_URL=http://localhost:4000

# Start development server
npm run dev

# Frontend runs at http://localhost:5173
```

---

## 📚 Documentation

### For Developers
- **[Backend Documentation](./BACKEND_DOCUMENTATION.md)** - Complete backend architecture, API reference, database schema
- **[API Quick Reference](./API_QUICK_REFERENCE.md)** - Quick lookup for API endpoints and workflows
- **[Frontend Checklist](./FRONTEND_CHECKLIST.md)** - Step-by-step frontend implementation guide

### Quick Links
- [Database Schema](#database-schema)
- [Role-Based Access](#role-based-access)
- [Key Features](#key-features)
- [API Endpoints](#api-endpoints-summary)
- [Workflows](#business-workflows)

---

## 🗄️ Database Schema

### Core Entities

```
User (Auth)
  ├─ EmployeeProfile
  │    ├─ Department
  │    ├─ Manager (self-referential)
  │    ├─ EmployeeSkills (M:N with Skill)
  │    └─ EmployeeProjectAssignments
  │
Project
  ├─ Deliverables
  │    └─ DeliverableSkills (M:N with Skill)
  │
Skill
  ├─ EmployeeSkills
  ├─ DeliverableSkills
  └─ SkillProgressLog (audit trail)

AssignmentRequest (Workflow)
SkillProgressLog (Audit)
```

**See [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md#database-schema) for detailed schema**

---

## 🔐 Role-Based Access

| Role | Access Level | Capabilities |
|------|-------------|--------------|
| **EMPLOYEE** | Personal | Rate own skills, view own assignments |
| **MANAGER** | Team | Review team skill ratings, approve assignment requests |
| **HR** | Organization | Full project management, AI analysis, recommendations |
| **ADMIN** | System | Full system access |

---

## ✨ Key Features

### 1. 🤖 AI-Powered Project Analysis

**HR imports a project description → Gemini LLM analyzes → Auto-generates deliverables with required skills**

```
Example Input:
"Build an e-commerce platform with payment processing and user authentication"

AI Output:
✓ Payment Gateway Integration (Node.js, Stripe API, PostgreSQL)
✓ User Authentication System (JWT, bcrypt, Express.js)
✓ Product Catalog Module (React, REST API, Database Design)
```

**API:** `POST /api/projects/:id/analyze`

---

### 2. 🎯 Smart Employee Recommendations

**Single-click recommendations for all project deliverables**

The algorithm scores employees based on:
- **Skill match:** Does the employee have the required skills?
- **Skill ratings:** How proficient are they (1-10 scale)?
- **Weighted scoring:** Critical skills weighted higher

**Formula:**
```
Overall Score = Σ (Employee Rating × Skill Weight)
Match % = (Skills Matched / Total Required Skills) × 100
```

**API:** `GET /api/projects/:projectId/recommendations?topK=5`

**Result:** Top 5 employees per deliverable, ranked by score

---

### 3. 📊 Skill Rating Workflow

```
EMPLOYEE rates skill (1-10)
  ↓
Status: PENDING
  ↓
MANAGER reviews
  ├─ APPROVE → approvedRating = selfRating
  ├─ EDIT → approvedRating = manager's value
  └─ REJECT → Rating not approved
```

**All changes logged in `SkillProgressLog` for analytics**

---

### 4. 👔 Assignment Request Workflow

```
HR selects employee for deliverable
  ↓
Create Assignment Request (PENDING)
  ↓
Notify employee's MANAGER
  ↓
MANAGER reviews
  ├─ APPROVE → Create EmployeeProjectAssignment
  └─ REJECT → Request denied
```

---

### 5. 📈 Analytics & Progress Tracking

- **Employee Overview Dashboard**: Total skills, pending reviews, average ratings
- **Skill Progress Timeline**: Visual graph of rating changes over time
- **Change Audit Trail**: Who changed what, when, and why

---

## 🌐 API Endpoints Summary

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Projects (HR)
```
POST   /api/projects                    → Create project
GET    /api/projects                    → List all projects
POST   /api/projects/:id/analyze        → AI analysis ⚡
DELETE /api/projects/:id                → Delete project
```

### Deliverables (HR)
```
POST   /api/projects/:id/deliverables   → Create deliverable
GET    /api/projects/:id/deliverables   → Get project deliverables
PATCH  /api/deliverables/:id            → Update deliverable
DELETE /api/deliverables/:id            → Delete deliverable
```

### Recommendations (HR) ⭐
```
GET /api/projects/:projectId/recommendations?topK=5           → All deliverables
GET /api/deliverables/:id/recommendations?topK=10             → Single deliverable
GET /api/deliverables/:delId/employees/:empId/analysis        → Detailed analysis
```

### Skills
```
POST /api/skills                        → Create skill (HR)
GET  /api/skills                        → List all skills (All)
```

### Employee Skills
```
POST  /api/employee-skills              → Self-rate skill (EMPLOYEE)
PATCH /api/employee-skills/:id          → Update rating (EMPLOYEE)
GET   /api/employee-skills/my-ratings   → View my ratings (EMPLOYEE)
GET   /api/employee-skills/pending      → Pending reviews (MANAGER)
PATCH /api/employee-skills/:id/review   → Review rating (MANAGER)
```

### Assignments
```
POST  /api/deliverables/:id/request-assignment     → Request assignment (HR)
GET   /api/assignment-requests/pending              → Pending requests (MANAGER)
PATCH /api/assignment-requests/:id/review           → Approve/Reject (MANAGER)
```

### Analytics
```
GET /api/analytics/employees/overview                      → All employees (HR)
GET /api/analytics/employees/:id/skill-progress            → Skill progress (HR/MANAGER)
GET /api/analytics/employees/:empId/skills/:skillId/timeline  → Timeline (HR/MANAGER)
```

**See [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md) for full details**

---

## 🎨 Frontend Implementation

### Tech Stack Recommendation
- **React 18+** with TypeScript
- **Vite** (build tool)
- **React Router** (routing)
- **TanStack Query** (server state)
- **Zustand** (auth state)
- **Tailwind CSS / MUI / Ant Design** (UI)
- **Recharts** (analytics charts)

### Core Pages

#### Employee Portal
- 📝 My Skills (self-rating)
- 📋 My Assignments

#### Manager Dashboard
- ⏳ Pending Skill Reviews
- 📩 Assignment Requests

#### HR Management
- 📊 Projects
  - Create, view, delete projects
  - **AI Analysis** button
- 🎯 Deliverables
  - Manage deliverables & skills
- ⭐ **Recommendations** (KEY FEATURE)
  - Single-button project-wide recommendations
  - Employee cards with scores & skill breakdown
- 📈 Analytics
  - Employee overview
  - Skill progress charts

**See [FRONTEND_CHECKLIST.md](./FRONTEND_CHECKLIST.md) for detailed implementation guide**

---

## 🔄 Business Workflows

### Complete Project Assignment Flow

```
1. HR creates project
   POST /api/projects { name: "E-commerce Platform" }

2. HR analyzes project with AI
   POST /api/projects/:id/analyze { userPrompt: "payment, auth, catalog" }
   → Deliverables auto-created with skills

3. HR gets recommendations for all deliverables
   GET /api/projects/:id/recommendations?topK=5
   → Shows top 5 employees per deliverable

4. HR selects employee from recommendations
   POST /api/deliverables/:deliverableId/request-assignment { employeeId }
   → Assignment request created (PENDING)

5. Manager reviews assignment request
   GET /api/assignment-requests/pending
   PATCH /api/assignment-requests/:id/review { action: "APPROVE" }
   → EmployeeProjectAssignment created

6. Employee starts work on deliverable
```

### Skill Rating Flow

```
1. Employee rates their skill
   POST /api/employee-skills { skillId, selfRating: 7 }
   → Status: PENDING

2. Employee can update while pending
   PATCH /api/employee-skills/:id { selfRating: 8 }

3. Manager reviews
   GET /api/employee-skills/pending
   PATCH /api/employee-skills/:id/review
     { action: "APPROVE" | "EDIT" | "REJECT", approvedRating, reviewComment }

4. System logs change in SkillProgressLog
   → Used for analytics and timeline

5. Employee sees result
   GET /api/employee-skills/my-ratings
   → Status: APPROVED, approvedRating: 8
```

---

## 🔒 Security

- **JWT Authentication**: Token-based auth with role claims
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Middleware**: `requireRole()` guards endpoints
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **Environment Variables**: Sensitive data in `.env`

---

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Test authentication
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@example.com","password":"password123"}'

# Test AI analysis (with token)
curl -X POST http://localhost:4000/api/projects/{id}/analyze \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"userPrompt":"payment gateway and user authentication"}'

# Test recommendations
curl http://localhost:4000/api/projects/{id}/recommendations?topK=5 \
  -H "Authorization: Bearer {token}"
```

### Frontend Testing

1. **Login Flow**: Login → Dashboard redirect
2. **Skill Rating**: Add skill → Update → Manager review
3. **AI Analysis**: Create project → Analyze → View deliverables
4. **Recommendations**: Get recommendations → Request assignment
5. **Analytics**: View employee progress → Skill timeline

---

## 📦 Project Structure

```
4P_MySkills/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── analytics/
│   │   │   ├── assignments/
│   │   │   ├── auth/
│   │   │   ├── deliverable-skills/
│   │   │   ├── deliverables/
│   │   │   ├── departments/
│   │   │   ├── employee-skills/
│   │   │   ├── employees/
│   │   │   ├── llm/
│   │   │   ├── projects/
│   │   │   ├── recommendations/
│   │   │   └── skills/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # API client & services
│   │   ├── components/       # React components
│   │   ├── contexts/         # Auth context
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Route pages
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── BACKEND_DOCUMENTATION.md     # Complete backend docs
├── API_QUICK_REFERENCE.md       # API endpoints quick ref
├── FRONTEND_CHECKLIST.md        # Frontend implementation guide
└── README.md                    # This file
```

---

## 🛠️ Tech Stack Summary

### Backend
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.9+
- **Framework:** Express.js 5.2+
- **Database:** PostgreSQL 14+
- **ORM:** Prisma 7.3+
- **Auth:** JWT + bcrypt
- **AI:** Google Gemini (gemini-1.5-flash)

### Frontend
- **Framework:** React 18+
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **State:** TanStack Query + Zustand
- **UI:** Tailwind/MUI/Ant Design (choose one)
- **Charts:** Recharts/Chart.js

---

## 🚀 Deployment

### Backend Deployment

**Option 1: Railway / Render / Fly.io**
```bash
# Build
npm run build

# Start
npm start
```

**Environment Variables:**
```env
PORT=4000
JWT_SECRET=<production-secret>
DATABASE_URL=<postgres-url>
GEMINI_API_KEY=<gemini-key>
NODE_ENV=production
```

### Frontend Deployment

**Option 1: Vercel**
```bash
npm run build
# Deploy dist/ folder
```

**Option 2: Netlify**
```bash
npm run build
# Deploy dist/ folder
```

**Environment Variables:**
```env
VITE_API_URL=https://your-backend-url.com
```

---

## 📊 Sample Data

### Creating Test Data

```sql
-- Insert departments
INSERT INTO "Department" (id, name) VALUES
  ('dept-1', 'Engineering'),
  ('dept-2', 'Product'),
  ('dept-3', 'Design');

-- Insert skills
INSERT INTO "Skill" (id, name, description) VALUES
  ('skill-1', 'React.js', 'Frontend JavaScript library'),
  ('skill-2', 'Node.js', 'Backend JavaScript runtime'),
  ('skill-3', 'PostgreSQL', 'Relational database'),
  ('skill-4', 'TypeScript', 'Typed JavaScript');
```

### Using the API

```bash
# Register HR user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@example.com",
    "password": "password123",
    "fullname": "HR Manager",
    "departmentId": "dept-1",
    "role": "HR"
  }'
```

---

## 🐛 Troubleshooting

### Common Issues

**Database connection error**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run `npx prisma migrate deploy`

**JWT token invalid**
- Check `JWT_SECRET` is set
- Verify token in Authorization header: `Bearer <token>`

**LLM not working**
- Verify `GEMINI_API_KEY` is correct
- Check Gemini API quota
- Review `/api/projects/:id/analyze` error response

**CORS errors**
- Backend `app.ts` has `cors()` enabled
- Check frontend URL is allowed

---

## 📝 License

MIT License - See LICENSE file

---

## 👥 Contributors

- Backend Architecture & API Development
- Database Schema Design
- AI Integration (Google Gemini)
- Documentation

---

## 🎯 Next Steps

### For Backend Developers
- ✅ Backend is complete and ready
- Review [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)
- Test all API endpoints

### For Frontend Developers
- 📖 Read [FRONTEND_CHECKLIST.md](./FRONTEND_CHECKLIST.md)
- 🚀 Start with authentication module
- 🎨 Build role-based dashboards
- ⭐ Implement key feature: Recommendations page

### For LLMs/AI Assistants
- 📚 Parse [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md) for endpoint specs
- 🔍 Use [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md) for detailed workflows
- ✅ Follow [FRONTEND_CHECKLIST.md](./FRONTEND_CHECKLIST.md) for implementation tasks

---

## 📞 Support

For questions or issues:
- Check documentation files
- Review API error messages
- Test with curl/Postman
- Verify environment variables

---

**Built with ❤️ using TypeScript, React, Node.js, and AI**

**Happy Coding! 🚀**

```
4P_MySkills
├─ .kilo
│  └─ worktrees
│     └─ wind-agustinia
│        ├─ API_QUICK_REFERENCE.md
│        ├─ backend
│        │  ├─ dist
│        │  │  ├─ app.js
│        │  │  ├─ config
│        │  │  │  └─ env.js
│        │  │  ├─ middlewares
│        │  │  │  ├─ auth.middleware.js
│        │  │  │  └─ role.middleware.js
│        │  │  ├─ modules
│        │  │  │  ├─ analytics
│        │  │  │  │  ├─ analytics.controller.js
│        │  │  │  │  ├─ analytics.routes.js
│        │  │  │  │  └─ analytics.service.js
│        │  │  │  ├─ assessment-campaigns
│        │  │  │  │  ├─ assessment-campaign.controller.js
│        │  │  │  │  ├─ assessment-campaign.routes.js
│        │  │  │  │  └─ assessment-campaign.service.js
│        │  │  │  ├─ assignments
│        │  │  │  │  ├─ assignment.controller.js
│        │  │  │  │  ├─ assignment.routes.js
│        │  │  │  │  └─ assignment.service.js
│        │  │  │  ├─ auth
│        │  │  │  │  ├─ auth.controller.js
│        │  │  │  │  ├─ auth.routes.js
│        │  │  │  │  └─ auth.service.js
│        │  │  │  ├─ deliverable-skills
│        │  │  │  │  ├─ deliverable-skill.controller.js
│        │  │  │  │  ├─ deliverable-skill.routes.js
│        │  │  │  │  └─ deliverable-skill.service.js
│        │  │  │  ├─ deliverables
│        │  │  │  │  ├─ deliverable.controller.js
│        │  │  │  │  ├─ deliverable.routes.js
│        │  │  │  │  └─ deliverable.service.js
│        │  │  │  ├─ departments
│        │  │  │  │  ├─ department.controller.js
│        │  │  │  │  ├─ department.routes.js
│        │  │  │  │  └─ department.service.js
│        │  │  │  ├─ employee-ingest
│        │  │  │  │  ├─ employee-ingest.controller.js
│        │  │  │  │  ├─ employee-ingest.routes.js
│        │  │  │  │  ├─ employee-ingest.service.js
│        │  │  │  │  ├─ employee-ingest.types.js
│        │  │  │  │  └─ employee-ingest.validators.js
│        │  │  │  ├─ employee-skills
│        │  │  │  │  ├─ employee-skill.controller.js
│        │  │  │  │  ├─ employee-skill.routes.js
│        │  │  │  │  └─ employee-skill.service.js
│        │  │  │  ├─ employees
│        │  │  │  │  ├─ employee.controller.js
│        │  │  │  │  ├─ employee.routes.js
│        │  │  │  │  └─ employee.service.js
│        │  │  │  ├─ llm
│        │  │  │  │  └─ llm.service.js
│        │  │  │  ├─ manager-ingest
│        │  │  │  │  ├─ manager-ingest.controller.js
│        │  │  │  │  ├─ manager-ingest.routes.js
│        │  │  │  │  ├─ manager-ingest.service.js
│        │  │  │  │  ├─ manager-ingest.types.js
│        │  │  │  │  └─ manager-ingest.validators.js
│        │  │  │  ├─ projects
│        │  │  │  │  ├─ project.controller.js
│        │  │  │  │  ├─ project.routes.js
│        │  │  │  │  └─ project.service.js
│        │  │  │  ├─ recommendations
│        │  │  │  │  ├─ recommendation.controller.js
│        │  │  │  │  ├─ recommendation.routes.js
│        │  │  │  │  └─ recommendation.service.js
│        │  │  │  ├─ skills
│        │  │  │  │  ├─ skill.controller.js
│        │  │  │  │  ├─ skill.routes.js
│        │  │  │  │  └─ skill.service.js
│        │  │  │  ├─ skills-ingest
│        │  │  │  │  ├─ skills-ingest.controller.js
│        │  │  │  │  ├─ skills-ingest.routes.js
│        │  │  │  │  ├─ skills-ingest.service.js
│        │  │  │  │  ├─ skills-ingest.types.js
│        │  │  │  │  └─ skills-ingest.validators.js
│        │  │  │  └─ tasks
│        │  │  │     ├─ tasks.controller.js
│        │  │  │     ├─ tasks.routes.js
│        │  │  │     ├─ tasks.service.js
│        │  │  │     └─ tasks.types.js
│        │  │  ├─ routes
│        │  │  │  └─ index.js
│        │  │  ├─ server.js
│        │  │  └─ utils
│        │  │     └─ db.js
│        │  ├─ package-lock.json
│        │  ├─ package.json
│        │  ├─ prisma
│        │  │  ├─ schema.prisma
│        │  │  ├─ seed.ts
│        │  │  └─ truncate_all.sql
│        │  ├─ prisma.config.ts
│        │  ├─ src
│        │  │  ├─ app.ts
│        │  │  ├─ config
│        │  │  │  └─ env.ts
│        │  │  ├─ middlewares
│        │  │  │  ├─ auth.middleware.ts
│        │  │  │  └─ role.middleware.ts
│        │  │  ├─ modules
│        │  │  │  ├─ analytics
│        │  │  │  │  ├─ analytics.controller.ts
│        │  │  │  │  ├─ analytics.routes.ts
│        │  │  │  │  └─ analytics.service.ts
│        │  │  │  ├─ assessment-campaigns
│        │  │  │  │  ├─ assessment-campaign.controller.ts
│        │  │  │  │  ├─ assessment-campaign.routes.ts
│        │  │  │  │  └─ assessment-campaign.service.ts
│        │  │  │  ├─ assignments
│        │  │  │  │  ├─ assignment.controller.ts
│        │  │  │  │  ├─ assignment.routes.ts
│        │  │  │  │  └─ assignment.service.ts
│        │  │  │  ├─ auth
│        │  │  │  │  ├─ auth.controller.ts
│        │  │  │  │  ├─ auth.routes.ts
│        │  │  │  │  └─ auth.service.ts
│        │  │  │  ├─ deliverable-skills
│        │  │  │  │  ├─ deliverable-skill.controller.ts
│        │  │  │  │  ├─ deliverable-skill.routes.ts
│        │  │  │  │  └─ deliverable-skill.service.ts
│        │  │  │  ├─ deliverables
│        │  │  │  │  ├─ deliverable.controller.ts
│        │  │  │  │  ├─ deliverable.routes.ts
│        │  │  │  │  └─ deliverable.service.ts
│        │  │  │  ├─ departments
│        │  │  │  │  ├─ department.controller.ts
│        │  │  │  │  ├─ department.routes.ts
│        │  │  │  │  └─ department.service.ts
│        │  │  │  ├─ employee-ingest
│        │  │  │  │  ├─ employee-ingest.controller.ts
│        │  │  │  │  ├─ employee-ingest.routes.ts
│        │  │  │  │  ├─ employee-ingest.service.ts
│        │  │  │  │  ├─ employee-ingest.types.ts
│        │  │  │  │  └─ employee-ingest.validators.ts
│        │  │  │  ├─ employee-skills
│        │  │  │  │  ├─ employee-skill.controller.ts
│        │  │  │  │  ├─ employee-skill.routes.ts
│        │  │  │  │  └─ employee-skill.service.ts
│        │  │  │  ├─ employees
│        │  │  │  │  ├─ employee.controller.ts
│        │  │  │  │  ├─ employee.routes.ts
│        │  │  │  │  └─ employee.service.ts
│        │  │  │  ├─ llm
│        │  │  │  │  └─ llm.service.ts
│        │  │  │  ├─ manager-ingest
│        │  │  │  │  ├─ manager-ingest.controller.ts
│        │  │  │  │  ├─ manager-ingest.routes.ts
│        │  │  │  │  ├─ manager-ingest.service.ts
│        │  │  │  │  ├─ manager-ingest.types.ts
│        │  │  │  │  └─ manager-ingest.validators.ts
│        │  │  │  ├─ projects
│        │  │  │  │  ├─ project.controller.ts
│        │  │  │  │  ├─ project.routes.ts
│        │  │  │  │  └─ project.service.ts
│        │  │  │  ├─ recommendations
│        │  │  │  │  ├─ recommendation.controller.ts
│        │  │  │  │  ├─ recommendation.routes.ts
│        │  │  │  │  └─ recommendation.service.ts
│        │  │  │  ├─ skills
│        │  │  │  │  ├─ skill.controller.ts
│        │  │  │  │  ├─ skill.routes.ts
│        │  │  │  │  └─ skill.service.ts
│        │  │  │  ├─ skills-ingest
│        │  │  │  │  ├─ skills-ingest.controller.ts
│        │  │  │  │  ├─ skills-ingest.routes.ts
│        │  │  │  │  ├─ skills-ingest.service.ts
│        │  │  │  │  ├─ skills-ingest.types.ts
│        │  │  │  │  └─ skills-ingest.validators.ts
│        │  │  │  └─ tasks
│        │  │  │     ├─ tasks.controller.ts
│        │  │  │     ├─ tasks.routes.ts
│        │  │  │     ├─ tasks.service.ts
│        │  │  │     └─ tasks.types.ts
│        │  │  ├─ routes
│        │  │  │  └─ index.ts
│        │  │  ├─ server.ts
│        │  │  └─ utils
│        │  │     └─ db.ts
│        │  └─ tsconfig.json
│        ├─ BACKEND_DOCUMENTATION.md
│        ├─ data
│        │  ├─ employees.csv
│        │  ├─ managers.csv
│        │  └─ skills.csv
│        ├─ frontend
│        │  ├─ components.json
│        │  ├─ next.config.ts
│        │  ├─ package-lock.json
│        │  ├─ package.json
│        │  ├─ postcss.config.mjs
│        │  ├─ public
│        │  │  ├─ file.svg
│        │  │  ├─ globe.svg
│        │  │  ├─ next.svg
│        │  │  ├─ vercel.svg
│        │  │  └─ window.svg
│        │  ├─ README.md
│        │  ├─ src
│        │  │  ├─ api
│        │  │  │  ├─ admin.api.ts
│        │  │  │  ├─ analytics.api.ts
│        │  │  │  ├─ auth.api.ts
│        │  │  │  ├─ campaigns.api.ts
│        │  │  │  ├─ deliverables.api.ts
│        │  │  │  ├─ employee.api.ts
│        │  │  │  ├─ manager.api.ts
│        │  │  │  ├─ managers.api.ts
│        │  │  │  ├─ projects.api.ts
│        │  │  │  ├─ recommendations.api.ts
│        │  │  │  └─ skills.api.ts
│        │  │  ├─ app
│        │  │  │  ├─ (auth)
│        │  │  │  │  ├─ layout.tsx
│        │  │  │  │  ├─ login
│        │  │  │  │  │  └─ page.tsx
│        │  │  │  │  └─ signup
│        │  │  │  │     └─ page.tsx
│        │  │  │  ├─ (dashboard)
│        │  │  │  │  ├─ admin
│        │  │  │  │  │  ├─ departments
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  └─ users
│        │  │  │  │  │     └─ page.tsx
│        │  │  │  │  ├─ employee
│        │  │  │  │  │  ├─ assignments
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  ├─ skill-request
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  └─ skills
│        │  │  │  │  │     └─ page.tsx
│        │  │  │  │  ├─ hr
│        │  │  │  │  │  ├─ analytics
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ campaigns
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ employees
│        │  │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  │  └─ [id]
│        │  │  │  │  │  │     └─ page.tsx
│        │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  ├─ projects
│        │  │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  │  └─ [id]
│        │  │  │  │  │  │     ├─ page.tsx
│        │  │  │  │  │  │     └─ recommendations
│        │  │  │  │  │  │        └─ page.tsx
│        │  │  │  │  │  └─ skills
│        │  │  │  │  │     └─ page.tsx
│        │  │  │  │  ├─ layout.tsx
│        │  │  │  │  ├─ manager
│        │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  ├─ requests
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ reviews
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  └─ team
│        │  │  │  │  │     └─ page.tsx
│        │  │  │  │  └─ page.tsx
│        │  │  │  ├─ favicon.ico
│        │  │  │  ├─ globals.css
│        │  │  │  ├─ layout.tsx
│        │  │  │  └─ page.tsx
│        │  │  ├─ components
│        │  │  │  ├─ admin
│        │  │  │  │  ├─ add-employee-modal.tsx
│        │  │  │  │  ├─ assign-manager-modal.tsx
│        │  │  │  │  └─ change-role-modal.tsx
│        │  │  │  ├─ auth
│        │  │  │  │  ├─ role-guard.tsx
│        │  │  │  │  └─ route-guard.tsx
│        │  │  │  ├─ hr
│        │  │  │  │  ├─ manage-skills-modal.tsx
│        │  │  │  │  └─ recommendations-modal.tsx
│        │  │  │  ├─ layout
│        │  │  │  │  ├─ header.tsx
│        │  │  │  │  └─ sidebar.tsx
│        │  │  │  ├─ providers
│        │  │  │  │  └─ query-provider.tsx
│        │  │  │  └─ ui
│        │  │  │     ├─ button.tsx
│        │  │  │     ├─ input.tsx
│        │  │  │     ├─ label.tsx
│        │  │  │     ├─ menubar.tsx
│        │  │  │     ├─ navigation-menu.tsx
│        │  │  │     ├─ pagination.tsx
│        │  │  │     ├─ popover.tsx
│        │  │  │     ├─ progress.tsx
│        │  │  │     ├─ radio-group.tsx
│        │  │  │     ├─ resizable.tsx
│        │  │  │     ├─ scroll-area.tsx
│        │  │  │     ├─ select.tsx
│        │  │  │     ├─ separator.tsx
│        │  │  │     ├─ sheet.tsx
│        │  │  │     ├─ skeleton.tsx
│        │  │  │     ├─ slider.tsx
│        │  │  │     ├─ sonner.tsx
│        │  │  │     ├─ switch.tsx
│        │  │  │     ├─ table.tsx
│        │  │  │     ├─ tabs.tsx
│        │  │  │     ├─ textarea.tsx
│        │  │  │     ├─ toggle-group.tsx
│        │  │  │     ├─ toggle.tsx
│        │  │  │     └─ tooltip.tsx
│        │  │  ├─ lib
│        │  │  │  ├─ api-client.ts
│        │  │  │  └─ utils.ts
│        │  │  ├─ store
│        │  │  │  └─ authStore.ts
│        │  │  └─ types
│        │  │     └─ index.ts
│        │  └─ tsconfig.json
│        ├─ FRONTEND_CHECKLIST.md
│        └─ README.md
├─ API_QUICK_REFERENCE.md
├─ backend
│  ├─ .env
│  ├─ data
│  │  ├─ employees.csv
│  │  ├─ managers.csv
│  │  └─ skills.csv
│  ├─ dist
│  │  ├─ app.js
│  │  ├─ config
│  │  │  └─ env.js
│  │  ├─ middlewares
│  │  │  ├─ auth.middleware.js
│  │  │  └─ role.middleware.js
│  │  ├─ modules
│  │  │  ├─ analytics
│  │  │  │  ├─ analytics.controller.js
│  │  │  │  ├─ analytics.routes.js
│  │  │  │  └─ analytics.service.js
│  │  │  ├─ assessment-campaigns
│  │  │  │  ├─ assessment-campaign.controller.js
│  │  │  │  ├─ assessment-campaign.routes.js
│  │  │  │  └─ assessment-campaign.service.js
│  │  │  ├─ assignments
│  │  │  │  ├─ assignment.controller.js
│  │  │  │  ├─ assignment.routes.js
│  │  │  │  └─ assignment.service.js
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.js
│  │  │  │  ├─ auth.routes.js
│  │  │  │  └─ auth.service.js
│  │  │  ├─ deliverable-skills
│  │  │  │  ├─ deliverable-skill.controller.js
│  │  │  │  ├─ deliverable-skill.routes.js
│  │  │  │  └─ deliverable-skill.service.js
│  │  │  ├─ deliverables
│  │  │  │  ├─ deliverable.controller.js
│  │  │  │  ├─ deliverable.routes.js
│  │  │  │  └─ deliverable.service.js
│  │  │  ├─ departments
│  │  │  │  ├─ department.controller.js
│  │  │  │  ├─ department.routes.js
│  │  │  │  └─ department.service.js
│  │  │  ├─ employee-ingest
│  │  │  │  ├─ employee-ingest.controller.js
│  │  │  │  ├─ employee-ingest.routes.js
│  │  │  │  ├─ employee-ingest.service.js
│  │  │  │  ├─ employee-ingest.types.js
│  │  │  │  └─ employee-ingest.validators.js
│  │  │  ├─ employee-skills
│  │  │  │  ├─ employee-skill.controller.js
│  │  │  │  ├─ employee-skill.routes.js
│  │  │  │  └─ employee-skill.service.js
│  │  │  ├─ employees
│  │  │  │  ├─ employee.controller.js
│  │  │  │  ├─ employee.routes.js
│  │  │  │  └─ employee.service.js
│  │  │  ├─ llm
│  │  │  │  └─ llm.service.js
│  │  │  ├─ manager-ingest
│  │  │  │  ├─ manager-ingest.controller.js
│  │  │  │  ├─ manager-ingest.routes.js
│  │  │  │  ├─ manager-ingest.service.js
│  │  │  │  ├─ manager-ingest.types.js
│  │  │  │  └─ manager-ingest.validators.js
│  │  │  ├─ projects
│  │  │  │  ├─ project.controller.js
│  │  │  │  ├─ project.routes.js
│  │  │  │  └─ project.service.js
│  │  │  ├─ recommendations
│  │  │  │  ├─ recommendation.controller.js
│  │  │  │  ├─ recommendation.routes.js
│  │  │  │  └─ recommendation.service.js
│  │  │  ├─ skills
│  │  │  │  ├─ skill.controller.js
│  │  │  │  ├─ skill.routes.js
│  │  │  │  └─ skill.service.js
│  │  │  ├─ skills-ingest
│  │  │  │  ├─ skills-ingest.controller.js
│  │  │  │  ├─ skills-ingest.routes.js
│  │  │  │  ├─ skills-ingest.service.js
│  │  │  │  ├─ skills-ingest.types.js
│  │  │  │  └─ skills-ingest.validators.js
│  │  │  └─ tasks
│  │  │     ├─ tasks.controller.js
│  │  │     ├─ tasks.routes.js
│  │  │     ├─ tasks.service.js
│  │  │     └─ tasks.types.js
│  │  ├─ routes
│  │  │  └─ index.js
│  │  ├─ server.js
│  │  └─ utils
│  │     └─ db.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  ├─ schema.prisma
│  │  ├─ seed.ts
│  │  └─ truncate_all.sql
│  ├─ prisma.config.ts
│  ├─ src
│  │  ├─ app.ts
│  │  ├─ config
│  │  │  └─ env.ts
│  │  ├─ middlewares
│  │  │  ├─ auth.middleware.ts
│  │  │  └─ role.middleware.ts
│  │  ├─ modules
│  │  │  ├─ allocation-engine
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ allocation-recommendations
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ allocation-runs
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ analytics
│  │  │  │  ├─ analytics.controller.ts
│  │  │  │  ├─ analytics.routes.ts
│  │  │  │  └─ analytics.service.ts
│  │  │  ├─ assessment-campaigns
│  │  │  │  ├─ assessment-campaign.controller.ts
│  │  │  │  ├─ assessment-campaign.routes.ts
│  │  │  │  └─ assessment-campaign.service.ts
│  │  │  ├─ assignments
│  │  │  │  ├─ assignment.controller.ts
│  │  │  │  ├─ assignment.routes.ts
│  │  │  │  └─ assignment.service.ts
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.routes.ts
│  │  │  │  └─ auth.service.ts
│  │  │  ├─ deliverable-skills
│  │  │  │  ├─ deliverable-skill.controller.ts
│  │  │  │  ├─ deliverable-skill.routes.ts
│  │  │  │  └─ deliverable-skill.service.ts
│  │  │  ├─ deliverables
│  │  │  │  ├─ deliverable.controller.ts
│  │  │  │  ├─ deliverable.routes.ts
│  │  │  │  └─ deliverable.service.ts
│  │  │  ├─ departments
│  │  │  │  ├─ department.controller.ts
│  │  │  │  ├─ department.routes.ts
│  │  │  │  └─ department.service.ts
│  │  │  ├─ employee-availability
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ employee-ingest
│  │  │  │  ├─ employee-ingest.controller.ts
│  │  │  │  ├─ employee-ingest.routes.ts
│  │  │  │  ├─ employee-ingest.service.ts
│  │  │  │  ├─ employee-ingest.types.ts
│  │  │  │  └─ employee-ingest.validators.ts
│  │  │  ├─ employee-skills
│  │  │  │  ├─ employee-skill.controller.ts
│  │  │  │  ├─ employee-skill.routes.ts
│  │  │  │  └─ employee-skill.service.ts
│  │  │  ├─ employee-workload
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ employees
│  │  │  │  ├─ employee.controller.ts
│  │  │  │  ├─ employee.routes.ts
│  │  │  │  └─ employee.service.ts
│  │  │  ├─ llm
│  │  │  │  └─ llm.service.ts
│  │  │  ├─ manager-ingest
│  │  │  │  ├─ manager-ingest.controller.ts
│  │  │  │  ├─ manager-ingest.routes.ts
│  │  │  │  ├─ manager-ingest.service.ts
│  │  │  │  ├─ manager-ingest.types.ts
│  │  │  │  └─ manager-ingest.validators.ts
│  │  │  ├─ projects
│  │  │  │  ├─ project.controller.ts
│  │  │  │  ├─ project.routes.ts
│  │  │  │  └─ project.service.ts
│  │  │  ├─ recommendations
│  │  │  │  ├─ recommendation.controller.ts
│  │  │  │  ├─ recommendation.routes.ts
│  │  │  │  └─ recommendation.service.ts
│  │  │  ├─ skills
│  │  │  │  ├─ skill.controller.ts
│  │  │  │  ├─ skill.routes.ts
│  │  │  │  └─ skill.service.ts
│  │  │  ├─ skills-ingest
│  │  │  │  ├─ skills-ingest.controller.ts
│  │  │  │  ├─ skills-ingest.routes.ts
│  │  │  │  ├─ skills-ingest.service.ts
│  │  │  │  ├─ skills-ingest.types.ts
│  │  │  │  └─ skills-ingest.validators.ts
│  │  │  ├─ task-dependencies
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ task-skill-requirements
│  │  │  │  ├─ contoller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  └─ tasks
│  │  │     ├─ tasks.controller.ts
│  │  │     ├─ tasks.routes.ts
│  │  │     ├─ tasks.service.ts
│  │  │     └─ tasks.types.ts
│  │  ├─ routes
│  │  │  └─ index.ts
│  │  ├─ server.ts
│  │  └─ utils
│  │     └─ db.ts
│  └─ tsconfig.json
├─ BACKEND_DOCUMENTATION.md
├─ frontend
│  ├─ .next
│  │  └─ dev
│  │     ├─ build
│  │     │  ├─ chunks
│  │     │  │  ├─ 29d1b_46bd99fa._.js
│  │     │  │  ├─ 29d1b_46bd99fa._.js.map
│  │     │  │  ├─ [root-of-the-server]__5c050acd._.js
│  │     │  │  ├─ [root-of-the-server]__5c050acd._.js.map
│  │     │  │  ├─ [root-of-the-server]__e9a9fb3c._.js
│  │     │  │  ├─ [root-of-the-server]__e9a9fb3c._.js.map
│  │     │  │  ├─ [turbopack-node]_transforms_postcss_ts_8ee76bdb._.js
│  │     │  │  ├─ [turbopack-node]_transforms_postcss_ts_8ee76bdb._.js.map
│  │     │  │  ├─ [turbopack]_runtime.js
│  │     │  │  └─ [turbopack]_runtime.js.map
│  │     │  ├─ package.json
│  │     │  ├─ postcss.js
│  │     │  └─ postcss.js.map
│  │     ├─ build-manifest.json
│  │     ├─ cache
│  │     │  ├─ .rscinfo
│  │     │  ├─ chrome-devtools-workspace-uuid
│  │     │  ├─ next-devtools-config.json
│  │     │  └─ turbopack
│  │     │     └─ 23c46498
│  │     │        ├─ 00000001.sst
│  │     │        ├─ 00000003.sst
│  │     │        ├─ 00000004.sst
│  │     │        ├─ 00000005.sst
│  │     │        ├─ 00000006.meta
│  │     │        ├─ 00000007.meta
│  │     │        ├─ 00000009.meta
│  │     │        ├─ 00000010.meta
│  │     │        ├─ 00000015.sst
│  │     │        ├─ 00000016.sst
│  │     │        ├─ 00000017.sst
│  │     │        ├─ 00000018.sst
│  │     │        ├─ 00000019.meta
│  │     │        ├─ 00000021.meta
│  │     │        ├─ 00000022.meta
│  │     │        ├─ 00000023.meta
│  │     │        ├─ 00000028.sst
│  │     │        ├─ 00000029.sst
│  │     │        ├─ 00000030.sst
│  │     │        ├─ 00000031.sst
│  │     │        ├─ 00000032.meta
│  │     │        ├─ 00000033.meta
│  │     │        ├─ 00000035.meta
│  │     │        ├─ 00000036.meta
│  │     │        ├─ 00000041.sst
│  │     │        ├─ 00000042.sst
│  │     │        ├─ 00000043.sst
│  │     │        ├─ 00000044.sst
│  │     │        ├─ 00000045.meta
│  │     │        ├─ 00000046.meta
│  │     │        ├─ 00000048.meta
│  │     │        ├─ 00000049.meta
│  │     │        ├─ 00000050.sst
│  │     │        ├─ 00000051.meta
│  │     │        ├─ 00000053.sst
│  │     │        ├─ 00000054.sst
│  │     │        ├─ 00000055.sst
│  │     │        ├─ 00000056.meta
│  │     │        ├─ 00000057.meta
│  │     │        ├─ 00000058.meta
│  │     │        ├─ 00000059.sst
│  │     │        ├─ 00000060.sst
│  │     │        ├─ 00000061.sst
│  │     │        ├─ 00000062.sst
│  │     │        ├─ 00000063.sst
│  │     │        ├─ 00000064.meta
│  │     │        ├─ 00000065.meta
│  │     │        ├─ 00000066.meta
│  │     │        ├─ 00000067.meta
│  │     │        ├─ 00000068.meta
│  │     │        ├─ 00000069.sst
│  │     │        ├─ 00000070.sst
│  │     │        ├─ 00000071.sst
│  │     │        ├─ 00000072.meta
│  │     │        ├─ 00000073.meta
│  │     │        ├─ 00000074.meta
│  │     │        ├─ 00000075.sst
│  │     │        ├─ 00000076.sst
│  │     │        ├─ 00000077.sst
│  │     │        ├─ 00000078.meta
│  │     │        ├─ 00000079.meta
│  │     │        ├─ 00000080.meta
│  │     │        ├─ 00000081.sst
│  │     │        ├─ 00000082.sst
│  │     │        ├─ 00000083.sst
│  │     │        ├─ 00000084.meta
│  │     │        ├─ 00000085.meta
│  │     │        ├─ 00000086.meta
│  │     │        ├─ 00000087.sst
│  │     │        ├─ 00000088.sst
│  │     │        ├─ 00000089.sst
│  │     │        ├─ 00000090.meta
│  │     │        ├─ 00000091.meta
│  │     │        ├─ 00000092.meta
│  │     │        ├─ CURRENT
│  │     │        └─ LOG
│  │     ├─ fallback-build-manifest.json
│  │     ├─ lock
│  │     ├─ logs
│  │     │  └─ next-development.log
│  │     ├─ package.json
│  │     ├─ prerender-manifest.json
│  │     ├─ routes-manifest.json
│  │     ├─ server
│  │     │  ├─ app
│  │     │  │  ├─ (auth)
│  │     │  │  │  └─ login
│  │     │  │  │     ├─ page
│  │     │  │  │     │  ├─ app-paths-manifest.json
│  │     │  │  │     │  ├─ build-manifest.json
│  │     │  │  │     │  ├─ next-font-manifest.json
│  │     │  │  │     │  ├─ react-loadable-manifest.json
│  │     │  │  │     │  └─ server-reference-manifest.json
│  │     │  │  │     ├─ page.js
│  │     │  │  │     ├─ page.js.map
│  │     │  │  │     └─ page_client-reference-manifest.js
│  │     │  │  ├─ (dashboard)
│  │     │  │  │  └─ admin
│  │     │  │  │     ├─ departments
│  │     │  │  │     │  ├─ page
│  │     │  │  │     │  │  ├─ app-paths-manifest.json
│  │     │  │  │     │  │  ├─ build-manifest.json
│  │     │  │  │     │  │  ├─ next-font-manifest.json
│  │     │  │  │     │  │  ├─ react-loadable-manifest.json
│  │     │  │  │     │  │  └─ server-reference-manifest.json
│  │     │  │  │     │  ├─ page.js
│  │     │  │  │     │  ├─ page.js.map
│  │     │  │  │     │  └─ page_client-reference-manifest.js
│  │     │  │  │     ├─ page
│  │     │  │  │     │  ├─ app-paths-manifest.json
│  │     │  │  │     │  ├─ build-manifest.json
│  │     │  │  │     │  ├─ next-font-manifest.json
│  │     │  │  │     │  ├─ react-loadable-manifest.json
│  │     │  │  │     │  └─ server-reference-manifest.json
│  │     │  │  │     ├─ page.js
│  │     │  │  │     ├─ page.js.map
│  │     │  │  │     ├─ page_client-reference-manifest.js
│  │     │  │  │     └─ users
│  │     │  │  │        ├─ page
│  │     │  │  │        │  ├─ app-paths-manifest.json
│  │     │  │  │        │  ├─ build-manifest.json
│  │     │  │  │        │  ├─ next-font-manifest.json
│  │     │  │  │        │  ├─ react-loadable-manifest.json
│  │     │  │  │        │  └─ server-reference-manifest.json
│  │     │  │  │        ├─ page.js
│  │     │  │  │        ├─ page.js.map
│  │     │  │  │        └─ page_client-reference-manifest.js
│  │     │  │  ├─ page
│  │     │  │  │  ├─ app-paths-manifest.json
│  │     │  │  │  ├─ build-manifest.json
│  │     │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  ├─ react-loadable-manifest.json
│  │     │  │  │  └─ server-reference-manifest.json
│  │     │  │  ├─ page.js
│  │     │  │  ├─ page.js.map
│  │     │  │  ├─ page_client-reference-manifest.js
│  │     │  │  └─ _not-found
│  │     │  │     ├─ page
│  │     │  │     │  ├─ app-paths-manifest.json
│  │     │  │     │  ├─ build-manifest.json
│  │     │  │     │  ├─ next-font-manifest.json
│  │     │  │     │  ├─ react-loadable-manifest.json
│  │     │  │     │  └─ server-reference-manifest.json
│  │     │  │     ├─ page.js
│  │     │  │     ├─ page.js.map
│  │     │  │     └─ page_client-reference-manifest.js
│  │     │  ├─ app-paths-manifest.json
│  │     │  ├─ chunks
│  │     │  │  └─ ssr
│  │     │  │     ├─ 29d1b_58d7c465._.js
│  │     │  │     ├─ 29d1b_58d7c465._.js.map
│  │     │  │     ├─ 29d1b_7d3fb9ea._.js
│  │     │  │     ├─ 29d1b_7d3fb9ea._.js.map
│  │     │  │     ├─ 29d1b_866f995f._.js
│  │     │  │     ├─ 29d1b_866f995f._.js.map
│  │     │  │     ├─ 29d1b_axios_lib_addf091b._.js
│  │     │  │     ├─ 29d1b_axios_lib_addf091b._.js.map
│  │     │  │     ├─ 29d1b_bd79e30d._.js
│  │     │  │     ├─ 29d1b_bd79e30d._.js.map
│  │     │  │     ├─ 29d1b_next_dist_2063018c._.js
│  │     │  │     ├─ 29d1b_next_dist_2063018c._.js.map
│  │     │  │     ├─ 29d1b_next_dist_21ef717c._.js
│  │     │  │     ├─ 29d1b_next_dist_21ef717c._.js.map
│  │     │  │     ├─ 29d1b_next_dist_718357c4._.js
│  │     │  │     ├─ 29d1b_next_dist_718357c4._.js.map
│  │     │  │     ├─ 29d1b_next_dist_8751d376._.js
│  │     │  │     ├─ 29d1b_next_dist_8751d376._.js.map
│  │     │  │     ├─ 29d1b_next_dist_a2a437b2._.js
│  │     │  │     ├─ 29d1b_next_dist_a2a437b2._.js.map
│  │     │  │     ├─ 29d1b_next_dist_b4fdc870._.js
│  │     │  │     ├─ 29d1b_next_dist_b4fdc870._.js.map
│  │     │  │     ├─ 29d1b_next_dist_c86a53b7._.js
│  │     │  │     ├─ 29d1b_next_dist_c86a53b7._.js.map
│  │     │  │     ├─ 29d1b_next_dist_client_components_a572bf76._.js
│  │     │  │     ├─ 29d1b_next_dist_client_components_a572bf76._.js.map
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_forbidden_d06e862d.js
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_forbidden_d06e862d.js.map
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_global-error_d96712a8.js
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_global-error_d96712a8.js.map
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_unauthorized_04a6456b.js
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_unauthorized_04a6456b.js.map
│  │     │  │     ├─ 29d1b_next_dist_e699fe23._.js
│  │     │  │     ├─ 29d1b_next_dist_e699fe23._.js.map
│  │     │  │     ├─ 29d1b_next_dist_f56a351d._.js
│  │     │  │     ├─ 29d1b_next_dist_f56a351d._.js.map
│  │     │  │     ├─ 29d1b_zod_v4_861115be._.js
│  │     │  │     ├─ 29d1b_zod_v4_861115be._.js.map
│  │     │  │     ├─ 5b9e3_frontend__next-internal_server_app_(dashboard)_admin_page_actions_e1482e83.js
│  │     │  │     ├─ 5b9e3_frontend__next-internal_server_app_(dashboard)_admin_page_actions_e1482e83.js.map
│  │     │  │     ├─ 6c7f9_4P_MySkills_frontend__next-internal_server_app__not-found_page_actions_9c82a581.js
│  │     │  │     ├─ 6c7f9_4P_MySkills_frontend__next-internal_server_app__not-found_page_actions_9c82a581.js.map
│  │     │  │     ├─ 8ab3f__next-internal_server_app_(dashboard)_admin_departments_page_actions_2191dae4.js
│  │     │  │     ├─ 8ab3f__next-internal_server_app_(dashboard)_admin_departments_page_actions_2191dae4.js.map
│  │     │  │     ├─ 8ab3f__next-internal_server_app_(dashboard)_admin_users_page_actions_f3628773.js
│  │     │  │     ├─ 8ab3f__next-internal_server_app_(dashboard)_admin_users_page_actions_f3628773.js.map
│  │     │  │     ├─ b02f8_MySkills_frontend__next-internal_server_app_(auth)_login_page_actions_f0b616a0.js
│  │     │  │     ├─ b02f8_MySkills_frontend__next-internal_server_app_(auth)_login_page_actions_f0b616a0.js.map
│  │     │  │     ├─ b5767_mime-db_f520c4f0._.js
│  │     │  │     ├─ b5767_mime-db_f520c4f0._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_ac2fb00e._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_ac2fb00e._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_244b8c78._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_244b8c78._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_(auth)_layout_tsx_a21f993a._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_(auth)_layout_tsx_a21f993a._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_layout_tsx_0ec74d1c._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_layout_tsx_0ec74d1c._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_8a3794bc._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_8a3794bc._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend__next-internal_server_app_page_actions_9bf17780.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend__next-internal_server_app_page_actions_9bf17780.js.map
│  │     │  │     ├─ [externals]_next_dist_1aaf5479._.js
│  │     │  │     ├─ [externals]_next_dist_1aaf5479._.js.map
│  │     │  │     ├─ [externals]_next_dist_c80f7c8f._.js
│  │     │  │     ├─ [externals]_next_dist_c80f7c8f._.js.map
│  │     │  │     ├─ [externals]__e8a2741f._.js
│  │     │  │     ├─ [externals]__e8a2741f._.js.map
│  │     │  │     ├─ [root-of-the-server]__079bca38._.js
│  │     │  │     ├─ [root-of-the-server]__079bca38._.js.map
│  │     │  │     ├─ [root-of-the-server]__314299d0._.js
│  │     │  │     ├─ [root-of-the-server]__314299d0._.js.map
│  │     │  │     ├─ [root-of-the-server]__3c81b3cf._.js
│  │     │  │     ├─ [root-of-the-server]__3c81b3cf._.js.map
│  │     │  │     ├─ [root-of-the-server]__5bf400fd._.js
│  │     │  │     ├─ [root-of-the-server]__5bf400fd._.js.map
│  │     │  │     ├─ [root-of-the-server]__64491fb1._.js
│  │     │  │     ├─ [root-of-the-server]__64491fb1._.js.map
│  │     │  │     ├─ [root-of-the-server]__66d6f7fd._.js
│  │     │  │     ├─ [root-of-the-server]__66d6f7fd._.js.map
│  │     │  │     ├─ [root-of-the-server]__67af8521._.js
│  │     │  │     ├─ [root-of-the-server]__67af8521._.js.map
│  │     │  │     ├─ [root-of-the-server]__a9e5b048._.js
│  │     │  │     ├─ [root-of-the-server]__a9e5b048._.js.map
│  │     │  │     ├─ [root-of-the-server]__be742ce7._.js
│  │     │  │     ├─ [root-of-the-server]__be742ce7._.js.map
│  │     │  │     ├─ [root-of-the-server]__bfdb1038._.js
│  │     │  │     ├─ [root-of-the-server]__bfdb1038._.js.map
│  │     │  │     ├─ [root-of-the-server]__d325d995._.js
│  │     │  │     ├─ [root-of-the-server]__d325d995._.js.map
│  │     │  │     ├─ [root-of-the-server]__edccf7bc._.js
│  │     │  │     ├─ [root-of-the-server]__edccf7bc._.js.map
│  │     │  │     ├─ [turbopack]_runtime.js
│  │     │  │     ├─ [turbopack]_runtime.js.map
│  │     │  │     ├─ _394790ad._.js
│  │     │  │     ├─ _394790ad._.js.map
│  │     │  │     ├─ _8fa862f1._.js
│  │     │  │     ├─ _8fa862f1._.js.map
│  │     │  │     ├─ _e81dcc71._.js
│  │     │  │     └─ _e81dcc71._.js.map
│  │     │  ├─ interception-route-rewrite-manifest.js
│  │     │  ├─ middleware-build-manifest.js
│  │     │  ├─ middleware-manifest.json
│  │     │  ├─ next-font-manifest.js
│  │     │  ├─ next-font-manifest.json
│  │     │  ├─ pages-manifest.json
│  │     │  ├─ server-reference-manifest.js
│  │     │  └─ server-reference-manifest.json
│  │     ├─ static
│  │     │  ├─ chunks
│  │     │  │  ├─ 29d1b_11ca0bb3._.js
│  │     │  │  ├─ 29d1b_11ca0bb3._.js.map
│  │     │  │  ├─ 29d1b_381856aa._.js
│  │     │  │  ├─ 29d1b_381856aa._.js.map
│  │     │  │  ├─ 29d1b_4cb4513d._.js
│  │     │  │  ├─ 29d1b_4cb4513d._.js.map
│  │     │  │  ├─ 29d1b_@swc_helpers_cjs_b3fbb006._.js
│  │     │  │  ├─ 29d1b_@swc_helpers_cjs_b3fbb006._.js.map
│  │     │  │  ├─ 29d1b_axios_lib_13e79ba6._.js
│  │     │  │  ├─ 29d1b_axios_lib_13e79ba6._.js.map
│  │     │  │  ├─ 29d1b_d15b067b._.js
│  │     │  │  ├─ 29d1b_d15b067b._.js.map
│  │     │  │  ├─ 29d1b_f0ec2118._.js
│  │     │  │  ├─ 29d1b_f0ec2118._.js.map
│  │     │  │  ├─ 29d1b_next_dist_06ffa846._.js
│  │     │  │  ├─ 29d1b_next_dist_06ffa846._.js.map
│  │     │  │  ├─ 29d1b_next_dist_76b38b8c._.js
│  │     │  │  ├─ 29d1b_next_dist_76b38b8c._.js.map
│  │     │  │  ├─ 29d1b_next_dist_build_polyfills_polyfill-nomodule.js
│  │     │  │  ├─ 29d1b_next_dist_build_polyfills_polyfill-nomodule.js.map
│  │     │  │  ├─ 29d1b_next_dist_client_components_builtin_global-error_6caf5f54.js
│  │     │  │  ├─ 29d1b_next_dist_client_e7b8174c._.js
│  │     │  │  ├─ 29d1b_next_dist_client_e7b8174c._.js.map
│  │     │  │  ├─ 29d1b_next_dist_compiled_8d502710._.js
│  │     │  │  ├─ 29d1b_next_dist_compiled_8d502710._.js.map
│  │     │  │  ├─ 29d1b_next_dist_compiled_next-devtools_index_3bcc88dd.js
│  │     │  │  ├─ 29d1b_next_dist_compiled_next-devtools_index_3bcc88dd.js.map
│  │     │  │  ├─ 29d1b_next_dist_compiled_react-dom_e4cb487e._.js
│  │     │  │  ├─ 29d1b_next_dist_compiled_react-dom_e4cb487e._.js.map
│  │     │  │  ├─ 29d1b_next_dist_compiled_react-server-dom-turbopack_a8236007._.js
│  │     │  │  ├─ 29d1b_next_dist_compiled_react-server-dom-turbopack_a8236007._.js.map
│  │     │  │  ├─ 29d1b_zod_v4_ad9349f4._.js
│  │     │  │  ├─ 29d1b_zod_v4_ad9349f4._.js.map
│  │     │  │  ├─ 6c7f9_4P_MySkills_frontend_src_app_(dashboard)_admin_departments_page_tsx_d3e31c1a._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_6a31cdd3._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_a0ff3932._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_dea59082._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_dea59082._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_12717411._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_12717411._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_19c0b7ea._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_19c0b7ea._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_6a50f058._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_6a50f058._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_a36bb07c._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_a36bb07c._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_(auth)_login_page_tsx_1ee15a09._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_admin_page_tsx_d3e31c1a._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_admin_users_page_tsx_d3e31c1a._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_layout_tsx_1ee15a09._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_favicon_ico_mjs_1dfe18c5._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_globals_css_bad6b30c._.single.css
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_globals_css_bad6b30c._.single.css.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_layout_tsx_6caf5f54._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_daa693b4._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_daa693b4._.js.map
│  │     │  │  ├─ turbopack-Downloads_4P_MySkills_frontend_6a31cdd3._.js
│  │     │  │  ├─ [next]_internal_font_google_geist_a71539c9_module_css_bad6b30c._.single.css
│  │     │  │  ├─ [next]_internal_font_google_geist_a71539c9_module_css_bad6b30c._.single.css.map
│  │     │  │  ├─ [next]_internal_font_google_geist_mono_8d43a2aa_module_css_bad6b30c._.single.css
│  │     │  │  ├─ [next]_internal_font_google_geist_mono_8d43a2aa_module_css_bad6b30c._.single.css.map
│  │     │  │  ├─ [root-of-the-server]__fcfa06eb._.css
│  │     │  │  ├─ [root-of-the-server]__fcfa06eb._.css.map
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_2f73fb0b._.js
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_2f73fb0b._.js.map
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_79eb73fc._.js
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js
│  │     │  │  └─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js.map
│  │     │  ├─ development
│  │     │  │  ├─ _buildManifest.js
│  │     │  │  ├─ _clientMiddlewareManifest.json
│  │     │  │  └─ _ssgManifest.js
│  │     │  └─ media
│  │     │     ├─ 4fa387ec64143e14-s.3b336396.woff2
│  │     │     ├─ 53b9e256198e5412-s.853d50a3.woff2
│  │     │     ├─ 5ce348bf30bf5439-s.56c1f21e.woff2
│  │     │     ├─ 6306c77e7c8268e4-s.e3369375.woff2
│  │     │     ├─ 7178b3e590c64307-s.55554cd0.woff2
│  │     │     ├─ 797e433ab948586e-s.p.29207c2f.woff2
│  │     │     ├─ 7d817b4c03b0c5f1-s.a40b9a8b.woff2
│  │     │     ├─ 8a480f0b521d4e75-s.ea323500.woff2
│  │     │     ├─ bbc41e54d2fcbd21-s.fe42ddf4.woff2
│  │     │     ├─ caa3a2e1cccd8315-s.p.3b6cae6d.woff2
│  │     │     ├─ favicon.0b3bf435.ico
│  │     │     └─ fef07dbb0973bf53-s.518e079e.woff2
│  │     ├─ trace
│  │     └─ types
│  │        ├─ cache-life.d.ts
│  │        ├─ routes.d.ts
│  │        └─ validator.ts
│  ├─ components.json
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  ├─ admin.api.ts
│  │  │  ├─ analytics.api.ts
│  │  │  ├─ auth.api.ts
│  │  │  ├─ campaigns.api.ts
│  │  │  ├─ deliverables.api.ts
│  │  │  ├─ employee.api.ts
│  │  │  ├─ manager.api.ts
│  │  │  ├─ managers.api.ts
│  │  │  ├─ projects.api.ts
│  │  │  ├─ recommendations.api.ts
│  │  │  └─ skills.api.ts
│  │  ├─ app
│  │  │  ├─ (auth)
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ login
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ signup
│  │  │  │     └─ page.tsx
│  │  │  ├─ (dashboard)
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ departments
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ users
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ employee
│  │  │  │  │  ├─ assignments
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ skill-request
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ skills
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ hr
│  │  │  │  │  ├─ analytics
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ campaigns
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ employees
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ projects
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     ├─ page.tsx
│  │  │  │  │  │     └─ recommendations
│  │  │  │  │  │        └─ page.tsx
│  │  │  │  │  └─ skills
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ manager
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ requests
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ reviews
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ team
│  │  │  │  │     └─ page.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ favicon.ico
│  │  │  ├─ globals.css
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ add-employee-modal.tsx
│  │  │  │  ├─ assign-manager-modal.tsx
│  │  │  │  └─ change-role-modal.tsx
│  │  │  ├─ auth
│  │  │  │  ├─ role-guard.tsx
│  │  │  │  └─ route-guard.tsx
│  │  │  ├─ hr
│  │  │  │  ├─ manage-skills-modal.tsx
│  │  │  │  └─ recommendations-modal.tsx
│  │  │  ├─ layout
│  │  │  │  ├─ header.tsx
│  │  │  │  └─ sidebar.tsx
│  │  │  ├─ providers
│  │  │  │  └─ query-provider.tsx
│  │  │  └─ ui
│  │  │     ├─ button.tsx
│  │  │     ├─ input.tsx
│  │  │     ├─ label.tsx
│  │  │     ├─ menubar.tsx
│  │  │     ├─ navigation-menu.tsx
│  │  │     ├─ pagination.tsx
│  │  │     ├─ popover.tsx
│  │  │     ├─ progress.tsx
│  │  │     ├─ radio-group.tsx
│  │  │     ├─ resizable.tsx
│  │  │     ├─ scroll-area.tsx
│  │  │     ├─ select.tsx
│  │  │     ├─ separator.tsx
│  │  │     ├─ sheet.tsx
│  │  │     ├─ skeleton.tsx
│  │  │     ├─ slider.tsx
│  │  │     ├─ sonner.tsx
│  │  │     ├─ switch.tsx
│  │  │     ├─ table.tsx
│  │  │     ├─ tabs.tsx
│  │  │     ├─ textarea.tsx
│  │  │     ├─ toggle-group.tsx
│  │  │     ├─ toggle.tsx
│  │  │     └─ tooltip.tsx
│  │  ├─ lib
│  │  │  ├─ api-client.ts
│  │  │  └─ utils.ts
│  │  ├─ store
│  │  │  └─ authStore.ts
│  │  └─ types
│  │     └─ index.ts
│  └─ tsconfig.json
├─ FRONTEND_CHECKLIST.md
└─ README.md

```
```
4P_MySkills
├─ .kilo
│  └─ worktrees
│     └─ wind-agustinia
│        ├─ API_QUICK_REFERENCE.md
│        ├─ backend
│        │  ├─ dist
│        │  │  ├─ app.js
│        │  │  ├─ config
│        │  │  │  └─ env.js
│        │  │  ├─ middlewares
│        │  │  │  ├─ auth.middleware.js
│        │  │  │  └─ role.middleware.js
│        │  │  ├─ modules
│        │  │  │  ├─ analytics
│        │  │  │  │  ├─ analytics.controller.js
│        │  │  │  │  ├─ analytics.routes.js
│        │  │  │  │  └─ analytics.service.js
│        │  │  │  ├─ assessment-campaigns
│        │  │  │  │  ├─ assessment-campaign.controller.js
│        │  │  │  │  ├─ assessment-campaign.routes.js
│        │  │  │  │  └─ assessment-campaign.service.js
│        │  │  │  ├─ assignments
│        │  │  │  │  ├─ assignment.controller.js
│        │  │  │  │  ├─ assignment.routes.js
│        │  │  │  │  └─ assignment.service.js
│        │  │  │  ├─ auth
│        │  │  │  │  ├─ auth.controller.js
│        │  │  │  │  ├─ auth.routes.js
│        │  │  │  │  └─ auth.service.js
│        │  │  │  ├─ deliverable-skills
│        │  │  │  │  ├─ deliverable-skill.controller.js
│        │  │  │  │  ├─ deliverable-skill.routes.js
│        │  │  │  │  └─ deliverable-skill.service.js
│        │  │  │  ├─ deliverables
│        │  │  │  │  ├─ deliverable.controller.js
│        │  │  │  │  ├─ deliverable.routes.js
│        │  │  │  │  └─ deliverable.service.js
│        │  │  │  ├─ departments
│        │  │  │  │  ├─ department.controller.js
│        │  │  │  │  ├─ department.routes.js
│        │  │  │  │  └─ department.service.js
│        │  │  │  ├─ employee-ingest
│        │  │  │  │  ├─ employee-ingest.controller.js
│        │  │  │  │  ├─ employee-ingest.routes.js
│        │  │  │  │  ├─ employee-ingest.service.js
│        │  │  │  │  ├─ employee-ingest.types.js
│        │  │  │  │  └─ employee-ingest.validators.js
│        │  │  │  ├─ employee-skills
│        │  │  │  │  ├─ employee-skill.controller.js
│        │  │  │  │  ├─ employee-skill.routes.js
│        │  │  │  │  └─ employee-skill.service.js
│        │  │  │  ├─ employees
│        │  │  │  │  ├─ employee.controller.js
│        │  │  │  │  ├─ employee.routes.js
│        │  │  │  │  └─ employee.service.js
│        │  │  │  ├─ llm
│        │  │  │  │  └─ llm.service.js
│        │  │  │  ├─ manager-ingest
│        │  │  │  │  ├─ manager-ingest.controller.js
│        │  │  │  │  ├─ manager-ingest.routes.js
│        │  │  │  │  ├─ manager-ingest.service.js
│        │  │  │  │  ├─ manager-ingest.types.js
│        │  │  │  │  └─ manager-ingest.validators.js
│        │  │  │  ├─ projects
│        │  │  │  │  ├─ project.controller.js
│        │  │  │  │  ├─ project.routes.js
│        │  │  │  │  └─ project.service.js
│        │  │  │  ├─ recommendations
│        │  │  │  │  ├─ recommendation.controller.js
│        │  │  │  │  ├─ recommendation.routes.js
│        │  │  │  │  └─ recommendation.service.js
│        │  │  │  ├─ skills
│        │  │  │  │  ├─ skill.controller.js
│        │  │  │  │  ├─ skill.routes.js
│        │  │  │  │  └─ skill.service.js
│        │  │  │  ├─ skills-ingest
│        │  │  │  │  ├─ skills-ingest.controller.js
│        │  │  │  │  ├─ skills-ingest.routes.js
│        │  │  │  │  ├─ skills-ingest.service.js
│        │  │  │  │  ├─ skills-ingest.types.js
│        │  │  │  │  └─ skills-ingest.validators.js
│        │  │  │  └─ tasks
│        │  │  │     ├─ tasks.controller.js
│        │  │  │     ├─ tasks.routes.js
│        │  │  │     ├─ tasks.service.js
│        │  │  │     └─ tasks.types.js
│        │  │  ├─ routes
│        │  │  │  └─ index.js
│        │  │  ├─ server.js
│        │  │  └─ utils
│        │  │     └─ db.js
│        │  ├─ package-lock.json
│        │  ├─ package.json
│        │  ├─ prisma
│        │  │  ├─ schema.prisma
│        │  │  ├─ seed.ts
│        │  │  └─ truncate_all.sql
│        │  ├─ prisma.config.ts
│        │  ├─ src
│        │  │  ├─ app.ts
│        │  │  ├─ config
│        │  │  │  └─ env.ts
│        │  │  ├─ middlewares
│        │  │  │  ├─ auth.middleware.ts
│        │  │  │  └─ role.middleware.ts
│        │  │  ├─ modules
│        │  │  │  ├─ analytics
│        │  │  │  │  ├─ analytics.controller.ts
│        │  │  │  │  ├─ analytics.routes.ts
│        │  │  │  │  └─ analytics.service.ts
│        │  │  │  ├─ assessment-campaigns
│        │  │  │  │  ├─ assessment-campaign.controller.ts
│        │  │  │  │  ├─ assessment-campaign.routes.ts
│        │  │  │  │  └─ assessment-campaign.service.ts
│        │  │  │  ├─ assignments
│        │  │  │  │  ├─ assignment.controller.ts
│        │  │  │  │  ├─ assignment.routes.ts
│        │  │  │  │  └─ assignment.service.ts
│        │  │  │  ├─ auth
│        │  │  │  │  ├─ auth.controller.ts
│        │  │  │  │  ├─ auth.routes.ts
│        │  │  │  │  └─ auth.service.ts
│        │  │  │  ├─ deliverable-skills
│        │  │  │  │  ├─ deliverable-skill.controller.ts
│        │  │  │  │  ├─ deliverable-skill.routes.ts
│        │  │  │  │  └─ deliverable-skill.service.ts
│        │  │  │  ├─ deliverables
│        │  │  │  │  ├─ deliverable.controller.ts
│        │  │  │  │  ├─ deliverable.routes.ts
│        │  │  │  │  └─ deliverable.service.ts
│        │  │  │  ├─ departments
│        │  │  │  │  ├─ department.controller.ts
│        │  │  │  │  ├─ department.routes.ts
│        │  │  │  │  └─ department.service.ts
│        │  │  │  ├─ employee-ingest
│        │  │  │  │  ├─ employee-ingest.controller.ts
│        │  │  │  │  ├─ employee-ingest.routes.ts
│        │  │  │  │  ├─ employee-ingest.service.ts
│        │  │  │  │  ├─ employee-ingest.types.ts
│        │  │  │  │  └─ employee-ingest.validators.ts
│        │  │  │  ├─ employee-skills
│        │  │  │  │  ├─ employee-skill.controller.ts
│        │  │  │  │  ├─ employee-skill.routes.ts
│        │  │  │  │  └─ employee-skill.service.ts
│        │  │  │  ├─ employees
│        │  │  │  │  ├─ employee.controller.ts
│        │  │  │  │  ├─ employee.routes.ts
│        │  │  │  │  └─ employee.service.ts
│        │  │  │  ├─ llm
│        │  │  │  │  └─ llm.service.ts
│        │  │  │  ├─ manager-ingest
│        │  │  │  │  ├─ manager-ingest.controller.ts
│        │  │  │  │  ├─ manager-ingest.routes.ts
│        │  │  │  │  ├─ manager-ingest.service.ts
│        │  │  │  │  ├─ manager-ingest.types.ts
│        │  │  │  │  └─ manager-ingest.validators.ts
│        │  │  │  ├─ projects
│        │  │  │  │  ├─ project.controller.ts
│        │  │  │  │  ├─ project.routes.ts
│        │  │  │  │  └─ project.service.ts
│        │  │  │  ├─ recommendations
│        │  │  │  │  ├─ recommendation.controller.ts
│        │  │  │  │  ├─ recommendation.routes.ts
│        │  │  │  │  └─ recommendation.service.ts
│        │  │  │  ├─ skills
│        │  │  │  │  ├─ skill.controller.ts
│        │  │  │  │  ├─ skill.routes.ts
│        │  │  │  │  └─ skill.service.ts
│        │  │  │  ├─ skills-ingest
│        │  │  │  │  ├─ skills-ingest.controller.ts
│        │  │  │  │  ├─ skills-ingest.routes.ts
│        │  │  │  │  ├─ skills-ingest.service.ts
│        │  │  │  │  ├─ skills-ingest.types.ts
│        │  │  │  │  └─ skills-ingest.validators.ts
│        │  │  │  └─ tasks
│        │  │  │     ├─ tasks.controller.ts
│        │  │  │     ├─ tasks.routes.ts
│        │  │  │     ├─ tasks.service.ts
│        │  │  │     └─ tasks.types.ts
│        │  │  ├─ routes
│        │  │  │  └─ index.ts
│        │  │  ├─ server.ts
│        │  │  └─ utils
│        │  │     └─ db.ts
│        │  └─ tsconfig.json
│        ├─ BACKEND_DOCUMENTATION.md
│        ├─ data
│        │  ├─ employees.csv
│        │  ├─ managers.csv
│        │  └─ skills.csv
│        ├─ frontend
│        │  ├─ components.json
│        │  ├─ next.config.ts
│        │  ├─ package-lock.json
│        │  ├─ package.json
│        │  ├─ postcss.config.mjs
│        │  ├─ public
│        │  │  ├─ file.svg
│        │  │  ├─ globe.svg
│        │  │  ├─ next.svg
│        │  │  ├─ vercel.svg
│        │  │  └─ window.svg
│        │  ├─ README.md
│        │  ├─ src
│        │  │  ├─ api
│        │  │  │  ├─ admin.api.ts
│        │  │  │  ├─ analytics.api.ts
│        │  │  │  ├─ auth.api.ts
│        │  │  │  ├─ campaigns.api.ts
│        │  │  │  ├─ deliverables.api.ts
│        │  │  │  ├─ employee.api.ts
│        │  │  │  ├─ manager.api.ts
│        │  │  │  ├─ managers.api.ts
│        │  │  │  ├─ projects.api.ts
│        │  │  │  ├─ recommendations.api.ts
│        │  │  │  └─ skills.api.ts
│        │  │  ├─ app
│        │  │  │  ├─ (auth)
│        │  │  │  │  ├─ layout.tsx
│        │  │  │  │  ├─ login
│        │  │  │  │  │  └─ page.tsx
│        │  │  │  │  └─ signup
│        │  │  │  │     └─ page.tsx
│        │  │  │  ├─ (dashboard)
│        │  │  │  │  ├─ admin
│        │  │  │  │  │  ├─ departments
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  └─ users
│        │  │  │  │  │     └─ page.tsx
│        │  │  │  │  ├─ employee
│        │  │  │  │  │  ├─ assignments
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  ├─ skill-request
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  └─ skills
│        │  │  │  │  │     └─ page.tsx
│        │  │  │  │  ├─ hr
│        │  │  │  │  │  ├─ analytics
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ campaigns
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ employees
│        │  │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  │  └─ [id]
│        │  │  │  │  │  │     └─ page.tsx
│        │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  ├─ projects
│        │  │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  │  └─ [id]
│        │  │  │  │  │  │     ├─ page.tsx
│        │  │  │  │  │  │     └─ recommendations
│        │  │  │  │  │  │        └─ page.tsx
│        │  │  │  │  │  └─ skills
│        │  │  │  │  │     └─ page.tsx
│        │  │  │  │  ├─ layout.tsx
│        │  │  │  │  ├─ manager
│        │  │  │  │  │  ├─ page.tsx
│        │  │  │  │  │  ├─ requests
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  ├─ reviews
│        │  │  │  │  │  │  └─ page.tsx
│        │  │  │  │  │  └─ team
│        │  │  │  │  │     └─ page.tsx
│        │  │  │  │  └─ page.tsx
│        │  │  │  ├─ favicon.ico
│        │  │  │  ├─ globals.css
│        │  │  │  ├─ layout.tsx
│        │  │  │  └─ page.tsx
│        │  │  ├─ components
│        │  │  │  ├─ admin
│        │  │  │  │  ├─ add-employee-modal.tsx
│        │  │  │  │  ├─ assign-manager-modal.tsx
│        │  │  │  │  └─ change-role-modal.tsx
│        │  │  │  ├─ auth
│        │  │  │  │  ├─ role-guard.tsx
│        │  │  │  │  └─ route-guard.tsx
│        │  │  │  ├─ hr
│        │  │  │  │  ├─ manage-skills-modal.tsx
│        │  │  │  │  └─ recommendations-modal.tsx
│        │  │  │  ├─ layout
│        │  │  │  │  ├─ header.tsx
│        │  │  │  │  └─ sidebar.tsx
│        │  │  │  ├─ providers
│        │  │  │  │  └─ query-provider.tsx
│        │  │  │  └─ ui
│        │  │  │     ├─ button.tsx
│        │  │  │     ├─ input.tsx
│        │  │  │     ├─ label.tsx
│        │  │  │     ├─ menubar.tsx
│        │  │  │     ├─ navigation-menu.tsx
│        │  │  │     ├─ pagination.tsx
│        │  │  │     ├─ popover.tsx
│        │  │  │     ├─ progress.tsx
│        │  │  │     ├─ radio-group.tsx
│        │  │  │     ├─ resizable.tsx
│        │  │  │     ├─ scroll-area.tsx
│        │  │  │     ├─ select.tsx
│        │  │  │     ├─ separator.tsx
│        │  │  │     ├─ sheet.tsx
│        │  │  │     ├─ skeleton.tsx
│        │  │  │     ├─ slider.tsx
│        │  │  │     ├─ sonner.tsx
│        │  │  │     ├─ switch.tsx
│        │  │  │     ├─ table.tsx
│        │  │  │     ├─ tabs.tsx
│        │  │  │     ├─ textarea.tsx
│        │  │  │     ├─ toggle-group.tsx
│        │  │  │     ├─ toggle.tsx
│        │  │  │     └─ tooltip.tsx
│        │  │  ├─ lib
│        │  │  │  ├─ api-client.ts
│        │  │  │  └─ utils.ts
│        │  │  ├─ store
│        │  │  │  └─ authStore.ts
│        │  │  └─ types
│        │  │     └─ index.ts
│        │  └─ tsconfig.json
│        ├─ FRONTEND_CHECKLIST.md
│        └─ README.md
├─ API_QUICK_REFERENCE.md
├─ backend
│  ├─ .env
│  ├─ data
│  │  ├─ employees.csv
│  │  ├─ managers.csv
│  │  └─ skills.csv
│  ├─ dist
│  │  ├─ app.js
│  │  ├─ config
│  │  │  └─ env.js
│  │  ├─ middlewares
│  │  │  ├─ auth.middleware.js
│  │  │  └─ role.middleware.js
│  │  ├─ modules
│  │  │  ├─ analytics
│  │  │  │  ├─ analytics.controller.js
│  │  │  │  ├─ analytics.routes.js
│  │  │  │  └─ analytics.service.js
│  │  │  ├─ assessment-campaigns
│  │  │  │  ├─ assessment-campaign.controller.js
│  │  │  │  ├─ assessment-campaign.routes.js
│  │  │  │  └─ assessment-campaign.service.js
│  │  │  ├─ assignments
│  │  │  │  ├─ assignment.controller.js
│  │  │  │  ├─ assignment.routes.js
│  │  │  │  └─ assignment.service.js
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.js
│  │  │  │  ├─ auth.routes.js
│  │  │  │  └─ auth.service.js
│  │  │  ├─ deliverable-skills
│  │  │  │  ├─ deliverable-skill.controller.js
│  │  │  │  ├─ deliverable-skill.routes.js
│  │  │  │  └─ deliverable-skill.service.js
│  │  │  ├─ deliverables
│  │  │  │  ├─ deliverable.controller.js
│  │  │  │  ├─ deliverable.routes.js
│  │  │  │  └─ deliverable.service.js
│  │  │  ├─ departments
│  │  │  │  ├─ department.controller.js
│  │  │  │  ├─ department.routes.js
│  │  │  │  └─ department.service.js
│  │  │  ├─ employee-ingest
│  │  │  │  ├─ employee-ingest.controller.js
│  │  │  │  ├─ employee-ingest.routes.js
│  │  │  │  ├─ employee-ingest.service.js
│  │  │  │  ├─ employee-ingest.types.js
│  │  │  │  └─ employee-ingest.validators.js
│  │  │  ├─ employee-skills
│  │  │  │  ├─ employee-skill.controller.js
│  │  │  │  ├─ employee-skill.routes.js
│  │  │  │  └─ employee-skill.service.js
│  │  │  ├─ employees
│  │  │  │  ├─ employee.controller.js
│  │  │  │  ├─ employee.routes.js
│  │  │  │  └─ employee.service.js
│  │  │  ├─ llm
│  │  │  │  └─ llm.service.js
│  │  │  ├─ manager-ingest
│  │  │  │  ├─ manager-ingest.controller.js
│  │  │  │  ├─ manager-ingest.routes.js
│  │  │  │  ├─ manager-ingest.service.js
│  │  │  │  ├─ manager-ingest.types.js
│  │  │  │  └─ manager-ingest.validators.js
│  │  │  ├─ projects
│  │  │  │  ├─ project.controller.js
│  │  │  │  ├─ project.routes.js
│  │  │  │  └─ project.service.js
│  │  │  ├─ recommendations
│  │  │  │  ├─ recommendation.controller.js
│  │  │  │  ├─ recommendation.routes.js
│  │  │  │  └─ recommendation.service.js
│  │  │  ├─ skills
│  │  │  │  ├─ skill.controller.js
│  │  │  │  ├─ skill.routes.js
│  │  │  │  └─ skill.service.js
│  │  │  ├─ skills-ingest
│  │  │  │  ├─ skills-ingest.controller.js
│  │  │  │  ├─ skills-ingest.routes.js
│  │  │  │  ├─ skills-ingest.service.js
│  │  │  │  ├─ skills-ingest.types.js
│  │  │  │  └─ skills-ingest.validators.js
│  │  │  └─ tasks
│  │  │     ├─ tasks.controller.js
│  │  │     ├─ tasks.routes.js
│  │  │     ├─ tasks.service.js
│  │  │     └─ tasks.types.js
│  │  ├─ routes
│  │  │  └─ index.js
│  │  ├─ server.js
│  │  └─ utils
│  │     └─ db.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  ├─ schema.prisma
│  │  ├─ schema.prisma.backup
│  │  ├─ seed.ts
│  │  └─ truncate_all.sql
│  ├─ prisma.config.ts
│  ├─ src
│  │  ├─ app.ts
│  │  ├─ config
│  │  │  └─ env.ts
│  │  ├─ middlewares
│  │  │  ├─ auth.middleware.ts
│  │  │  └─ role.middleware.ts
│  │  ├─ modules
│  │  │  ├─ allocation-engine
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ allocation-recommendations
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ allocation-runs
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ analytics
│  │  │  │  ├─ analytics.controller.ts
│  │  │  │  ├─ analytics.routes.ts
│  │  │  │  └─ analytics.service.ts
│  │  │  ├─ assessment-campaigns
│  │  │  │  ├─ assessment-campaign.controller.ts
│  │  │  │  ├─ assessment-campaign.routes.ts
│  │  │  │  └─ assessment-campaign.service.ts
│  │  │  ├─ assignment-approval
│  │  │  │  ├─ assignment-approval.controller.ts
│  │  │  │  ├─ assignment-approval.routes.ts
│  │  │  │  ├─ assignment-approval.service.ts
│  │  │  │  ├─ assignment-approval.types.ts
│  │  │  │  └─ assignment-approval.validators.ts
│  │  │  ├─ assignments
│  │  │  │  ├─ assignment.controller.ts
│  │  │  │  ├─ assignment.routes.ts
│  │  │  │  └─ assignment.service.ts
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.routes.ts
│  │  │  │  └─ auth.service.ts
│  │  │  ├─ dashboard
│  │  │  │  ├─ dashboard.controller.ts
│  │  │  │  ├─ dashboard.routes.ts
│  │  │  │  ├─ dashboard.service.ts
│  │  │  │  └─ dashboard.types.ts
│  │  │  ├─ deliverable-skills
│  │  │  │  ├─ deliverable-skill.controller.ts
│  │  │  │  ├─ deliverable-skill.routes.ts
│  │  │  │  └─ deliverable-skill.service.ts
│  │  │  ├─ deliverables
│  │  │  │  ├─ deliverable.controller.ts
│  │  │  │  ├─ deliverable.routes.ts
│  │  │  │  └─ deliverable.service.ts
│  │  │  ├─ departments
│  │  │  │  ├─ department.controller.ts
│  │  │  │  ├─ department.routes.ts
│  │  │  │  └─ department.service.ts
│  │  │  ├─ employee-availability
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ employee-ingest
│  │  │  │  ├─ employee-ingest.controller.ts
│  │  │  │  ├─ employee-ingest.routes.ts
│  │  │  │  ├─ employee-ingest.service.ts
│  │  │  │  ├─ employee-ingest.types.ts
│  │  │  │  └─ employee-ingest.validators.ts
│  │  │  ├─ employee-project-assignment
│  │  │  │  ├─ employee-project-assignment.controller.ts
│  │  │  │  ├─ employee-project-assignment.routes.ts
│  │  │  │  ├─ employee-project-assignment.service.ts
│  │  │  │  ├─ employee-project-assignment.types.ts
│  │  │  │  └─ employee-project-assignment.validators.ts
│  │  │  ├─ employee-skills
│  │  │  │  ├─ employee-skill.controller.ts
│  │  │  │  ├─ employee-skill.routes.ts
│  │  │  │  └─ employee-skill.service.ts
│  │  │  ├─ employee-workload
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ employees
│  │  │  │  ├─ employee.controller.ts
│  │  │  │  ├─ employee.routes.ts
│  │  │  │  └─ employee.service.ts
│  │  │  ├─ llm
│  │  │  │  └─ llm.service.ts
│  │  │  ├─ llm-task-extraction
│  │  │  │  ├─ llm-task-extraction.controller.ts
│  │  │  │  ├─ llm-task-extraction.routes.ts
│  │  │  │  ├─ llm-task-extraction.service.ts
│  │  │  │  ├─ llm-task-extraction.types.ts
│  │  │  │  └─ llm-task-extraction.validators.ts
│  │  │  ├─ manager-ingest
│  │  │  │  ├─ manager-ingest.controller.ts
│  │  │  │  ├─ manager-ingest.routes.ts
│  │  │  │  ├─ manager-ingest.service.ts
│  │  │  │  ├─ manager-ingest.types.ts
│  │  │  │  └─ manager-ingest.validators.ts
│  │  │  ├─ projects
│  │  │  │  ├─ project.controller.ts
│  │  │  │  ├─ project.routes.ts
│  │  │  │  └─ project.service.ts
│  │  │  ├─ recommendations
│  │  │  │  ├─ recommendation.controller.ts
│  │  │  │  ├─ recommendation.routes.ts
│  │  │  │  └─ recommendation.service.ts
│  │  │  ├─ skill-assessment
│  │  │  │  ├─ skill-assessment.controller.ts
│  │  │  │  ├─ skill-assessment.routes.ts
│  │  │  │  ├─ skill-assessment.service.ts
│  │  │  │  ├─ skill-assessment.types.ts
│  │  │  │  └─ skill-assessment.validators.ts
│  │  │  ├─ skill-development
│  │  │  │  ├─ skill-development.controller.ts
│  │  │  │  ├─ skill-development.routes.ts
│  │  │  │  ├─ skill-development.service.ts
│  │  │  │  ├─ skill-development.types.ts
│  │  │  │  └─ skill-development.validators.ts
│  │  │  ├─ skill-index
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ skills
│  │  │  │  ├─ skill.controller.ts
│  │  │  │  ├─ skill.routes.ts
│  │  │  │  └─ skill.service.ts
│  │  │  ├─ skills-ingest
│  │  │  │  ├─ skills-ingest.controller.ts
│  │  │  │  ├─ skills-ingest.routes.ts
│  │  │  │  ├─ skills-ingest.service.ts
│  │  │  │  ├─ skills-ingest.types.ts
│  │  │  │  └─ skills-ingest.validators.ts
│  │  │  ├─ task-dependencies
│  │  │  │  ├─ controller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ task-plan-approval
│  │  │  │  ├─ task-plan-approval.controller.ts
│  │  │  │  ├─ task-plan-approval.routes.ts
│  │  │  │  ├─ task-plan-approval.service.ts
│  │  │  │  ├─ task-plan-approval.types.ts
│  │  │  │  └─ task-plan-approval.validators.ts
│  │  │  ├─ task-skill-requirements
│  │  │  │  ├─ contoller.ts
│  │  │  │  ├─ routes.ts
│  │  │  │  ├─ service.ts
│  │  │  │  ├─ types.ts
│  │  │  │  └─ validators.ts
│  │  │  └─ tasks
│  │  │     ├─ tasks.controller.ts
│  │  │     ├─ tasks.routes.ts
│  │  │     ├─ tasks.service.ts
│  │  │     └─ tasks.types.ts
│  │  ├─ routes
│  │  │  └─ index.ts
│  │  ├─ server.ts
│  │  └─ utils
│  │     └─ db.ts
│  └─ tsconfig.json
├─ BACKEND_DOCUMENTATION.md
├─ frontend
│  ├─ .next
│  │  └─ dev
│  │     ├─ build
│  │     │  ├─ chunks
│  │     │  │  ├─ 29d1b_46bd99fa._.js
│  │     │  │  ├─ 29d1b_46bd99fa._.js.map
│  │     │  │  ├─ [root-of-the-server]__5c050acd._.js
│  │     │  │  ├─ [root-of-the-server]__5c050acd._.js.map
│  │     │  │  ├─ [root-of-the-server]__e9a9fb3c._.js
│  │     │  │  ├─ [root-of-the-server]__e9a9fb3c._.js.map
│  │     │  │  ├─ [turbopack-node]_transforms_postcss_ts_8ee76bdb._.js
│  │     │  │  ├─ [turbopack-node]_transforms_postcss_ts_8ee76bdb._.js.map
│  │     │  │  ├─ [turbopack]_runtime.js
│  │     │  │  └─ [turbopack]_runtime.js.map
│  │     │  ├─ package.json
│  │     │  ├─ postcss.js
│  │     │  └─ postcss.js.map
│  │     ├─ build-manifest.json
│  │     ├─ cache
│  │     │  ├─ .rscinfo
│  │     │  ├─ chrome-devtools-workspace-uuid
│  │     │  ├─ next-devtools-config.json
│  │     │  └─ turbopack
│  │     │     └─ 23c46498
│  │     │        ├─ 00000001.sst
│  │     │        ├─ 00000003.sst
│  │     │        ├─ 00000004.sst
│  │     │        ├─ 00000005.sst
│  │     │        ├─ 00000006.meta
│  │     │        ├─ 00000007.meta
│  │     │        ├─ 00000009.meta
│  │     │        ├─ 00000010.meta
│  │     │        ├─ 00000015.sst
│  │     │        ├─ 00000016.sst
│  │     │        ├─ 00000017.sst
│  │     │        ├─ 00000018.sst
│  │     │        ├─ 00000019.meta
│  │     │        ├─ 00000021.meta
│  │     │        ├─ 00000022.meta
│  │     │        ├─ 00000023.meta
│  │     │        ├─ 00000028.sst
│  │     │        ├─ 00000029.sst
│  │     │        ├─ 00000030.sst
│  │     │        ├─ 00000031.sst
│  │     │        ├─ 00000032.meta
│  │     │        ├─ 00000033.meta
│  │     │        ├─ 00000035.meta
│  │     │        ├─ 00000036.meta
│  │     │        ├─ 00000041.sst
│  │     │        ├─ 00000042.sst
│  │     │        ├─ 00000043.sst
│  │     │        ├─ 00000044.sst
│  │     │        ├─ 00000045.meta
│  │     │        ├─ 00000046.meta
│  │     │        ├─ 00000048.meta
│  │     │        ├─ 00000049.meta
│  │     │        ├─ 00000050.sst
│  │     │        ├─ 00000051.meta
│  │     │        ├─ 00000053.sst
│  │     │        ├─ 00000054.sst
│  │     │        ├─ 00000055.sst
│  │     │        ├─ 00000056.meta
│  │     │        ├─ 00000057.meta
│  │     │        ├─ 00000058.meta
│  │     │        ├─ 00000059.sst
│  │     │        ├─ 00000060.sst
│  │     │        ├─ 00000061.sst
│  │     │        ├─ 00000062.sst
│  │     │        ├─ 00000063.sst
│  │     │        ├─ 00000064.meta
│  │     │        ├─ 00000065.meta
│  │     │        ├─ 00000066.meta
│  │     │        ├─ 00000067.meta
│  │     │        ├─ 00000068.meta
│  │     │        ├─ 00000069.sst
│  │     │        ├─ 00000070.sst
│  │     │        ├─ 00000071.sst
│  │     │        ├─ 00000072.meta
│  │     │        ├─ 00000073.meta
│  │     │        ├─ 00000074.meta
│  │     │        ├─ 00000075.sst
│  │     │        ├─ 00000076.sst
│  │     │        ├─ 00000077.sst
│  │     │        ├─ 00000078.meta
│  │     │        ├─ 00000079.meta
│  │     │        ├─ 00000080.meta
│  │     │        ├─ 00000081.sst
│  │     │        ├─ 00000082.sst
│  │     │        ├─ 00000083.sst
│  │     │        ├─ 00000084.meta
│  │     │        ├─ 00000085.meta
│  │     │        ├─ 00000086.meta
│  │     │        ├─ 00000087.sst
│  │     │        ├─ 00000088.sst
│  │     │        ├─ 00000089.sst
│  │     │        ├─ 00000090.meta
│  │     │        ├─ 00000091.meta
│  │     │        ├─ 00000092.meta
│  │     │        ├─ 00000093.sst
│  │     │        ├─ 00000094.sst
│  │     │        ├─ 00000095.sst
│  │     │        ├─ 00000096.meta
│  │     │        ├─ 00000097.meta
│  │     │        ├─ 00000098.meta
│  │     │        ├─ 00000099.sst
│  │     │        ├─ 00000100.sst
│  │     │        ├─ 00000101.sst
│  │     │        ├─ 00000102.meta
│  │     │        ├─ 00000103.meta
│  │     │        ├─ 00000104.meta
│  │     │        ├─ 00000105.sst
│  │     │        ├─ 00000106.sst
│  │     │        ├─ 00000107.sst
│  │     │        ├─ 00000108.meta
│  │     │        ├─ 00000109.meta
│  │     │        ├─ 00000110.meta
│  │     │        ├─ 00000111.sst
│  │     │        ├─ 00000112.sst
│  │     │        ├─ 00000113.sst
│  │     │        ├─ 00000114.meta
│  │     │        ├─ 00000115.meta
│  │     │        ├─ 00000116.meta
│  │     │        ├─ 00000117.sst
│  │     │        ├─ 00000118.sst
│  │     │        ├─ 00000119.sst
│  │     │        ├─ 00000120.meta
│  │     │        ├─ 00000121.meta
│  │     │        ├─ 00000122.meta
│  │     │        ├─ 00000123.sst
│  │     │        ├─ 00000124.sst
│  │     │        ├─ 00000125.sst
│  │     │        ├─ 00000126.meta
│  │     │        ├─ 00000127.meta
│  │     │        ├─ 00000128.meta
│  │     │        ├─ 00000129.sst
│  │     │        ├─ 00000130.sst
│  │     │        ├─ 00000131.sst
│  │     │        ├─ 00000132.meta
│  │     │        ├─ 00000133.meta
│  │     │        ├─ 00000134.meta
│  │     │        ├─ 00000135.sst
│  │     │        ├─ 00000136.sst
│  │     │        ├─ 00000137.sst
│  │     │        ├─ 00000138.meta
│  │     │        ├─ 00000139.meta
│  │     │        ├─ 00000140.meta
│  │     │        ├─ 00000141.sst
│  │     │        ├─ 00000142.sst
│  │     │        ├─ 00000143.sst
│  │     │        ├─ 00000144.meta
│  │     │        ├─ 00000145.meta
│  │     │        ├─ 00000146.meta
│  │     │        ├─ CURRENT
│  │     │        └─ LOG
│  │     ├─ fallback-build-manifest.json
│  │     ├─ logs
│  │     │  └─ next-development.log
│  │     ├─ package.json
│  │     ├─ prerender-manifest.json
│  │     ├─ routes-manifest.json
│  │     ├─ server
│  │     │  ├─ app
│  │     │  │  ├─ (auth)
│  │     │  │  │  └─ login
│  │     │  │  │     ├─ page
│  │     │  │  │     │  ├─ app-paths-manifest.json
│  │     │  │  │     │  ├─ build-manifest.json
│  │     │  │  │     │  ├─ next-font-manifest.json
│  │     │  │  │     │  ├─ react-loadable-manifest.json
│  │     │  │  │     │  └─ server-reference-manifest.json
│  │     │  │  │     ├─ page.js
│  │     │  │  │     ├─ page.js.map
│  │     │  │  │     └─ page_client-reference-manifest.js
│  │     │  │  ├─ (dashboard)
│  │     │  │  │  └─ admin
│  │     │  │  │     ├─ departments
│  │     │  │  │     │  ├─ page
│  │     │  │  │     │  │  ├─ app-paths-manifest.json
│  │     │  │  │     │  │  ├─ build-manifest.json
│  │     │  │  │     │  │  ├─ next-font-manifest.json
│  │     │  │  │     │  │  ├─ react-loadable-manifest.json
│  │     │  │  │     │  │  └─ server-reference-manifest.json
│  │     │  │  │     │  ├─ page.js
│  │     │  │  │     │  ├─ page.js.map
│  │     │  │  │     │  └─ page_client-reference-manifest.js
│  │     │  │  │     ├─ page
│  │     │  │  │     │  ├─ app-paths-manifest.json
│  │     │  │  │     │  ├─ build-manifest.json
│  │     │  │  │     │  ├─ next-font-manifest.json
│  │     │  │  │     │  ├─ react-loadable-manifest.json
│  │     │  │  │     │  └─ server-reference-manifest.json
│  │     │  │  │     ├─ page.js
│  │     │  │  │     ├─ page.js.map
│  │     │  │  │     ├─ page_client-reference-manifest.js
│  │     │  │  │     └─ users
│  │     │  │  │        ├─ page
│  │     │  │  │        │  ├─ app-paths-manifest.json
│  │     │  │  │        │  ├─ build-manifest.json
│  │     │  │  │        │  ├─ next-font-manifest.json
│  │     │  │  │        │  ├─ react-loadable-manifest.json
│  │     │  │  │        │  └─ server-reference-manifest.json
│  │     │  │  │        ├─ page.js
│  │     │  │  │        ├─ page.js.map
│  │     │  │  │        └─ page_client-reference-manifest.js
│  │     │  │  ├─ page
│  │     │  │  │  ├─ app-paths-manifest.json
│  │     │  │  │  ├─ build-manifest.json
│  │     │  │  │  ├─ next-font-manifest.json
│  │     │  │  │  ├─ react-loadable-manifest.json
│  │     │  │  │  └─ server-reference-manifest.json
│  │     │  │  ├─ page.js
│  │     │  │  ├─ page.js.map
│  │     │  │  ├─ page_client-reference-manifest.js
│  │     │  │  └─ _not-found
│  │     │  │     ├─ page
│  │     │  │     │  ├─ app-paths-manifest.json
│  │     │  │     │  ├─ build-manifest.json
│  │     │  │     │  ├─ next-font-manifest.json
│  │     │  │     │  ├─ react-loadable-manifest.json
│  │     │  │     │  └─ server-reference-manifest.json
│  │     │  │     ├─ page.js
│  │     │  │     ├─ page.js.map
│  │     │  │     └─ page_client-reference-manifest.js
│  │     │  ├─ app-paths-manifest.json
│  │     │  ├─ chunks
│  │     │  │  └─ ssr
│  │     │  │     ├─ 29d1b_58d7c465._.js
│  │     │  │     ├─ 29d1b_58d7c465._.js.map
│  │     │  │     ├─ 29d1b_7d3fb9ea._.js
│  │     │  │     ├─ 29d1b_7d3fb9ea._.js.map
│  │     │  │     ├─ 29d1b_866f995f._.js
│  │     │  │     ├─ 29d1b_866f995f._.js.map
│  │     │  │     ├─ 29d1b_axios_lib_addf091b._.js
│  │     │  │     ├─ 29d1b_axios_lib_addf091b._.js.map
│  │     │  │     ├─ 29d1b_bd79e30d._.js
│  │     │  │     ├─ 29d1b_bd79e30d._.js.map
│  │     │  │     ├─ 29d1b_next_dist_2063018c._.js
│  │     │  │     ├─ 29d1b_next_dist_2063018c._.js.map
│  │     │  │     ├─ 29d1b_next_dist_21ef717c._.js
│  │     │  │     ├─ 29d1b_next_dist_21ef717c._.js.map
│  │     │  │     ├─ 29d1b_next_dist_718357c4._.js
│  │     │  │     ├─ 29d1b_next_dist_718357c4._.js.map
│  │     │  │     ├─ 29d1b_next_dist_8751d376._.js
│  │     │  │     ├─ 29d1b_next_dist_8751d376._.js.map
│  │     │  │     ├─ 29d1b_next_dist_a2a437b2._.js
│  │     │  │     ├─ 29d1b_next_dist_a2a437b2._.js.map
│  │     │  │     ├─ 29d1b_next_dist_b4fdc870._.js
│  │     │  │     ├─ 29d1b_next_dist_b4fdc870._.js.map
│  │     │  │     ├─ 29d1b_next_dist_c86a53b7._.js
│  │     │  │     ├─ 29d1b_next_dist_c86a53b7._.js.map
│  │     │  │     ├─ 29d1b_next_dist_client_components_a572bf76._.js
│  │     │  │     ├─ 29d1b_next_dist_client_components_a572bf76._.js.map
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_forbidden_d06e862d.js
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_forbidden_d06e862d.js.map
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_global-error_d96712a8.js
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_global-error_d96712a8.js.map
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_unauthorized_04a6456b.js
│  │     │  │     ├─ 29d1b_next_dist_client_components_builtin_unauthorized_04a6456b.js.map
│  │     │  │     ├─ 29d1b_next_dist_e699fe23._.js
│  │     │  │     ├─ 29d1b_next_dist_e699fe23._.js.map
│  │     │  │     ├─ 29d1b_next_dist_f56a351d._.js
│  │     │  │     ├─ 29d1b_next_dist_f56a351d._.js.map
│  │     │  │     ├─ 29d1b_zod_v4_861115be._.js
│  │     │  │     ├─ 29d1b_zod_v4_861115be._.js.map
│  │     │  │     ├─ 5b9e3_frontend__next-internal_server_app_(dashboard)_admin_page_actions_e1482e83.js
│  │     │  │     ├─ 5b9e3_frontend__next-internal_server_app_(dashboard)_admin_page_actions_e1482e83.js.map
│  │     │  │     ├─ 6c7f9_4P_MySkills_frontend__next-internal_server_app__not-found_page_actions_9c82a581.js
│  │     │  │     ├─ 6c7f9_4P_MySkills_frontend__next-internal_server_app__not-found_page_actions_9c82a581.js.map
│  │     │  │     ├─ 8ab3f__next-internal_server_app_(dashboard)_admin_departments_page_actions_2191dae4.js
│  │     │  │     ├─ 8ab3f__next-internal_server_app_(dashboard)_admin_departments_page_actions_2191dae4.js.map
│  │     │  │     ├─ 8ab3f__next-internal_server_app_(dashboard)_admin_users_page_actions_f3628773.js
│  │     │  │     ├─ 8ab3f__next-internal_server_app_(dashboard)_admin_users_page_actions_f3628773.js.map
│  │     │  │     ├─ b02f8_MySkills_frontend__next-internal_server_app_(auth)_login_page_actions_f0b616a0.js
│  │     │  │     ├─ b02f8_MySkills_frontend__next-internal_server_app_(auth)_login_page_actions_f0b616a0.js.map
│  │     │  │     ├─ b5767_mime-db_f520c4f0._.js
│  │     │  │     ├─ b5767_mime-db_f520c4f0._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_ac2fb00e._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_ac2fb00e._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_244b8c78._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_244b8c78._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_(auth)_layout_tsx_a21f993a._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_(auth)_layout_tsx_a21f993a._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_layout_tsx_0ec74d1c._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_layout_tsx_0ec74d1c._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_8a3794bc._.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend_src_app_8a3794bc._.js.map
│  │     │  │     ├─ Downloads_4P_MySkills_frontend__next-internal_server_app_page_actions_9bf17780.js
│  │     │  │     ├─ Downloads_4P_MySkills_frontend__next-internal_server_app_page_actions_9bf17780.js.map
│  │     │  │     ├─ [externals]_next_dist_1aaf5479._.js
│  │     │  │     ├─ [externals]_next_dist_1aaf5479._.js.map
│  │     │  │     ├─ [externals]_next_dist_c80f7c8f._.js
│  │     │  │     ├─ [externals]_next_dist_c80f7c8f._.js.map
│  │     │  │     ├─ [externals]__e8a2741f._.js
│  │     │  │     ├─ [externals]__e8a2741f._.js.map
│  │     │  │     ├─ [root-of-the-server]__079bca38._.js
│  │     │  │     ├─ [root-of-the-server]__079bca38._.js.map
│  │     │  │     ├─ [root-of-the-server]__314299d0._.js
│  │     │  │     ├─ [root-of-the-server]__314299d0._.js.map
│  │     │  │     ├─ [root-of-the-server]__3c81b3cf._.js
│  │     │  │     ├─ [root-of-the-server]__3c81b3cf._.js.map
│  │     │  │     ├─ [root-of-the-server]__5bf400fd._.js
│  │     │  │     ├─ [root-of-the-server]__5bf400fd._.js.map
│  │     │  │     ├─ [root-of-the-server]__64491fb1._.js
│  │     │  │     ├─ [root-of-the-server]__64491fb1._.js.map
│  │     │  │     ├─ [root-of-the-server]__66d6f7fd._.js
│  │     │  │     ├─ [root-of-the-server]__66d6f7fd._.js.map
│  │     │  │     ├─ [root-of-the-server]__67af8521._.js
│  │     │  │     ├─ [root-of-the-server]__67af8521._.js.map
│  │     │  │     ├─ [root-of-the-server]__a9e5b048._.js
│  │     │  │     ├─ [root-of-the-server]__a9e5b048._.js.map
│  │     │  │     ├─ [root-of-the-server]__be742ce7._.js
│  │     │  │     ├─ [root-of-the-server]__be742ce7._.js.map
│  │     │  │     ├─ [root-of-the-server]__bfdb1038._.js
│  │     │  │     ├─ [root-of-the-server]__bfdb1038._.js.map
│  │     │  │     ├─ [root-of-the-server]__d325d995._.js
│  │     │  │     ├─ [root-of-the-server]__d325d995._.js.map
│  │     │  │     ├─ [root-of-the-server]__edccf7bc._.js
│  │     │  │     ├─ [root-of-the-server]__edccf7bc._.js.map
│  │     │  │     ├─ [turbopack]_runtime.js
│  │     │  │     ├─ [turbopack]_runtime.js.map
│  │     │  │     ├─ _394790ad._.js
│  │     │  │     ├─ _394790ad._.js.map
│  │     │  │     ├─ _8fa862f1._.js
│  │     │  │     ├─ _8fa862f1._.js.map
│  │     │  │     ├─ _e81dcc71._.js
│  │     │  │     └─ _e81dcc71._.js.map
│  │     │  ├─ interception-route-rewrite-manifest.js
│  │     │  ├─ middleware-build-manifest.js
│  │     │  ├─ middleware-manifest.json
│  │     │  ├─ next-font-manifest.js
│  │     │  ├─ next-font-manifest.json
│  │     │  ├─ pages-manifest.json
│  │     │  ├─ server-reference-manifest.js
│  │     │  └─ server-reference-manifest.json
│  │     ├─ static
│  │     │  ├─ chunks
│  │     │  │  ├─ 29d1b_11ca0bb3._.js
│  │     │  │  ├─ 29d1b_11ca0bb3._.js.map
│  │     │  │  ├─ 29d1b_381856aa._.js
│  │     │  │  ├─ 29d1b_381856aa._.js.map
│  │     │  │  ├─ 29d1b_4cb4513d._.js
│  │     │  │  ├─ 29d1b_4cb4513d._.js.map
│  │     │  │  ├─ 29d1b_@swc_helpers_cjs_b3fbb006._.js
│  │     │  │  ├─ 29d1b_@swc_helpers_cjs_b3fbb006._.js.map
│  │     │  │  ├─ 29d1b_axios_lib_13e79ba6._.js
│  │     │  │  ├─ 29d1b_axios_lib_13e79ba6._.js.map
│  │     │  │  ├─ 29d1b_d15b067b._.js
│  │     │  │  ├─ 29d1b_d15b067b._.js.map
│  │     │  │  ├─ 29d1b_f0ec2118._.js
│  │     │  │  ├─ 29d1b_f0ec2118._.js.map
│  │     │  │  ├─ 29d1b_next_dist_06ffa846._.js
│  │     │  │  ├─ 29d1b_next_dist_06ffa846._.js.map
│  │     │  │  ├─ 29d1b_next_dist_76b38b8c._.js
│  │     │  │  ├─ 29d1b_next_dist_76b38b8c._.js.map
│  │     │  │  ├─ 29d1b_next_dist_build_polyfills_polyfill-nomodule.js
│  │     │  │  ├─ 29d1b_next_dist_build_polyfills_polyfill-nomodule.js.map
│  │     │  │  ├─ 29d1b_next_dist_client_components_builtin_global-error_6caf5f54.js
│  │     │  │  ├─ 29d1b_next_dist_client_e7b8174c._.js
│  │     │  │  ├─ 29d1b_next_dist_client_e7b8174c._.js.map
│  │     │  │  ├─ 29d1b_next_dist_compiled_8d502710._.js
│  │     │  │  ├─ 29d1b_next_dist_compiled_8d502710._.js.map
│  │     │  │  ├─ 29d1b_next_dist_compiled_next-devtools_index_3bcc88dd.js
│  │     │  │  ├─ 29d1b_next_dist_compiled_next-devtools_index_3bcc88dd.js.map
│  │     │  │  ├─ 29d1b_next_dist_compiled_react-dom_e4cb487e._.js
│  │     │  │  ├─ 29d1b_next_dist_compiled_react-dom_e4cb487e._.js.map
│  │     │  │  ├─ 29d1b_next_dist_compiled_react-server-dom-turbopack_a8236007._.js
│  │     │  │  ├─ 29d1b_next_dist_compiled_react-server-dom-turbopack_a8236007._.js.map
│  │     │  │  ├─ 29d1b_zod_v4_ad9349f4._.js
│  │     │  │  ├─ 29d1b_zod_v4_ad9349f4._.js.map
│  │     │  │  ├─ 6c7f9_4P_MySkills_frontend_src_app_(dashboard)_admin_departments_page_tsx_d3e31c1a._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_6a31cdd3._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_a0ff3932._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_dea59082._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_dea59082._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_12717411._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_12717411._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_19c0b7ea._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_19c0b7ea._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_6a50f058._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_6a50f058._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_a36bb07c._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_a36bb07c._.js.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_(auth)_login_page_tsx_1ee15a09._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_admin_page_tsx_d3e31c1a._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_admin_users_page_tsx_d3e31c1a._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_(dashboard)_layout_tsx_1ee15a09._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_favicon_ico_mjs_1dfe18c5._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_globals_css_bad6b30c._.single.css
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_globals_css_bad6b30c._.single.css.map
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_app_layout_tsx_6caf5f54._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_daa693b4._.js
│  │     │  │  ├─ Downloads_4P_MySkills_frontend_src_daa693b4._.js.map
│  │     │  │  ├─ turbopack-Downloads_4P_MySkills_frontend_6a31cdd3._.js
│  │     │  │  ├─ [next]_internal_font_google_geist_a71539c9_module_css_bad6b30c._.single.css
│  │     │  │  ├─ [next]_internal_font_google_geist_a71539c9_module_css_bad6b30c._.single.css.map
│  │     │  │  ├─ [next]_internal_font_google_geist_mono_8d43a2aa_module_css_bad6b30c._.single.css
│  │     │  │  ├─ [next]_internal_font_google_geist_mono_8d43a2aa_module_css_bad6b30c._.single.css.map
│  │     │  │  ├─ [root-of-the-server]__fcfa06eb._.css
│  │     │  │  ├─ [root-of-the-server]__fcfa06eb._.css.map
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_2f73fb0b._.js
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_2f73fb0b._.js.map
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_79eb73fc._.js
│  │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js
│  │     │  │  └─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js.map
│  │     │  ├─ development
│  │     │  │  ├─ _buildManifest.js
│  │     │  │  ├─ _clientMiddlewareManifest.json
│  │     │  │  └─ _ssgManifest.js
│  │     │  └─ media
│  │     │     ├─ 4fa387ec64143e14-s.3b336396.woff2
│  │     │     ├─ 53b9e256198e5412-s.853d50a3.woff2
│  │     │     ├─ 5ce348bf30bf5439-s.56c1f21e.woff2
│  │     │     ├─ 6306c77e7c8268e4-s.e3369375.woff2
│  │     │     ├─ 7178b3e590c64307-s.55554cd0.woff2
│  │     │     ├─ 797e433ab948586e-s.p.29207c2f.woff2
│  │     │     ├─ 7d817b4c03b0c5f1-s.a40b9a8b.woff2
│  │     │     ├─ 8a480f0b521d4e75-s.ea323500.woff2
│  │     │     ├─ bbc41e54d2fcbd21-s.fe42ddf4.woff2
│  │     │     ├─ caa3a2e1cccd8315-s.p.3b6cae6d.woff2
│  │     │     ├─ favicon.0b3bf435.ico
│  │     │     └─ fef07dbb0973bf53-s.518e079e.woff2
│  │     ├─ trace
│  │     └─ types
│  │        ├─ cache-life.d.ts
│  │        ├─ routes.d.ts
│  │        └─ validator.ts
│  ├─ components.json
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  ├─ admin.api.ts
│  │  │  ├─ analytics.api.ts
│  │  │  ├─ auth.api.ts
│  │  │  ├─ campaigns.api.ts
│  │  │  ├─ deliverables.api.ts
│  │  │  ├─ employee.api.ts
│  │  │  ├─ manager.api.ts
│  │  │  ├─ managers.api.ts
│  │  │  ├─ projects.api.ts
│  │  │  ├─ recommendations.api.ts
│  │  │  └─ skills.api.ts
│  │  ├─ app
│  │  │  ├─ (auth)
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ login
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ signup
│  │  │  │     └─ page.tsx
│  │  │  ├─ (dashboard)
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ departments
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ users
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ employee
│  │  │  │  │  ├─ assignments
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ skill-request
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ skills
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ hr
│  │  │  │  │  ├─ analytics
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ campaigns
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ employees
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ projects
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     ├─ page.tsx
│  │  │  │  │  │     └─ recommendations
│  │  │  │  │  │        └─ page.tsx
│  │  │  │  │  └─ skills
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ manager
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ requests
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ reviews
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ team
│  │  │  │  │     └─ page.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ favicon.ico
│  │  │  ├─ globals.css
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ add-employee-modal.tsx
│  │  │  │  ├─ assign-manager-modal.tsx
│  │  │  │  └─ change-role-modal.tsx
│  │  │  ├─ auth
│  │  │  │  ├─ role-guard.tsx
│  │  │  │  └─ route-guard.tsx
│  │  │  ├─ hr
│  │  │  │  ├─ manage-skills-modal.tsx
│  │  │  │  └─ recommendations-modal.tsx
│  │  │  ├─ layout
│  │  │  │  ├─ header.tsx
│  │  │  │  └─ sidebar.tsx
│  │  │  ├─ providers
│  │  │  │  └─ query-provider.tsx
│  │  │  └─ ui
│  │  │     ├─ button.tsx
│  │  │     ├─ input.tsx
│  │  │     ├─ label.tsx
│  │  │     ├─ menubar.tsx
│  │  │     ├─ navigation-menu.tsx
│  │  │     ├─ pagination.tsx
│  │  │     ├─ popover.tsx
│  │  │     ├─ progress.tsx
│  │  │     ├─ radio-group.tsx
│  │  │     ├─ resizable.tsx
│  │  │     ├─ scroll-area.tsx
│  │  │     ├─ select.tsx
│  │  │     ├─ separator.tsx
│  │  │     ├─ sheet.tsx
│  │  │     ├─ skeleton.tsx
│  │  │     ├─ slider.tsx
│  │  │     ├─ sonner.tsx
│  │  │     ├─ switch.tsx
│  │  │     ├─ table.tsx
│  │  │     ├─ tabs.tsx
│  │  │     ├─ textarea.tsx
│  │  │     ├─ toggle-group.tsx
│  │  │     ├─ toggle.tsx
│  │  │     └─ tooltip.tsx
│  │  ├─ lib
│  │  │  ├─ api-client.ts
│  │  │  └─ utils.ts
│  │  ├─ store
│  │  │  └─ authStore.ts
│  │  └─ types
│  │     └─ index.ts
│  └─ tsconfig.json
├─ FRONTEND_CHECKLIST.md
└─ README.md

```