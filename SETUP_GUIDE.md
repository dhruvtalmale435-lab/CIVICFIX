# CivicFix - Full Stack Setup Guide

## Project Structure

```
/workspace
├── backend/          # Node.js + Express + TypeScript API
├── frontend/         # React 19 + Vite + TypeScript UI
├── database/         # SQL migrations and scripts
└── README.md
```

## Quick Start

### 1. Supabase Setup (REQUIRED)

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the schema from `backend/supabase/schema.sql`
3. Get your credentials from Settings → API:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

4. Create storage bucket:
   - Go to Storage
   - Create bucket named `complaint-images`
   - Set it to public

### 2. Backend Configuration

Create/update `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Frontend Configuration

Create/update `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Terminal 1: Start Backend

```bash
cd /workspace/backend
npm install
npm run dev
```

Backend will run on http://localhost:5000

### Terminal 2: Start Frontend

```bash
cd /workspace/frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5173

## API Endpoints

### Health Check
- `GET /api/health` - Returns service status

### Complaints
- `POST /api/complaints` - Create complaint (requires auth)
- `GET /api/complaints` - List complaints with filters (requires auth)
- `GET /api/complaints/:id` - Get complaint details (requires auth)
- `PATCH /api/complaints/:id/status` - Update status (requires auth, admin/volunteer)
- `GET /api/complaints/nearby?lat=&lng=&radius=` - Get nearby complaints

### Assignments
- `GET /api/assignments` - Get assignments for user (requires auth)
- `POST /api/complaints/:id/assign` - Assign volunteer (requires auth, admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get statistics (requires auth, admin only)
- `GET /api/dashboard/recent` - Get recent complaints (requires auth)

### AI
- `POST /api/ai/predict` - Get AI prediction (mock implementation)

### Storage
- `POST /api/upload/image` - Upload image (requires auth)

## Authentication

The app uses Supabase Auth:

1. Users sign up/sign in via Supabase
2. Access token is stored in localStorage as `supabase_token`
3. Token is sent in Authorization header: `Bearer <token>`
4. Backend verifies token using JWT

## User Roles

- **CITIZEN**: Can create and view own complaints
- **ADMIN**: Can view all complaints, assign volunteers, update status
- **VOLUNTEER**: Can view assigned complaints, update status

## Database Schema

Tables created by `backend/supabase/schema.sql`:

- `profiles` - User profiles linked to auth.users
- `complaints` - Civic issue reports
- `assignments` - Volunteer assignments
- `complaint_updates` - Status change history
- `ai_predictions` - AI classification results

## Testing the MVP Flow

1. **Citizen submits complaint:**
   - Go to /report page
   - Upload image, fill form, submit
   - Complaint saved to Supabase

2. **Admin views and assigns:**
   - Login as admin
   - View dashboard at /admin
   - See complaint in list
   - Assign to volunteer

3. **Volunteer updates status:**
   - Login as volunteer
   - View assigned complaints
   - Update status to IN_PROGRESS, then RESOLVED

4. **Citizen sees updates:**
   - Login as citizen
   - View own complaints
   - See status updates

## Troubleshooting

### Backend won't start
- Check `.env` file has valid Supabase credentials
- Ensure port 5000 is not in use
- Run `npm install` to ensure dependencies are installed

### Frontend can't connect to backend
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend (should allow localhost:5173)
- Ensure backend is running

### Authentication issues
- Verify Supabase URL and keys are correct
- Check that schema.sql was run in Supabase SQL Editor
- Ensure storage bucket `complaint-images` exists

### Database errors
- Confirm all tables were created successfully
- Check RLS policies are properly configured
- Verify foreign key relationships

## Production Deployment

### Backend
```bash
cd backend
npm run build
NODE_ENV=production node dist/server.js
```

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to hosting service
```

## Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend
- Keep `.env` files out of version control
- RLS policies protect data at database level
- JWT tokens expire - implement refresh logic for production

## Next Steps for Production

1. Replace mock AI with actual YOLOv8 integration
2. Add email verification for signups
3. Implement password reset flow
4. Add rate limiting to API
5. Set up monitoring and logging
6. Configure proper CORS for production domain
7. Add HTTPS enforcement
8. Implement token refresh mechanism
