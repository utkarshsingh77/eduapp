// Secure version of OpenAI service that uses backend API in production

const isProduction = import.meta.env.PROD;
const apiEndpoint = isProduction ? '/api/openai' : null;

// For development, we'll still use the direct OpenAI client
let openai = null;
if (!isProduction && import.meta.env.VITE_OPENAI_API_KEY) {
    const OpenAI = await import('openai');
    openai = new OpenAI.default({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });
}

// Helper function to make API calls
async function callOpenAI(messages, model = 'gpt-3.5-turbo', temperature = 0.7) {
    if (isProduction || !openai) {
        // Use backend API
        const response = await fetch(apiEndpoint || '/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                model,
                temperature
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return await response.json();
    } else {
        // Use direct OpenAI client for development
        const response = await openai.chat.completions.create({
            model,
            messages,
            temperature,
        });
        return response;
    }
}

// Export the same interface as the original service
export async function generateLessonPlan(topic, userType, gradeLevel, duration, standards, options, constraints) {
    const systemPrompt = `You are an expert educator and curriculum designer...`; // Use existing prompt
    const userContent = `Create a lesson plan...`; // Use existing content construction
    
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
    ];

    try {
        const response = await callOpenAI(messages);
        const content = response.choices[0].message.content;
        return parseLessonPlanResponse(content);
    } catch (error) {
        console.error('Error generating lesson plan:', error);
        throw error;
    }
}

// ... Rest of the functions follow the same pattern ...

export function validateAPIKey() {
    if (isProduction) {
        // In production, we assume the backend handles API key validation
        return true;
    }
    return !!import.meta.env.VITE_OPENAI_API_KEY &&
           import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';
}