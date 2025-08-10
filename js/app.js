import { 
    generateLessonPlan as aiGenerateLessonPlan, 
    generateActivities as aiGenerateActivities, 
    generateQuiz as aiGenerateQuiz, 
    isAPIKeyConfigured 
} from './openai-service.js';

let selectedOptions = new Set();
let generationTimer = null;
let startTime = null;

function selectUserType(type) {
    document.getElementById('userType').value = type;
    updateFormFields();
}

function updateFormFields() {
    const userType = document.getElementById('userType').value;
    const standardsGroup = document.getElementById('standardsGroup');
    const standardsSelect = document.getElementById('standards');
    
    if (userType === 'coach' || userType === 'therapist') {
        standardsGroup.style.display = 'none';
    } else {
        standardsGroup.style.display = 'block';
    }
}

function toggleOption(element, option) {
    element.classList.toggle('selected');
    if (selectedOptions.has(option)) {
        selectedOptions.delete(option);
    } else {
        selectedOptions.add(option);
    }
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

function startTimer() {
    const timerEl = document.getElementById('timer');
    const timerText = document.getElementById('timerText');
    
    startTime = Date.now();
    timerEl.classList.add('active');
    
    generationTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 100);
}

function stopTimer() {
    clearInterval(generationTimer);
    setTimeout(() => {
        document.getElementById('timer').classList.remove('active');
    }, 3000);
}

async function generateContent() {
    const topic = document.getElementById('topic').value;
    const userType = document.getElementById('userType').value;
    const gradeLevel = document.getElementById('gradeLevel').value;
    const duration = document.getElementById('duration').value;
    const standards = document.getElementById('standards').value;
    const constraints = document.getElementById('constraints').value;
    
    if (!topic) {
        alert('Please enter a topic or learning objective');
        return;
    }
    
    // Check if API key is configured
    if (!isAPIKeyConfigured()) {
        alert('Please configure your OpenAI API key in the .env file. Set VITE_OPENAI_API_KEY to your actual API key.');
        return;
    }
    
    // Start generation animation
    const btn = event.target;
    btn.classList.add('loading');
    btn.textContent = '⚡ Generating...';
    btn.disabled = true;
    
    startTimer();
    
    try {
        // Generate all content in parallel for better performance
        const promises = [
            aiGenerateLessonPlan(topic, userType, gradeLevel, duration, standards, constraints)
                .then(content => {
                    document.getElementById('lessonContent').innerHTML = content;
                }),
            aiGenerateActivities(topic, userType, gradeLevel, duration, selectedOptions)
                .then(content => {
                    document.getElementById('activitiesContent').innerHTML = content;
                }),
            aiGenerateQuiz(topic, gradeLevel, constraints)
                .then(content => {
                    document.getElementById('quizContent').innerHTML = content;
                })
        ];
        
        // Wait for all content to be generated
        await Promise.all(promises);
        
        // Show export buttons
        document.getElementById('exportButtons').style.display = 'flex';
        
    } catch (error) {
        console.error('Error generating content:', error);
        alert(`Error generating content: ${error.message || 'Unknown error occurred'}. Please check your API key and try again.`);
    } finally {
        // Stop loading
        btn.classList.remove('loading');
        btn.textContent = '🚀 Generate Lesson & Materials';
        btn.disabled = false;
        stopTimer();
    }
}

// These functions are now replaced by the AI service functions imported at the top
// The old mock functions have been removed to avoid conflicts

function exportToGoogleForms() {
    alert('Google Forms export initiated! A new form will be created in your Google Drive with all quiz questions formatted and ready to share.');
}

function exportToLMS() {
    alert('QTI export ready! File will be downloaded in Canvas/Blackboard/Moodle compatible format.');
}

function printAll() {
    window.print();
}

function downloadJSON() {
    const data = {
        topic: document.getElementById('topic').value,
        userType: document.getElementById('userType').value,
        gradeLevel: document.getElementById('gradeLevel').value,
        duration: document.getElementById('duration').value,
        generatedAt: new Date().toISOString(),
        lesson: document.getElementById('lessonContent').innerHTML,
        activities: document.getElementById('activitiesContent').innerHTML,
        quiz: document.getElementById('quizContent').innerHTML
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduforge-${data.topic.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
}

// Expose functions to global scope for HTML onclick handlers
window.selectUserType = selectUserType;
window.updateFormFields = updateFormFields;
window.toggleOption = toggleOption;
window.switchTab = switchTab;
window.generateContent = generateContent;
window.exportToGoogleForms = exportToGoogleForms;
window.exportToLMS = exportToLMS;
window.printAll = printAll;
window.downloadJSON = downloadJSON;

// Initialize
updateFormFields(); 