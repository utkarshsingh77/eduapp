import OpenAI from 'openai';

// Check if we're in production (deployed) or development
const isProduction = import.meta.env.PROD;

// Initialize OpenAI client only in development
let openai = null;
if (!isProduction && import.meta.env.VITE_OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Only for development
    });
}

// Helper function to make API calls
async function callOpenAI(messages, model = 'gpt-3.5-turbo', temperature = 0.7) {
    if (isProduction || !openai) {
        // Use backend API endpoint in production
        const response = await fetch('/api/openai', {
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
            throw new Error(error.error || 'API request failed');
        }

        return await response.json();
    } else {
        // Use direct OpenAI client in development
        return await openai.chat.completions.create({
            model,
            messages,
            temperature,
        });
    }
}

// Helper function to create a safe prompt
function createPrompt(systemPrompt, userContent) {
    return [
        {
            role: "system",
            content: systemPrompt
        },
        {
            role: "user",
            content: userContent
        }
    ];
}

// Generate lesson plan using OpenAI
export async function generateLessonPlan(topic, userType, gradeLevel, duration, standards, constraints) {
    const systemPrompt = `You are an expert educational content creator. Generate a detailed, standards-aligned lesson plan in HTML format. Include specific learning objectives, standards alignment, essential questions, lesson structure with time allocations, differentiation strategies, and materials needed. Make it practical and immediately usable.`;
    
    const userContent = `Create a ${duration}-minute lesson plan for ${gradeLevel} students on the topic: "${topic}".
    Educator type: ${userType}
    Standards framework: ${standards}
    ${constraints ? `Additional constraints: ${constraints}` : ''}
    
    Format the response as HTML with appropriate sections and styling classes that match the existing UI.`;

    try {
        const response = await callOpenAI(
            createPrompt(systemPrompt, userContent),
            "gpt-4o-mini",
            0.7
        );

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating lesson plan:', error);
        throw error;
    }
}

// Generate activities using OpenAI
export async function generateActivities(topic, userType, gradeLevel, duration, selectedOptions) {
    const systemPrompt = `You are an expert educational content creator. Generate engaging, age-appropriate activities for students. Include interactive activities, worksheets, and hands-on exercises. Make them practical and easy to implement.`;
    
    const options = Array.from(selectedOptions).join(', ');
    const userContent = `Create 4-5 engaging activities for ${gradeLevel} students learning about "${topic}".
    Duration available: ${duration} minutes
    Educator type: ${userType}
    ${options ? `Special requirements: ${options}` : ''}
    
    Include a mix of individual, pair, and group activities. Format as HTML with clear instructions, time allocations, and materials needed.`;

    try {
        const response = await callOpenAI(
            createPrompt(systemPrompt, userContent),
            "gpt-4o-mini",
            0.8
        );

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating activities:', error);
        throw error;
    }
}

// Generate quiz using OpenAI
export async function generateQuiz(topic, gradeLevel, assessmentType = 'standard') {
    const systemPrompt = `You are an expert assessment creator. Generate a comprehensive quiz with various question types including multiple choice, true/false, short answer, fill in the blank, and critical thinking questions. Include answer keys and rubrics where appropriate.`;
    
    const userContent = `Create a 5-question assessment quiz for ${gradeLevel} students on the topic: "${topic}".
    
    Include:
    1. One multiple choice question with 4 options
    2. One true/false question
    3. One short answer question
    4. One fill in the blank question
    5. One critical thinking/essay question
    
    Provide answer keys and sample answers. Format as HTML with appropriate styling.`;

    try {
        const response = await callOpenAI(
            createPrompt(systemPrompt, userContent),
            "gpt-4o-mini",
            0.6
        );

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating quiz:', error);
        throw error;
    }
}

// Generate substitute teacher pack using OpenAI
export async function generateSubPack(topic, gradeLevel, duration) {
    const systemPrompt = `You are creating materials for a substitute teacher who has no prior knowledge of the class or topic. Create extremely detailed, step-by-step instructions that require zero preparation. Include exact scripts, timing, and contingency plans.`;
    
    const userContent = `Create a complete substitute teacher pack for a ${duration}-minute lesson on "${topic}" for ${gradeLevel} students.
    
    Include:
    - Quick start instructions
    - Detailed minute-by-minute schedule
    - Exact teacher script (what to say)
    - Behavior management tips
    - 3 backup activities if time remains
    - Emergency procedures
    
    Make it so clear that anyone could teach this lesson successfully with no preparation.`;

    try {
        const response = await callOpenAI(
            createPrompt(systemPrompt, userContent),
            "gpt-4o-mini",
            0.7
        );

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating substitute pack:', error);
        throw error;
    }
}

// Check if API key is configured
export function isAPIKeyConfigured() {
    // In production, we use the serverless function which has the API key
    if (isProduction) {
        return true;
    }
    // In development, check for the environment variable
    return !!import.meta.env.VITE_OPENAI_API_KEY && 
           import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';
}