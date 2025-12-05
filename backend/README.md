# TTB Label Verification Backend

Backend API server for the TTB Label Verification application. This server handles OpenAI API calls securely, keeping the API key on the server side.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001` by default.

## API Endpoints

### Health Check
```
GET /health
```

Returns server status.

### Verify Label
```
POST /api/verify-label
```

**Content-Type:** `multipart/form-data`

**Body Parameters:**
- `image` (file): The label image file
- `beverageCategory` (string): Category of beverage ('spirits', 'wine', or 'beer')
- `brandName` (string): Expected brand name
- `productType` (string): Expected product type/class
- `alcoholContent` (string): Expected ABV percentage
- `netContents` (string, JSON array): Expected volumes/proofs
- `sulfiteDeclaration` (string, wine only): Expected sulfite text
- `ingredients` (string, beer only, optional): Expected ingredients

**Success Response:**
```json
{
  "success": true,
  "data": {
    "extractedText": "...",
    "brandNameMatch": true,
    "productTypeMatch": true,
    "alcoholContentMatch": true,
    "netContentsMatch": true,
    "governmentWarningFound": true,
    "brandNameFound": "...",
    "productTypeFound": "...",
    "alcoholContentFound": "...",
    "netContentsFound": "..."
  }
}
```

**Error Responses:**
- **400 Bad Request** - Missing or invalid parameters
- **400 Bad Request (UNREADABLE_IMAGE)** - Image quality too low or no text detected
- **400 Bad Request (NO_LABEL_DETECTED)** - No label information found in image
- **500 Internal Server Error** - Server or API error

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3001)

## Security Notes

- The `.env` file is gitignored and should never be committed
- API keys are only stored on the server side
- CORS is enabled for local development (configure for production)
- File upload size is limited to 10MB

## Features

### Detailed Compliance Checks
- **Exact Government Warning Verification**: Checks for all required phrases and proper capitalization
- **Category-Specific Validation**:
  - Wine: Sulfite declaration required, Table Wine ABV range (7-14%)
  - Beer: Typical ABV range (3-12%), optional ingredients
  - Spirits: Minimum 20% ABV
- **Severity-Based Reporting**: Issues flagged as high/medium/low severity

### Multiple Beverage Categories
- Support for Distilled Spirits, Wine, and Beer
- Dynamic field requirements based on category
- Category-specific compliance rules

## Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **dotenv** - Environment variable management
- **openai** - OpenAI API client
- **multer** - File upload handling

