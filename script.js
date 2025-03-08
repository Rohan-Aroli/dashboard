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
        if (!Array.isArray(data)) {
          throw new Error("JSON file must be an array of objects.");
        }
        updateFileInfo(data);
        generateVisualizations(data);
      } catch (error) {
        alert(`Error: ${error.message}`);
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
  if (data.length === 0) {
    fileInfo.innerHTML = `<h2>About Your JSON File</h2><p>Your file contains no records.</p>`;
    return;
  }

  const keys = Object.keys(data[0]);
  fileInfo.innerHTML = `
    <h2>About Your JSON File</h2>
    <p>Your file contains <strong>${data.length} records</strong>.</p>
    <p>Here's a summary of the keys in your data:</p>
    <ul>
      ${keys.map((key) => `<li><strong>${key}</strong>: ${typeof data[0][key]}</li>`).join('')}
    </ul>
  `;
}

// Function to generate visualizations
function generateVisualizations(data) {
  const visualizations = document.getElementById('visualizations');
  visualizations.innerHTML = ''; // Clear previous visualizations

  if (data.length === 0) {
    visualizations.innerHTML = `<p>No data to visualize.</p>`;
    return;
  }

  const keys = Object.keys(data[0]);

  keys.forEach((key) => {
    const values = data.map((item) => item[key]);
    const chartDiv = document.createElement('div');
    chartDiv.className = 'chart';
    visualizations.appendChild(chartDiv);

    if (typeof values[0] === 'number') {
      // Generate a bar chart for numeric fields
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
    } else if (typeof values[0] === 'string') {
      // Generate a pie chart for categorical fields
      const counts = {};
      values.forEach((value) => {
        counts[value] = (counts[value] || 0) + 1;
      });

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
    } else {
      // Unsupported data type
      chartDiv.innerHTML = `<p>Unsupported data type for key: ${key}</p>`;
    }
  });
}
