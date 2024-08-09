// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Loader from '../components/loader';

// function TextSummarizer() {
//   const [inputText, setInputText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [summaryText, setSummaryText] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const navigate = useNavigate();

//   const handleInputChange = (event) => {
//     setInputText(event.target.value);
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };
// // TextRankAlgorithm
//   const similarity = (sentence1, sentence2) => {
//     const words1 = sentence1.split(' ');
//     const words2 = sentence2.split(' ');
//     const allWords = [...new Set([...words1, ...words2])];

//     const vector1 = allWords.map(word => words1.includes(word) ? 1 : 0);
//     const vector2 = allWords.map(word => words2.includes(word) ? 1 : 0);

//     const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
//     const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
//     const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

//     return dotProduct / (magnitude1 * magnitude2);
//   };

//   const summarizeTextFrontend = (text) => {
//     const sentences = text.split('. ').map(s => s.trim()).filter(s => s.length > 0);
//     const sentenceCount = sentences.length;

//     if (sentenceCount === 0) return '';

//     // Build similarity matrix
//     const similarityMatrix = Array.from({ length: sentenceCount }, () => Array(sentenceCount).fill(0));
//     for (let i = 0; i < sentenceCount; i++) {
//       for (let j = 0; j < sentenceCount; j++) {
//         if (i !== j) {
//           similarityMatrix[i][j] = similarity(sentences[i], sentences[j]);
//         }
//       }
//     }

//     // Initialize scores
//     const scores = Array(sentenceCount).fill(1.0);
//     const dampingFactor = 0.85;
//     const maxIterations = 100;
//     const threshold = 0.0001;

//     for (let iteration = 0; iteration < maxIterations; iteration++) {
//       const newScores = Array(sentenceCount).fill(0);
//       for (let i = 0; i < sentenceCount; i++) {
//         for (let j = 0; j < sentenceCount; j++) {
//           if (i !== j) {
//             newScores[i] += (similarityMatrix[j][i] / similarityMatrix[j].reduce((sum, val) => sum + val, 0)) * scores[j];
//           }
//         }
//         newScores[i] = (1 - dampingFactor) + dampingFactor * newScores[i];
//       }

//       const scoreDiff = newScores.reduce((sum, val, i) => sum + Math.abs(val - scores[i]), 0);
//       scores.splice(0, sentenceCount, ...newScores);

//       if (scoreDiff < threshold) break;
//     }

//     // Sort sentences by score
//     const rankedSentences = sentences.map((sentence, i) => ({ sentence, score: scores[i] }));
//     rankedSentences.sort((a, b) => b.score - a.score);

//     // Select top sentences for summary
//     const minLength = 100;
//     const maxLength = 500;
//     let summary = '';
//     let currentLength = 0;

//     for (let i = 0; i < rankedSentences.length; i++) {
//       if (currentLength >= maxLength) break;

//       const sentence = rankedSentences[i].sentence;
//       if (currentLength + sentence.length + 1 <= maxLength) {
//         summary += (summary ? '. ' : '') + sentence;
//         currentLength += sentence.length + 1; // +1 for the period and space
//       } else {
//         // Add a partial sentence if the summary is too short
//         if (currentLength < minLength) {
//           summary += (summary ? '. ' : '') + sentence;
//         }
//         break;
//       }
//     }

//     return summary;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (inputText) {
//       // Summarize text on frontend
//       const summary = summarizeTextFrontend(inputText);
//       setSummaryText(summary);
//       setLoading(false);
//     } else if (selectedFile) {
//       const formData = new FormData();
//       formData.append('file', selectedFile);

//       axios.post('http://127.0.0.1:8000/summarize/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       })
//       .then(response => {
//         console.log("Summary received:", response.data.summary);
//         setSummaryText(response.data.summary);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error("Error during file upload summarization:", error);
//         setLoading(false);
//       });
//     } else {
//       setLoading(false);
//       alert('Please enter text or select a file to summarize.');
//     }
//   };

//   const handleLogout = () => {
//     navigate('/');
//   };

//   const handleDownload = () => {
//     if (summaryText) {
//       const blob = new Blob([summaryText], { type: 'text/plain' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = 'summary.txt';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       alert('No summary available to download.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       {loading && <Loader />}
//       <nav className="navbar navbar-light bg-light">
//         <div className="container-fluid">
//           <span className="navbar-brand">Summarizer</span>
//           <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
//         </div>
//       </nav>

//       <div className="row">
//         <div className="col-md-6">
//           <textarea
//             className="form-control"
//             rows="10"
//             placeholder="Enter or paste your large text, or upload a document"
//             value={inputText}
//             onChange={handleInputChange}
//           />
//           <div className="mt-3">
//             <input
//               type="file"
//               className="btn btn-secondary"
//               onChange={handleFileChange}
//             />
//             <button className="btn btn-primary ml-2" onClick={handleSubmit}>Summarize</button>
//           </div>
//         </div>
//         <div className="col-md-6">
//           <textarea
//             className="form-control"
//             rows="10"
//             placeholder="Summarized text..."
//             value={summaryText}
//             readOnly
//           />
//           <button className="btn btn-secondary mt-2" onClick={handleDownload}>Download</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TextSummarizer;


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/loader';

function TextSummarizer() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // TextRankAlgorithm
  const similarity = (sentence1, sentence2) => {
    const words1 = sentence1.split(' ');
    const words2 = sentence2.split(' ');
    const allWords = [...new Set([...words1, ...words2])];

    const vector1 = allWords.map(word => words1.includes(word) ? 1 : 0);
    const vector2 = allWords.map(word => words2.includes(word) ? 1 : 0);

    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitude1 * magnitude2);
  };

  const summarizeTextFrontend = (text) => {
    const sentences = text.split('. ').map(s => s.trim()).filter(s => s.length > 0);
    const sentenceCount = sentences.length;

    if (sentenceCount === 0) return '';

    // Build similarity matrix
    const similarityMatrix = Array.from({ length: sentenceCount }, () => Array(sentenceCount).fill(0));
    for (let i = 0; i < sentenceCount; i++) {
      for (let j = 0; j < sentenceCount; j++) {
        if (i !== j) {
          similarityMatrix[i][j] = similarity(sentences[i], sentences[j]);
        }
      }
    }

    // Initialize scores
    const scores = Array(sentenceCount).fill(1.0);
    const dampingFactor = 0.85;
    const maxIterations = 100;
    const threshold = 0.0001;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const newScores = Array(sentenceCount).fill(0);
      for (let i = 0; i < sentenceCount; i++) {
        for (let j = 0; j < sentenceCount; j++) {
          if (i !== j) {
            newScores[i] += (similarityMatrix[j][i] / similarityMatrix[j].reduce((sum, val) => sum + val, 0)) * scores[j];
          }
        }
        newScores[i] = (1 - dampingFactor) + dampingFactor * newScores[i];
      }

      const scoreDiff = newScores.reduce((sum, val, i) => sum + Math.abs(val - scores[i]), 0);
      scores.splice(0, sentenceCount, ...newScores);

      if (scoreDiff < threshold) break;
    }

    // Sort sentences by score
    const rankedSentences = sentences.map((sentence, i) => ({ sentence, score: scores[i] }));
    rankedSentences.sort((a, b) => b.score - a.score);

    // Select top sentences for summary
    const minLength = 100;
    const maxLength = 500;
    let summary = '';
    let currentLength = 0;

    for (let i = 0; i < rankedSentences.length; i++) {
      if (currentLength >= maxLength) break;

      const sentence = rankedSentences[i].sentence;
      if (currentLength + sentence.length + 1 <= maxLength) {
        summary += (summary ? '. ' : '') + sentence;
        currentLength += sentence.length + 1; // +1 for the period and space
      } else {
        // Add a partial sentence if the summary is too short
        if (currentLength < minLength) {
          summary += (summary ? '. ' : '') + sentence;
        }
        break;
      }
    }

    return summary;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (inputText) {
      console.log("Inside inputText = true");
      // Summarize text on frontend
      const summary = summarizeTextFrontend(inputText);
      setSummaryText(summary);
      setLoading(false);
    } else if (selectedFile) {
      console.log("Inside selectedFile = true");
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://127.0.0.1:8000/summarize/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log("Summary received:", response.data.summary);
        setSummaryText(response.data.summary);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error during file upload summarization:", error);
        setLoading(false);
      });
    } else {
      console.log("Inside idk");
      setLoading(false);
      alert('Please enter text or select a file to summarize.');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleDownload = () => {
    if (summaryText) {
      const blob = new Blob([summaryText], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'summary.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No summary available to download.');
    }
  };

  return (
    <div style={{ height: '100vh', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      {loading && <Loader />}
      <nav className="navbar navbar-light" style={{ backgroundColor: '#d3c4e0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', width: '100%', zIndex: 1000 }}>
        <div className="container-fluid">
          <span className="navbar-brand" style={{ color: '#5a3e7f', fontWeight: 'bold', fontSize: '26px' }}>Summarizer</span>
          <button
            className="btn btn-danger"
            onClick={handleLogout}
            style={{ fontSize: '18px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          >
            Logout
          </button>
        </div>
      </nav>
  
      <div className="container-fluid" style={{ flex: 1, paddingTop: '20px', backgroundColor: '#f7f7f7' }}>
        <div className="row justify-content-center" style={{ padding: '20px' }}>
          <div className="col-md-6" style={{ paddingRight: '20px' }}>
            <textarea
              className="form-control"
              rows="10"
              placeholder="Enter short text here for summarization. For large text, please use the file upload."
              value={inputText}
              onChange={handleInputChange}
              style={{ borderRadius: '8px', border: '1px solid #ccc', padding: '12px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
            />
            <div className="mt-3">
              <label htmlFor="file-upload" className="btn btn-secondary" style={{ borderRadius: '8px', backgroundColor: '#6c757d', color: '#fff', position: 'relative', cursor: 'pointer', padding: '10px 20px', fontSize: '16px', display: 'inline-flex', alignItems: 'center' }}>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                {selectedFile ? <span>{selectedFile.name}</span> : 'Choose File'}
              </label>
              <button
                className="btn btn-primary ml-2"
                onClick={handleSubmit}
                style={{ marginLeft: '10px', borderRadius: '8px', backgroundColor: '#4a3c6f', color: '#fff', padding: '10px 20px', fontSize: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                Summarize
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <textarea
              className="form-control"
              rows="10"
              placeholder="Summary will appear here..."
              value={summaryText}
              readOnly
              style={{ borderRadius: '8px', border: '1px solid #ccc', padding: '12px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)', backgroundColor: '#f9f9f9' }}
            />
            <div className="mt-3">
              <button
                className="btn btn-success"
                onClick={handleDownload}
                style={{ borderRadius: '8px', backgroundColor: '#28a745', color: '#fff', padding: '10px 20px', fontSize: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                Download Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextSummarizer;
