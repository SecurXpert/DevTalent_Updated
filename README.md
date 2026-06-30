# DevTalent - Online Examination Platform

A comprehensive web-based examination platform built with React, TypeScript, and Tailwind CSS for conducting coding exams, MCQ tests, and managing educational content.

## 🚀 Features

### 🎯 Core Functionality
- **Multi-type Exam Support**: Coding exams, MCQ tests, and image analysis questions
- **User Management**: Student and admin authentication with role-based access
- **Course Management**: Create, edit, and organize courses with exam assignments
- **Real-time Exam Interface**: Interactive coding environment with syntax highlighting
- **Performance Analytics**: Detailed reports and result tracking
- **Certificate Generation**: Automated certificate creation for successful candidates

### 🛠 Technical Features
- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety and better development experience
- **API Integration**: RESTful API with proper error handling
- **Responsive Design**: Mobile-friendly interface
- **Firebase Integration**: Authentication and data persistence

## 📋 Project Structure

```
src/
├── pages/                    # Main application pages
│   ├── Login.tsx            # User authentication
│   ├── Dashboard/           # Admin dashboard
│   ├── Courses/            # Course management
│   ├── Exams/              # Exam creation and management
│   │   ├── Codding/        # Coding exam components
│   │   └── Shared/         # Shared exam components
│   ├── Students/           # Student management
│   └── Results/           # Results and reports
├── components/             # Reusable UI components
├── contexts/              # React contexts for state management
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
```

## 🔄 Application Flow

### 1. Authentication Flow
```
Login Page → Token Validation → Role-based Redirect
    ↓
Admin → Dashboard
Student → Student Dashboard
```

### 2. Course Management Flow
```
Dashboard → Courses Page → Create/Edit Course
    ↓
Course Details → Assign Exams → Publish
```

### 3. Exam Creation Flow
```
Dashboard → Create Exam → Select Type
    ↓
Coding Exam:
  - Basic Details (name, duration, marks)
  - Add Questions (problem statement, I/O, constraints)
  - Set Difficulty & Time Limits
  - Configure Schedule (active/inactive)
  - Save & Publish
```

### 4. Student Exam Flow
```
Student Dashboard → Available Exams → Start Exam
    ↓
Exam Interface:
  - Question Display
  - Code Editor (for coding exams)
  - Timer
  - Submit Answers
    ↓
Results → Certificate Generation
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

```bash
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd DevTalent_Updated

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://192.168.0.144:8000
VITE_FIREBASE_CONFIG=your_firebase_config
```

## 📚 Key Components

### Authentication System
- **Login.tsx**: Main login interface with role selection
- **Adminlogin.tsx**: Admin-specific authentication
- **ProfileContext**: User session management

### Course Management
- **CoursesPage.tsx**: List and manage all courses
- **CreateCoursePage.tsx**: Create new courses with type selection
- **EditCoursePage.tsx**: Edit existing course details

### Exam Management
- **CoddingPage.tsx**: Main coding exam creation interface
- **CodingQuestionEditor.tsx**: Individual question editor with:
  - Problem statement
  - Input/output format
  - Constraints
  - Sample I/O
  - Difficulty selection
  - Time limit
  - Description
- **CodingExamSchedule.tsx**: Exam scheduling and activation

### Student Interface
- **StudentDashboard.tsx**: Student main interface
- **OnlineCompiler.tsx**: In-browser code execution
- **MCQPaper.tsx**: MCQ exam interface

## 🔌 API Integration

### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration

### Course Management
- `GET /admin/catalog/courses` - List all courses
- `POST /admin/catalog/courses` - Create new course
- `PUT /admin/catalog/courses/{id}` - Update course
- `DELETE /admin/catalog/courses/{id}` - Delete course
- `GET /admin/catalog/course-types` - Get course types

### Exam Management
- `POST /ind/coding/admin/exams` - Create coding exam
- `POST /ind/coding/admin/exams/{id}/questions` - Add questions to exam

## 🎨 UI Components

### Built with shadcn/ui
- **InputField**: Custom input with validation
- **TextAreaField**: Multi-line text input
- **Button**: Styled buttons with variants
- **Dialog**: Modal dialogs
- **Dropdown**: Select components
- **Toast**: Notification system

### Custom Components
- **SidebarLayout**: Navigation sidebar
- **QuestionEditor**: Interactive question creation
- **CodeEditor**: Syntax-highlighted code editor
- **ResultCard**: Result display component

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## 🚀 Deployment

### Development
- Uses Vite dev server with hot reload
- Proxy configuration for API calls
- HTTPS support with mkcert

### Production
- Static build generation
- Firebase hosting support
- Environment-specific configurations

## 📊 Data Flow

### Authentication Flow
1. User enters credentials
2. API validates and returns JWT token
3. Token stored in localStorage
4. Subsequent requests include Authorization header
5. Role-based route protection

### Exam Creation Flow
1. Admin fills exam details
2. Questions added with validation
3. API call to create exam
4. Questions uploaded separately
5. Exam activated/deactivated via toggle

### Student Exam Flow
1. Student views available exams
2. Starts exam with timer
3. Answers submitted
4. Results calculated
5. Certificate generated

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Secure API endpoints

## 🎯 Future Enhancements

- Real-time collaboration
- Advanced code evaluation
- Plagiarism detection
- Mobile app development
- Video proctoring
- Advanced analytics dashboard

## 📞 Support

For technical support or questions:
- Check the documentation
- Review the code comments
- Contact the development team

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cb3d6145-cb9d-4bf4-a634-4619f13aba72) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cb3d6145-cb9d-4bf4-a634-4619f13aba72) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
