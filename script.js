let data = [];

// Function to handle file upload
function handleFileUpload() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        data = JSON.parse(e.target.result);
        updateFileInfo(data);
        generateVisualizations(data);
      } catch (error) {
        alert("Invalid JSON file. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  } else {
    alert("Please upload a JSON file.");
  }
}

// Function to update file info section
function updateFileInfo(data) {
  const fileInfo = document.getElementById('fileInfo');
  fileInfo.innerHTML = `
    <h2>About Your JSON File</h2>
    <p>Your file contains <strong>${data.length} records</strong>.</p>
    <p>Here's a summary of the keys in your data:</p>
    <ul>
      ${Object.keys(data[0]).map((key) => `<li><strong>${key}</strong>: ${typeof data[0][key]}</li>`).join('')}
    </ul>
  `;
}

// Function to generate visualizations
function generateVisualizations(data) {
  const visualizations = document.getElementById('visualizations');
  visualizations.innerHTML = ''; // Clear previous visualizations

  // Dynamically generate charts based on the keys in the JSON
  Object.keys(data[0]).forEach((key) => {
    if (typeof data[0][key] === 'number') {
      // Generate a bar chart for numeric fields
      const values = data.map((item) => item[key]);
      const chartDiv = document.createElement('div');
      chartDiv.className = 'chart';
      visualizations.appendChild(chartDiv);

      Plotly.newPlot(
        chartDiv,
        [
          {
            x: data.map((_, index) => index + 1),
            y: values,
            type: 'bar',
            name: key,
          },
        ],
        {
          title: `Distribution of ${key}`,
          xaxis: { title: 'Record Index' },
          yaxis: { title: key },
        }
      );
    } else if (typeof data[0][key] === 'string') {
      // Generate a pie chart for categorical fields
      const categories = data.map((item) => item[key]);
      const counts = {};
      categories.forEach((category) => {
        counts[category] = (counts[category] || 0) + 1;
      });

      const chartDiv = document.createElement('div');
      chartDiv.className = 'chart';
      visualizations.appendChild(chartDiv);

      Plotly.newPlot(
        chartDiv,
        [
          {
            values: Object.values(counts),
            labels: Object.keys(counts),
            type: 'pie',
            name: key,
          },
        ],
        {
          title: `Distribution of ${key}`,
        }
      );
    }
  });
}