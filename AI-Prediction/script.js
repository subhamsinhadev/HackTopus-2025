const uploadForm = document.getElementById('uploadForm');
const resultSection = document.getElementById('resultSection');
const severityLevel = document.getElementById('severityLevel');
const confidenceScore = document.getElementById('confidenceScore');
const riskAssessment = document.getElementById('riskAssessment');
const resultCard = document.getElementById('resultCard');

uploadForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        severityLevel.textContent = `Severity: ${data.severity}`;
        confidenceScore.textContent = `Confidence: ${data.confidence}%`;

        if (data.severity === 'Flood' || data.severity === 'Cyclone' || data.severity === 'Wildfire' || data.severity === 'Earthquake') {
            riskAssessment.textContent = `Risk: Evacuate Immediately`;
            resultCard.style.background = "linear-gradient(135deg, #ff0844, #ffb199)";
        } else {
            riskAssessment.textContent = `Risk: No immediate danger`;
            resultCard.style.background = "linear-gradient(135deg, #a1ffce, #faffd1)";
        }

        resultSection.style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        alert('Prediction failed. Please try again.');
    }
});
