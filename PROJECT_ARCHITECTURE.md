# TTB Label Verification System - Project Architecture

## 📁 Project Structure

This document outlines the modular architecture of the TTB Label Verification System.

---

## Frontend Architecture (`frontend/src/`)

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductForm.tsx
│   └── VerificationResults.tsx
├── hooks/               # Custom React hooks
│   ├── useFormData.ts
│   ├── useImageUpload.ts
│   └── useVerification.ts
├── services/            # API communication layer
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── constants/           # Application constants
│   └── index.ts
├── App.tsx             # Main application component (74 lines!)
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

### Component Responsibilities

#### `components/`
- **Header.tsx**: Application header with title and branding
- **Footer.tsx**: Footer with credits and tech stack info
- **ProductForm.tsx**: Complete form for inputting product data and uploading images
  - Handles beverage category selection
  - Dynamic net contents fields
  - Category-specific fields (sulfite declaration, ingredients)
  - Image upload and preview
- **VerificationResults.tsx**: Displays verification results
  - Shows match/mismatch status
  - Lists detailed verification results
  - Displays compliance issues
  - Expandable extracted text section

#### `hooks/`
- **useFormData.ts**: Manages all form state and validation
  - Form data state management
  - Input change handlers
  - Dynamic field management
  - Form validation
  - Form reset functionality

- **useImageUpload.ts**: Handles image file uploads
  - File selection and storage
  - Image preview generation
  - Image reset functionality

- **useVerification.ts**: Manages verification process
  - API communication via service layer
  - Progress animation management
  - Result state management
  - Error handling with specific error codes
  - Result formatting and display logic

#### `services/`
- **api.ts**: Centralized API communication
  - `verifyLabel()`: Main API call to backend
  - Error handling with specific error codes
  - Type-safe request/response handling

#### `types/`
- **index.ts**: TypeScript type definitions
  - `FormData`: Form input data structure
  - `VerificationResult`: Verification response structure
  - `ComplianceIssue`: Compliance issue structure
  - All API-related types

#### `constants/`
- **index.ts**: Application-wide constants
  - API URLs
  - Beverage categories
  - Form placeholders
  - Error codes
  - Progress animation configuration

---

## Backend Architecture (`backend/`)

### Directory Structure

```
backend/
├── config/                  # Configuration management
│   └── index.js
├── constants/               # Backend constants
│   └── index.js
├── controllers/             # Request handlers
│   └── verification.controller.js
├── middleware/              # Express middleware
│   ├── error.middleware.js
│   └── upload.middleware.js
├── routes/                  # Route definitions
│   └── verification.routes.js
├── services/                # Business logic layer
│   ├── compliance.service.js
│   ├── openai.service.js
│   └── validation.service.js
├── utils/                   # Utility functions
│   └── errors.js
├── server.js               # Application entry point (28 lines!)
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```

### Module Responsibilities

#### `config/`
- **index.js**: Configuration management
  - Loads environment variables
  - Validates configuration
  - Exports configuration object

#### `constants/`
- **index.js**: Backend constants
  - Government warning keywords
  - Wine/Beer/Spirits compliance rules
  - Beverage category enums

#### `controllers/`
- **verification.controller.js**: Request handling
  - `healthCheck()`: Health check endpoint
  - `verifyLabel()`: Main verification endpoint
  - Orchestrates services
  - Response formatting

#### `middleware/`
- **error.middleware.js**: Error handling
  - Global error handler
  - 404 handler
  - AppError formatting

- **upload.middleware.js**: File upload handling
  - Multer configuration
  - File size limits
  - Memory storage setup

#### `routes/`
- **verification.routes.js**: Route definitions
  - `/health`: Health check
  - `/api/verify-label`: Label verification
  - Route-level middleware attachment

#### `services/`
- **openai.service.js**: AI integration
  - OpenAI API client setup
  - Prompt engineering
  - Image analysis via GPT-4 Vision
  - Response parsing

- **compliance.service.js**: TTB compliance checking
  - Government warning validation
  - Wine-specific rules (ABV, sulfites)
  - Beer-specific rules (ABV ranges)
  - Spirits-specific rules (minimum ABV)
  - Compliance issue generation

- **validation.service.js**: Input validation
  - Request validation
  - Image quality validation
  - Label detectability checks
  - Net contents parsing

#### `utils/`
- **errors.js**: Error handling utilities
  - `AppError` class for operational errors
  - Error code constants
  - OpenAI error handler

---

## Data Flow

### Verification Flow

```
1. User fills form → ProductForm component
2. Form submission → useVerification hook
3. API call → services/api.ts
4. Backend receives request → routes/verification.routes.js
5. Validation → validation.service.js
6. Image analysis → openai.service.js
7. Compliance checks → compliance.service.js
8. Response formatting → verification.controller.js
9. Frontend processes result → useVerification hook
10. Results displayed → VerificationResults component
```

### Error Handling Flow

```
1. Error occurs in any service
2. AppError thrown with code
3. Error caught in controller
4. Passed to error middleware
5. Formatted response sent to frontend
6. Frontend checks error code
7. User-friendly message displayed
```

---

## Key Design Patterns

### Frontend

1. **Custom Hooks Pattern**: Business logic separated from UI
2. **Service Layer Pattern**: API calls centralized in services
3. **Component Composition**: Small, focused components
4. **Type Safety**: Comprehensive TypeScript types
5. **Single Responsibility**: Each module has one clear purpose

### Backend

1. **MVC Pattern**: Models (implicit), Views (JSON), Controllers
2. **Service Layer Pattern**: Business logic in services
3. **Middleware Chain**: Request processing pipeline
4. **Error Handling**: Centralized error handling
5. **Dependency Injection**: Services injected into controllers

---

## Benefits of This Architecture

### Maintainability
- **Small files**: Easy to understand and modify
- **Clear separation**: Each module has a single responsibility
- **Type safety**: TypeScript catches errors at compile time

### Scalability
- **Easy to extend**: Add new components/services without touching existing code
- **Testable**: Each module can be tested independently
- **Reusable**: Components and services can be reused

### Developer Experience
- **Easy navigation**: Find code quickly with clear structure
- **Self-documenting**: File names and structure explain purpose
- **Predictable**: Consistent patterns throughout

### Code Quality
- **DRY principle**: No code duplication
- **SOLID principles**: Single responsibility, dependency inversion
- **Clean code**: Readable, maintainable, professional

---

## Development Guidelines

### Adding New Features

1. **Frontend Component**: Add to `components/`
2. **Frontend Logic**: Add hook to `hooks/`
3. **API Endpoint**: Add to `services/api.ts`
4. **Backend Route**: Add to `routes/`
5. **Backend Controller**: Add handler to `controllers/`
6. **Business Logic**: Add to appropriate `services/`

### File Naming Conventions

- **Components**: PascalCase (e.g., `ProductForm.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useFormData.ts`)
- **Services**: camelCase with '.service' suffix (e.g., `openai.service.js`)
- **Types**: lowercase (e.g., `index.ts`)
- **Constants**: lowercase (e.g., `index.ts`)

---

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- OpenAI GPT-4 Vision API
- Multer (file uploads)

### Development Tools
- ESLint
- TypeScript Compiler
- Git

---

## Performance Optimizations

1. **Progress Animation**: Smooth UI feedback during AI processing
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: Prevent unnecessary re-renders
4. **Error Recovery**: Graceful error handling without crashes

---

## Security Considerations

1. **API Key Protection**: Environment variables, server-side only
2. **Input Validation**: All inputs validated before processing
3. **File Upload Limits**: Size restrictions on uploads
4. **Error Messages**: No sensitive data in error responses
5. **CORS Configuration**: Controlled cross-origin access

---

## Future Enhancements

### Potential Additions
1. **Unit Tests**: Jest/Vitest for frontend, Mocha/Jest for backend
2. **Integration Tests**: E2E testing with Playwright
3. **Database Layer**: Store verification history
4. **User Authentication**: Multi-user support
5. **Image Highlighting**: Visual markup of detected elements
6. **Batch Processing**: Multiple label verification
7. **Export Reports**: PDF/Excel report generation
8. **Admin Dashboard**: System monitoring and analytics

---

*This architecture follows industry best practices and is designed for long-term maintainability and scalability.*

