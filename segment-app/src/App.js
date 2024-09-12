import React, { useState } from 'react';
import './App.css';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [schemaList, setSchemaList] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');

  const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' }
  ];

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSegmentName('');
    setSchemaList([]);
    setSelectedSchema('');
  };

  const handleAddSchema = () => {
    if (selectedSchema && !schemaList.includes(selectedSchema)) {
      setSchemaList([...schemaList, selectedSchema]);
      setSelectedSchema('');
    }
  };

  const handleRemoveSchema = (index) => {
    const updatedSchemaList = schemaList.filter((_, i) => i !== index);
    setSchemaList(updatedSchemaList);
  };

  const handleSubmit = async () => {
    const dataToSend = {
      segment_name: segmentName,
      schema: schemaList.map((schema) => {
        const schemaOption = schemaOptions.find(option => option.value === schema);
        return { [schemaOption.value]: schemaOption.label };
      })
    };

    try {
      const response = await fetch('https://webhook.site/6aa1167d-1c53-4d50-aa62-c5056f66f6fd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to send data');
      }

      console.log('Data sent successfully:', dataToSend);
      handleClosePopup(); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredOptions = schemaOptions.filter(
    option => !schemaList.includes(option.value)
  );

  return (
    <div className="App">
      <header className="main-header">
        <h1>View Audience</h1>
      </header>
      <button onClick={handleOpenPopup}>Save Segment</button>

      {showPopup && (
        <>
          <div className="blur-background" />
          <div className="popup-overlay">
            <header className="PopUp-header">
              <h1>Saving Segment</h1>
            </header>
            <div className="popup-content">
              <h3>Enter the Name of the Segment</h3>
              <input 
                type="text" 
                value={segmentName} 
                onChange={(e) => setSegmentName(e.target.value)} 
                placeholder="Segment Name" 
                required 
              />

              <div className="blue-box">
                {schemaList.map((schema, index) => (
                  <div key={index} className="schema-item">
                    <select 
                      value={schema} 
                      onChange={(e) => {
                        const updatedSchemaList = [...schemaList];
                        updatedSchemaList[index] = e.target.value;
                        setSchemaList(updatedSchemaList);
                      }}
                    >
                      {schemaOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button 
                      className="delete-button" 
                      onClick={() => handleRemoveSchema(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>

              <div className="schema-dropdown">
                <select 
                  value={selectedSchema} 
                  onChange={(e) => setSelectedSchema(e.target.value)}
                >
                  <option value="">Add schema to segment</option>
                  {filteredOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button onClick={handleAddSchema}>+ Add new schema</button>
              </div>

              <button onClick={handleSubmit}>Save the segment</button>
              <button onClick={handleClosePopup}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
