# EduForge: AI Lesson & Quiz Builder

A modern web application that helps educators create standards-aligned lesson plans, activities, and assessments in under 2 minutes.

## Features

- **AI-Powered Generation**: Create comprehensive lesson plans with a single click
- **Standards Alignment**: Supports Common Core, NGSS, NCSS, CASEL, and custom standards
- **Multiple Educator Types**: Designed for teachers, substitutes, counselors, coaches, and therapists
- **Interactive Activities**: Generate hands-on learning experiences
- **Assessment Tools**: Create quizzes with multiple question types
- **Substitute Teacher Packs**: Complete, print-ready lesson materials
- **Export Options**: Export to Google Forms, LMS systems, or download as JSON

## Project Structure

```
eduapp/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # All CSS styles
├── js/
│   └── app.js             # All JavaScript functionality
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository** (or download the files)
   ```bash
   git clone <repository-url>
   cd eduapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure OpenAI API key**
   - Copy `.env.example` to `.env`
   - Replace `your_openai_api_key_here` with your actual OpenAI API key
   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will open automatically in your browser at http://localhost:3000

### Production Build

To build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Using the Application

1. **Fill in the form**: Enter your topic, select educator type, grade level, and duration
2. **Choose options**: Select quick options like "Differentiated", "Interactive", etc.
3. **Generate content**: Click "Generate Lesson & Materials" to create your lesson plan using AI
4. **Explore tabs**: Switch between Lesson Plan, Activities, Quiz, and Sub Pack tabs
5. **Export**: Use the export buttons to save or share your materials

## Usage

### Input Panel
- **Topic**: Enter any learning objective or subject matter
- **Educator Type**: Choose your role (Teacher, Substitute, Counselor, Coach, Therapist)
- **Grade Level**: Select appropriate age group (K-2, 3-5, 6-8, 9-12, Adult)
- **Duration**: Set lesson length (15-90 minutes)
- **Standards**: Choose relevant educational standards framework
- **Quick Options**: Toggle additional features like differentiation, interactivity, etc.

### Output Tabs
- **Lesson Plan**: Complete lesson structure with objectives, standards, and timeline
- **Activities**: Interactive exercises and worksheets
- **Quiz**: Assessment questions with answer keys
- **Sub Pack**: Substitute teacher instructions and materials

### Export Options
- **Google Forms**: Export quiz to Google Forms format
- **LMS Export**: Download in QTI format for Canvas/Blackboard/Moodle
- **Print All**: Print-friendly version of all materials
- **JSON Download**: Download all data for external processing

## Technical Details

- **Vite**: Modern build tool for fast development and optimized production builds
- **OpenAI API Integration**: Real AI-powered content generation using GPT-4
- **ES Modules**: Modern JavaScript module system
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern CSS**: Uses CSS Grid, Flexbox, and CSS Custom Properties
- **Async/Await**: Clean asynchronous code for API calls

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

To modify the application:

1. **Styling**: Edit `styles/main.css` for visual changes
2. **Core Functionality**: Modify `js/app.js` for behavior changes
3. **AI Integration**: Update `js/openai-service.js` for AI generation logic
4. **Structure**: Update `index.html` for layout changes
5. **Configuration**: Update `vite.config.js` for build settings

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Environment Variables

The app uses the following environment variables:
- `VITE_OPENAI_API_KEY` - Your OpenAI API key (required)
- `VITE_OPENAI_ORG_ID` - Your OpenAI organization ID (optional)

## Future Enhancements

- User accounts and lesson plan saving in the cloud
- Backend API to secure API keys and add rate limiting
- Collaborative features for team lesson planning
- Additional export formats (PDF, Word, PowerPoint)
- Template library for common lesson types
- Support for multiple AI models (Claude, Gemini, etc.)
- Offline mode with cached content
- Multi-language support

## License

This project is open source and available under the MIT License. 