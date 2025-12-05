# TTB Label Verification System

## AI-Powered Alcohol Label Verification App

This application simulates the Alcohol and Tobacco Tax and Trade Bureau (TTB) label approval process. It uses AI-powered image analysis to extract text from alcohol beverage labels and verify that the information matches the submitted application form.

## Features

- **Multiple Beverage Categories**: Support for Distilled Spirits, Wine, and Beer with category-specific requirements
- **Form Input**: Enter key product information (Brand Name, Product Type, Alcohol Content, Net Contents)
- **Image Upload**: Upload and preview alcohol label images
- **AI Vision Analysis**: Analyze labels using OpenAI GPT-4 Vision
- **Smart Verification**: Intelligently compare extracted information with form data
- **Detailed Results**: Clear display of what matched, mismatched, or is missing
- **Detailed Compliance Checking**: 
  - Government warning text verification with required phrase detection
  - Category-specific validations (wine ABV ranges, sulfite declarations)
  - Severity-based issue reporting (high/medium/low)
- **Responsive Design**: Works on desktop and mobile devices
- **Dynamic Net Contents**: Add multiple content items separately (volume, proof, etc.)
- **Modular Architecture**: Clean, maintainable code structure with separation of concerns

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Inter font
- **State Management**: Custom React hooks
- **Architecture**: Component-based with service layer pattern

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **AI Engine**: OpenAI GPT-4 Vision API
- **File Handling**: Multer for image uploads
- **Security**: Environment variables with dotenv

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API Key (get one at https://platform.openai.com/api-keys)

### Installation

#### 1. Set up the Backend Server

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

#### 2. Set up the Frontend

In a new terminal:

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

#### 3. Open your browser

Navigate to `http://localhost:5173`

## Usage

### Step 1: Fill Out the Form

Enter the product information that would be submitted to TTB:

1. **Beverage Category** (required): Select from Distilled Spirits, Wine, or Beer
2. **Brand Name** (required): The brand name on the label (e.g., "Old Tom Distillery")
3. **Product Class/Type** (required): The type of beverage (adapts based on category)
   - Spirits: e.g., "Kentucky Straight Bourbon Whiskey"
   - Wine: e.g., "Cabernet Sauvignon", "Table Wine"
   - Beer: e.g., "IPA", "Lager"
4. **Alcohol Content** (required): The ABV percentage (e.g., "45")
5. **Category-Specific Fields**:
   - **Wine**: Sulfite Declaration (required) - e.g., "Contains Sulfites"
   - **Beer**: Ingredients (optional) - e.g., "Water, Barley, Hops, Yeast"
6. **Net Contents** (required): Add each content item separately
   - Click "+ Add Another Content Item" for multiple entries
   - Examples: "750 mL", "97 proof", "12 fl oz"

### Step 2: Upload Label Image

Click "Choose File" and upload a clear image of an alcohol label. The app supports:
- JPEG/JPG
- PNG
- Other common image formats

**Tips for best results:**
- Use clear, readable images
- Ensure text is visible
- Any standard photo or image will work

### Step 3: Verify

Click the "Verify Label" button. The app will:
1. Send the image to OpenAI GPT-4 Vision API
2. AI analyzes the label and extracts information
3. Compare extracted information with form inputs
4. Display detailed verification results

### Step 4: Review Results

#### Verification Details
- **Green checks** for matching information
- **Red X marks** for mismatches or missing information (with what was found)
- **Orange warnings** for compliance issues (e.g., missing government warning)

#### Compliance Issues (if any)
The system performs detailed compliance checks and reports issues by severity:
- **High Severity** (red): Critical compliance failures
  - Incomplete government warning text
  - Missing required declarations (e.g., sulfites for wine)
  - ABV outside legal ranges for product type
- **Medium Severity** (orange): Important warnings
  - Missing specific required phrases in government warning
- **Low Severity** (yellow): Informational warnings
  - Unusual ABV values that should be verified

You can also expand "View Extracted Text from Label" to see the full AI analysis.

### Error Handling

If the image cannot be processed, you'll receive helpful error messages:
- **Low Quality Image**: "Could not read text from the label image - The image quality is too low..."
- **No Label Detected**: "No label information detected - Could not detect any label information..."

**Tips for better results:**
- Use well-lit, clear images
- Ensure text is in focus
- Avoid blurry or heavily compressed images
- Make sure the entire label is visible

## Example Test Cases

### Test Case 1: Matching Label
**Form Input:**
- Brand Name: Old Tom Distillery
- Product Type: Kentucky Straight Bourbon Whiskey
- Alcohol Content: 45
- Net Contents: 750 mL

**Expected Result:** All fields match

### Test Case 2: Mismatched Brand
**Form Input:**
- Brand Name: Tom's Distillery
- Product Type: Bourbon Whiskey
- Alcohol Content: 45

**Label Shows:** Old Tom Distillery

**Expected Result:** Brand name mismatch

### Test Case 3: Missing Warning
**Label:** Contains brand, type, and ABV but no government warning

**Expected Result:** Warning about missing government warning

## How It Works

### AI Vision Analysis
The app uses OpenAI's GPT-4 Vision API to analyze label images:
- Advanced AI understands context and variations
- Analyzes images like a human would
- **Secure**: API key stored on backend server only
- Fast and accurate results

### Architecture
- **Frontend (React)**: User interface, form handling, and result display
- **Backend (Express)**: Secure API endpoint that handles OpenAI API calls
- **OpenAI GPT-4 Vision**: AI model that analyzes the label images

### Verification Logic

1. **AI Analysis**: GPT-4 Vision extracts all relevant information from the label
2. **Intelligent Matching**: 
   - AI understands context and variations in text
   - Handles different fonts, styles, and layouts
   - Recognizes various formats (e.g., "45%", "45% ABV", "Alc./Vol. 45%")
   - Identifies units (mL, L, oz, fl oz) automatically
3. **Compliance Check**: Verifies presence of required government warning text

## Compliance Checks Implemented

### Government Warning Verification
- Checks for presence of critical safety information (case-insensitive):
  - "Surgeon General"
  - "pregnancy"
  - "birth defects"
  - "drive"
  - "health problems"
- Focuses on content presence rather than exact formatting

### Category-Specific Validations

#### Wine
- **Sulfite Declaration**: Required (e.g., "Contains Sulfites")
- **Table Wine ABV**: Must be 7-14% if labeled as "Table Wine"

#### Beer
- **ABV Range**: Flags unusual values outside 3-12% range
- **Ingredients**: Optional but checked if provided

#### Distilled Spirits
- **Minimum ABV**: Must be at least 20% ABV
- **Proof**: Optional but common (e.g., "90 Proof")

## Project Structure

### Frontend (frontend/)
```
frontend/
├── src/
│   ├── components/          # UI Components
│   │   ├── Header.tsx       # Application header
│   │   ├── ProductForm.tsx  # Form for product data entry
│   │   └── VerificationResults.tsx  # Results display
│   ├── hooks/               # Custom React hooks
│   │   ├── useFormData.ts   # Form state management
│   │   ├── useImageUpload.ts # Image handling
│   │   └── useVerification.ts # Verification logic
│   ├── services/            # API communication
│   │   └── api.ts           # Backend API calls
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Type interfaces
│   ├── constants/           # App constants
│   │   └── index.ts         # Configuration values
│   ├── App.tsx              # Main app component (74 lines)
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind configuration
├── package.json             # Dependencies and scripts
└── vite.config.ts           # Vite configuration
```

### Backend (backend/)
```
backend/
├── config/                  # Configuration
│   └── index.js             # App config and validation
├── constants/               # Backend constants
│   └── index.js             # Compliance rules
├── controllers/             # Request handlers
│   └── verification.controller.js  # Verification endpoint
├── middleware/              # Express middleware
│   ├── error.middleware.js  # Error handling
│   └── upload.middleware.js # File upload config
├── routes/                  # Route definitions
│   └── verification.routes.js # API routes
├── services/                # Business logic
│   ├── compliance.service.js # TTB compliance checks
│   ├── openai.service.js    # AI integration
│   └── validation.service.js # Input validation
├── utils/                   # Utilities
│   └── errors.js            # Error handling
├── server.js                # Express app entry (28 lines)
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

This app can be easily deployed to:
- **Vercel**: `npm run build` then deploy the `dist` folder
- **Netlify**: Connect your GitHub repo or upload the `dist` folder
- **GitHub Pages**: Use `gh-pages` package
- **Any static hosting**: Just upload the contents of `dist` folder

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Known Limitations

As this is a demonstration application:

1. **API Costs**: Each verification call uses OpenAI's GPT-4 Vision API, which has associated costs per request.

2. **Government Warning**: Checks for presence of critical safety information (case-insensitive) rather than exact regulatory text matching.

3. **Rate Limits**: Subject to OpenAI API rate limits based on your account tier.

4. **Internet Required**: Requires active internet connection to call OpenAI API.

5. **CORS**: Currently configured for local development only. Production deployment requires proper CORS configuration.

6. **Local Storage**: No database - verification results are not persisted between sessions.

## Future Enhancements

Given more time, the following could be added:

- Multi-language support
- Save/load previous verifications with user accounts
- Batch processing of multiple labels
- Label region highlighting on image
- Email report generation
- Analytics dashboard for verification history
- Switch between different AI models (GPT-4, Claude, etc.)
- Mobile app version
- Fallback to Tesseract OCR when API is unavailable
- Unit and integration testing
- Admin dashboard for system monitoring

## Approach & Design Decisions

### Why OpenAI GPT-4 Vision?
- **Accuracy**: Far superior to traditional OCR, especially with stylized text
- **Context Understanding**: AI understands context and intent, not just text extraction
- **Flexibility**: Handles various label formats, fonts, and layouts
- **Proven Technology**: Industry-leading vision model

### Why Backend Server?
- **Security**: API keys never exposed to client
- **Control**: Centralized API usage monitoring and rate limiting
- **Best Practice**: Industry-standard architecture for API key management
- **Scalability**: Easy to add authentication, logging, and other middleware

### Why React + TypeScript?
- **Type Safety**: Catches errors during development
- **Component Architecture**: Easy to maintain and extend
- **Modern Tooling**: Fast development with Vite
- **Industry Standard**: Widely used and well-documented

### Why This Verification Approach?
- **AI-Powered**: Leverages advanced AI for intelligent analysis
- **Clear Feedback**: Users see exactly what matched and what was found on the label
- **Extensible**: Easy to add more checks and rules to the AI prompt

## Assumptions

1. **API Access**: User has a valid OpenAI API key configured on the backend
2. **Language**: All labels are in English (though GPT-4 supports many languages)
3. **Format Flexibility**: AI understands various text formats and styles
4. **Required Fields**: Brand Name, Product Type, Alcohol Content, and Net Contents are all required
5. **Category Requirements**: Category-specific fields (sulfite declaration for wine) are enforced
6. **Compliance Checking**: Focuses on presence of critical safety information rather than exact regulatory text
7. **Backend Server**: Backend server must be running for the application to work

## Contributing

This is a demo project for a take-home assignment. For production use, consider:
- Moving API calls to a secure backend
- Adding comprehensive error handling
- Implementing rate limiting and cost controls
- Adding user authentication
- Creating environment variable management
- Adding automated testing

## License

This project is created as a demonstration for a take-home assignment.

## Architecture Highlights

### Modular Design
- **Separation of Concerns**: Components, hooks, services, and types are clearly separated
- **Reusability**: Custom hooks and services can be easily reused
- **Maintainability**: Small, focused files (App.tsx is only 74 lines, server.js is only 28 lines)
- **Scalability**: Easy to add new features without modifying existing code
- **Type Safety**: Comprehensive TypeScript types throughout

### Design Patterns
- **Custom Hooks Pattern**: Business logic separated from UI components
- **Service Layer Pattern**: API calls centralized in services
- **Component Composition**: Small, focused components
- **MVC Pattern**: Backend follows Model-View-Controller architecture
- **Error Handling**: Centralized error handling with specific error codes

## Contact

For questions or feedback about this implementation, please reach out to the developer.

---

**Built using React, TypeScript, Tailwind CSS, Node.js, Express, and OpenAI GPT-4 Vision**
