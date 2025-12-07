console.log("script.js loaded!");
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form submission
    const bpForm = document.getElementById('bpForm');
    const resultSection = document.getElementById('resultSection');
    let bpChart = null;
    
    bpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const age = parseInt(document.getElementById('age').value);
        const weight = parseInt(document.getElementById('weight').value);
        const height = parseInt(document.getElementById('height').value);
        const gender = document.querySelector('input[name="gender"]:checked').value;
        // Call API for prediction
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                age: age,
                weight: weight,
                height: height,
                gender: gender
            }),
        })
        .then(response => response.json())
        .then(prediction => {
            if (prediction.error) {
                alert('Error: ' + prediction.error);
                return;
            }
            displayResults(prediction);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while predicting blood pressure');
        });
resultSection.classList.remove('hidden');
        resultSection.classList.add('animate-fade-in');
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Download report button
    document.getElementById('downloadBtn').addEventListener('click', function() {
        // In a real app, this would generate and download a PDF report
        alert('Report download functionality would be implemented here with a proper PDF generation library.');
    });
// Display results with chart
    function displayResults(prediction) {
        const { systolic, diastolic, status } = prediction;
        
        // Update the predicted BP display
        document.getElementById('predictedBP').textContent = `${systolic}/${diastolic}`;
        
        // Update status display
        const bpStatusElement = document.getElementById('bpStatus');
        bpStatusElement.className = 'p-3 rounded-lg ' + status + '-bp';
        
        let statusText = '';
        if (status === 'normal') {
            statusText = 'Your blood pressure is within the normal range. Keep maintaining your healthy lifestyle!';
        } else if (status === 'elevated') {
            statusText = 'Your blood pressure is slightly elevated. Consider making some lifestyle changes.';
        } else if (status === 'high') {
            statusText = 'Your blood pressure is high. Please consult with a healthcare professional.';
        } else {
            statusText = 'Your blood pressure is low. Make sure to stay hydrated and monitor your symptoms.';
        }
        bpStatusElement.innerHTML = `<strong>${status.toUpperCase()} BLOOD PRESSURE</strong>: ${statusText}`;
        
        // Update diet recommendations
        const goodDietElement = document.getElementById('goodDiet');
        const badDietElement = document.getElementById('badDiet');
        
        if (status === 'high' || status === 'elevated') {
            goodDietElement.innerHTML = `
                <li>Leafy green vegetables</li>
                <li>Berries</li>
                <li>Oatmeal</li>
                <li>Garlic</li>
                <li>Fatty fish</li>
                <li>Beets</li>
                <li>Dark chocolate</li>
            `;
            badDietElement.innerHTML = `
                <li>Salty foods</li>
                <li>Processed meats</li>
                <li>Canned soups</li>
                <li>Fried foods</li>
                <li>Alcohol</li>
                <li>Caffeine</li>
                <li>Sugary drinks</li>
            `;
        } else if (status === 'low') {
            goodDietElement.innerHTML = `
                <li>Small, frequent meals</li>
                <li>More fluids</li>
                <li>Salty foods (in moderation)</li>
                <li>Caffeine (in moderation)</li>
                <li>Licorice tea</li>
            `;
            badDietElement.innerHTML = `
                <li>Large, heavy meals</li>
                <li>Alcohol</li>
                <li>High-carb meals</li>
            `;
        } else {
            goodDietElement.innerHTML = `
                <li>Balanced diet</li>
                <li>Fruits & vegetables</li>
                <li>Whole grains</li>
                <li>Lean proteins</li>
            `;
            badDietElement.innerHTML = `
                <li>Excess salt</li>
                <li>Processed foods</li>
                <li>Trans fats</li>
            `;
        }
        
        // Update exercise recommendations
        const exercisesElement = document.getElementById('exercises');
        
        if (status === 'high' || status === 'elevated') {
            exercisesElement.innerHTML = `
                <li>30 min brisk walking daily</li>
                <li>Swimming</li>
                <li>Cycling</li>
                <li>Yoga (especially relaxation poses)</li>
                <li>Avoid heavy weight lifting</li>
            `;
        } else if (status === 'low') {
            exercisesElement.innerHTML = `
                <li>Leg exercises</li>
                <li>Light cardio</li>
                <li>Strength training</li>
                <li>Avoid sudden position changes</li>
            `;
        } else {
            exercisesElement.innerHTML = `
                <li>30 min aerobic exercise most days</li>
                <li>Strength training 2-3x/week</li>
                <li>Flexibility exercises</li>
            `;
        }
        
        // Create or update chart
        const ctx = document.getElementById('bpChart').getContext('2d');
        
        if (bpChart) {
            bpChart.destroy();
        }
        
        bpChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Systolic', 'Diastolic'],
                datasets: [{
                    data: [systolic, diastolic],
                    backgroundColor: [
                        '#8b5cf6',
                        '#6366f1'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + ' mmHg';
                            }
                        }
                    }
                }
            }
        });
        
        feather.replace();
    }
});
