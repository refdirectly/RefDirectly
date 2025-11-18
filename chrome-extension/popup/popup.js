const API_URL = 'https://refdirectly-1.onrender.com';
let selectedFile = null;

const fileInput = document.getElementById('fileInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const uploadSection = document.getElementById('uploadSection');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const checkAnotherBtn = document.getElementById('checkAnotherBtn');

fileInput.addEventListener('change', (e) => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    analyzeBtn.disabled = false;
    document.querySelector('.upload-area p').textContent = selectedFile.name;
  }
});

analyzeBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  uploadSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');

  try {
    const formData = new FormData();
    formData.append('resume', selectedFile);

    const response = await fetch(`${API_URL}/api/ai-resume/analyze-ats`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      displayResults(data);
    } else {
      alert('Analysis failed: ' + (data.error || 'Unknown error'));
      resetToUpload();
    }
  } catch (error) {
    alert('Network error. Please try again.');
    resetToUpload();
  }
});

checkAnotherBtn.addEventListener('click', resetToUpload);

function displayResults(data) {
  loadingSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');

  document.getElementById('scoreValue').textContent = data.score || 0;
  
  const strengthsList = document.getElementById('strengthsList');
  strengthsList.innerHTML = '';
  (data.strengths || []).slice(0, 3).forEach(strength => {
    const li = document.createElement('li');
    li.textContent = strength;
    strengthsList.appendChild(li);
  });

  const improvementsList = document.getElementById('improvementsList');
  improvementsList.innerHTML = '';
  (data.improvements || []).slice(0, 3).forEach(improvement => {
    const li = document.createElement('li');
    li.textContent = improvement;
    improvementsList.appendChild(li);
  });
}

function resetToUpload() {
  selectedFile = null;
  fileInput.value = '';
  analyzeBtn.disabled = true;
  document.querySelector('.upload-area p').textContent = 'Upload Resume PDF';
  
  resultsSection.classList.add('hidden');
  loadingSection.classList.add('hidden');
  uploadSection.classList.remove('hidden');
}
