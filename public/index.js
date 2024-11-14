const documentForm = document.getElementById('document-form');
const documentUpload = document.getElementById('document-upload');
const sampleDocumentUpload = document.getElementById('sample-document-upload');
const compareButton = document.getElementById('compare-button');
const comparisonResult = document.getElementById('comparison-result');
const inputs = document.querySelectorAll('input[required]');

inputs.forEach((input) => {
  input.addEventListener('input', (e) => {
    const isValid = Array.from(inputs).every((input) => input.checkValidity());
    compareButton.disabled = !isValid;
  });
});


compareButton.addEventListener('click', async () => {
  compareButton.disabled = true;
  const file1 = documentUpload.files[0];
  const file2 = sampleDocumentUpload.files[0];
  const formData = new FormData();
  formData.append('document', file1);
  formData.append('sampleDocument', file2);
  documentForm.reset();
  comparisonResult.innerHTML = '';
  const data = await fetchData(formData);
  if (Array.isArray(data)) {
    if (data.length === 0) {
      const p = document.createElement('p');
      p.textContent = "No difference found, Sample document and Uploaded document are identical";
      comparisonResult.appendChild(p);
    } else {
      const html = data.map((obj) => {
        // Create HTML for each object
        const objHtml = Object.keys(obj).map((key) => {
          return `<p>${key}: ${obj[key]}</p>`;
        }).join('');

        return `<div class="object-container">${objHtml}</div>`;
      }).join('');
      comparisonResult.innerHTML = html;
    }
      

      
    } else {
      console.error('Expected an array of objects');
    }
  

});


async function fetchData(formData) {
  try {
      const response = await fetch('/compare', {
          method: 'POST',
          body: formData,
      });
      if (!response.ok) { // Check if response was not ok
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      // Handle error, e.g., display error message to user
    }
    
}
  
  
  