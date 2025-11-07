import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Landdatainput.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hook to update map bounds when coordinates change
const MapUpdater = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      try {
        // Filter out any invalid coordinates
        const validCoords = coordinates.filter(coord => 
          coord && 
          Array.isArray(coord) && 
          coord.length === 2 && 
          !isNaN(coord[0]) && 
          !isNaN(coord[1]) &&
          isFinite(coord[0]) &&
          isFinite(coord[1])
        );

        if (validCoords.length > 0) {
          const bounds = L.latLngBounds(validCoords);
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      } catch (error) {
        console.error('Error updating map bounds:', error);
      }
    }
  }, [coordinates, map]);

  return null;
};

const LandDataInput = () => {
  // State for form data
  const [formData, setFormData] = useState({
    titleNumber: '',
    county: '',
    landSize: '',
    landSizeUnit: 'acres',
    coordinates: [],
    deedPlanFile: null,
    deedPlanText: '',
    surveyPlanFile: null,
    surveyPlanText: '',
    supportingDocs: [],
    supportingDocsTexts: ['']
  });
  
  // State for UI
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [csvData, setCsvData] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [polygonArea, setPolygonArea] = useState(0);
  
  // Refs for drag and drop
  const deedPlanDropRef = useRef(null);
  const surveyPlanDropRef = useRef(null);
  const supportingDocsDropRef = useRef(null);

  // Default center for Kenya (Nairobi)
  const defaultCenter = [-1.2921, 36.8219];
  
  // County options
  const counties = [
    'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita Taveta',
    'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka Nithi',
    'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
    'Muranga', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia',
    'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
    'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
    'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi'
  ];

  // Helper function to validate and parse coordinate
  const parseCoordinate = (value) => {
    if (value === null || value === undefined || value === '') return null;
    
    // Convert to string and trim
    const stringValue = value.toString().trim();
    
    // Handle negative numbers and empty strings
    if (stringValue === '' || stringValue === '-' || stringValue === '+') return null;
    
    // Parse the number
    const num = parseFloat(stringValue);
    
    if (isNaN(num) || !isFinite(num)) return null;
    
    return num;
  };

  // Check if coordinate is valid (memoized to avoid dependency issues)
  const isValidCoordinate = useCallback((coord) => {
    if (!coord) return false;
    
    const lat = parseCoordinate(coord.lat);
    const lng = parseCoordinate(coord.lng);
    
    // Check if coordinates are valid numbers and within range
    if (lat === null || lng === null) return false;
    if (lat < -90 || lat > 90) return false;
    if (lng < -180 || lng > 180) return false;
    
    return true;
  }, []);

  // Convert coordinates to Leaflet format with validation
  const getLeafletCoordinates = () => {
    if (!formData.coordinates || !Array.isArray(formData.coordinates)) return [];
    
    return formData.coordinates
      .map(coord => {
        if (!coord) return null;
        
        const lat = parseCoordinate(coord.lat);
        const lng = parseCoordinate(coord.lng);
        
        if (lat !== null && lng !== null) {
          return [lat, lng];
        }
        return null;
      })
      .filter(coord => coord !== null);
  };

  // Get valid coordinates with their original data
  const getValidCoordinates = useCallback(() => {
    if (!formData.coordinates || !Array.isArray(formData.coordinates)) return [];
    
    return formData.coordinates.filter(coord => 
      coord && isValidCoordinate(coord)
    );
  }, [formData.coordinates, isValidCoordinate]);

  // Calculate polygon area using shoelace formula (in square meters)
  const calculatePolygonArea = useCallback((coordinates) => {
    const validCoords = coordinates.filter(coord => isValidCoordinate(coord));

    if (validCoords.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < validCoords.length; i++) {
      const j = (i + 1) % validCoords.length;
      const lat1 = parseFloat(validCoords[i].lat);
      const lng1 = parseFloat(validCoords[i].lng);
      const lat2 = parseFloat(validCoords[j].lat);
      const lng2 = parseFloat(validCoords[j].lng);
      
      area += (lng1 * lat2 - lng2 * lat1);
    }
    
    const areaSquareDegrees = Math.abs(area / 2);
    
    // Convert square degrees to square meters (approximate conversion)
    const areaSquareMeters = areaSquareDegrees * 111320 * 111320;
    
    return areaSquareMeters;
  }, [isValidCoordinate]);

  // Format area for display
  const formatArea = (areaMeters) => {
    if (!areaMeters || areaMeters <= 0) return '0 m²';
    
    if (areaMeters < 10000) {
      return `${areaMeters.toFixed(2)} m²`;
    } else if (areaMeters < 1000000) {
      return `${(areaMeters / 10000).toFixed(2)} hectares`;
    } else {
      return `${(areaMeters / 1000000).toFixed(2)} km²`;
    }
  };

  // Calculate area in different units
  const getAreaInUnits = (areaMeters) => {
    if (!areaMeters || areaMeters <= 0) {
      return {
        squareMeters: 0,
        hectares: 0,
        acres: 0,
        squareKilometers: 0
      };
    }
    
    return {
      squareMeters: areaMeters,
      hectares: areaMeters / 10000,
      acres: areaMeters / 4046.86,
      squareKilometers: areaMeters / 1000000
    };
  };

  // Update area when coordinates change
  useEffect(() => {
    const validCoords = getValidCoordinates();

    if (validCoords.length >= 3) {
      try {
        const area = calculatePolygonArea(validCoords);
        setPolygonArea(area);
      } catch (error) {
        console.error('Error calculating area:', error);
        setPolygonArea(0);
      }
    } else {
      setPolygonArea(0);
    }
  }, [formData.coordinates, getValidCoordinates, calculatePolygonArea]);

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem('landFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Validate saved coordinates
        const validatedData = {
          ...parsedData,
          coordinates: Array.isArray(parsedData.coordinates) 
            ? parsedData.coordinates.map(coord => ({
                ...coord,
                lat: coord.lat || '',
                lng: coord.lng || '',
                beaconId: coord.beaconId || ''
              }))
            : []
        };
        setFormData(prev => ({ ...prev, ...validatedData }));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const saveData = setTimeout(() => {
      localStorage.setItem('landFormData', JSON.stringify(formData));
    }, 1000);
    
    return () => clearTimeout(saveData);
  }, [formData]);

  // Enhanced coordinate validation with specific error messages
  const validateCoordinate = (value, type) => {
    if (!value || value.trim() === '') {
      return { isValid: false, message: `${type} is required` };
    }
    
    const num = parseCoordinate(value);
    
    if (num === null) {
      return { isValid: false, message: `Invalid ${type} format` };
    }
    
    if (type === 'Latitude' && (num < -90 || num > 90)) {
      return { isValid: false, message: 'Latitude must be between -90 and 90' };
    }
    
    if (type === 'Longitude' && (num < -180 || num > 180)) {
      return { isValid: false, message: 'Longitude must be between -180 and 180' };
    }
    
    return { isValid: true, message: '' };
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle document text input changes
  const handleDocumentTextChange = (docType, value) => {
    setFormData(prev => ({
      ...prev,
      [docType]: value
    }));
  };

  // Handle supporting document text changes
  const handleSupportingDocTextChange = (index, value) => {
    const newTexts = [...formData.supportingDocsTexts];
    newTexts[index] = value;
    setFormData(prev => ({
      ...prev,
      supportingDocsTexts: newTexts
    }));
  };

  // Add more supporting document text fields
  const addSupportingDocText = () => {
    setFormData(prev => ({
      ...prev,
      supportingDocsTexts: [...prev.supportingDocsTexts, '']
    }));
  };

  // Remove supporting document text field
  const removeSupportingDocText = (index) => {
    const newTexts = formData.supportingDocsTexts.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      supportingDocsTexts: newTexts
    }));
  };
  
  // Handle file uploads
  const handleFileUpload = (file, fileType) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [fileType]: 'Please upload a JPG, PNG, or PDF file'
      }));
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [fileType]: 'File size must be less than 10MB'
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [fileType]: file
    }));
    
    // Clear error
    if (errors[fileType]) {
      setErrors(prev => ({
        ...prev,
        [fileType]: ''
      }));
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (fileType === 'supportingDocsFiles') {
        // For multiple files
        const newFiles = Array.from(files);
        setFormData(prev => ({
          ...prev,
          supportingDocs: [...prev.supportingDocs, ...newFiles]
        }));
      } else {
        // For single files
        handleFileUpload(files[0], fileType);
      }
    }
  };

  // Clear all form data
  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      setFormData({
        titleNumber: '',
        county: '',
        landSize: '',
        landSizeUnit: 'acres',
        coordinates: [],
        deedPlanFile: null,
        deedPlanText: '',
        surveyPlanFile: null,
        surveyPlanText: '',
        supportingDocs: [],
        supportingDocsTexts: ['']
      });
      setErrors({});
      localStorage.removeItem('landFormData');
      setSubmitStatus('');
      setPolygonArea(0);
    }
  };

  // Load sample data for testing
  const handleLoadSampleData = () => {
    const sampleCoordinates = [
      { id: 1, beaconId: 'A', lat: '-1.2921', lng: '36.8219' },
      { id: 2, beaconId: 'B', lat: '-1.2925', lng: '36.8225' },
      { id: 3, beaconId: 'C', lat: '-1.2930', lng: '36.8215' },
      { id: 4, beaconId: 'D', lat: '-1.2928', lng: '36.8205' }
    ];
    
    setFormData({
      titleNumber: 'LR 12345/67',
      county: 'Nairobi',
      landSize: '2.5',
      landSizeUnit: 'acres',
      coordinates: sampleCoordinates,
      deedPlanFile: null,
      deedPlanText: 'Deed plan registered in 2020',
      surveyPlanFile: null,
      surveyPlanText: 'Survey plan FR No. 123/456',
      supportingDocs: [],
      supportingDocsTexts: ['Land rates clearance certificate']
    });
  };
  
  // Handle adding a coordinate
  const handleAddCoordinate = () => {
    setFormData(prev => ({
      ...prev,
      coordinates: [...prev.coordinates, { 
        id: Date.now(), 
        beaconId: '', 
        lat: '', 
        lng: '' 
      }]
    }));
  };
  
  // Handle coordinate input change
  const handleCoordinateChange = (id, field, value) => {
    // Validate the coordinate as user types
    if (field === 'lat' || field === 'lng') {
      const type = field === 'lat' ? 'Latitude' : 'Longitude';
      const validation = validateCoordinate(value, type);
      
      if (!validation.isValid && value.trim() !== '') {
        // Set specific error for this coordinate
        setErrors(prev => ({
          ...prev,
          [`coord-${id}-${field}`]: validation.message
        }));
      } else {
        // Clear error
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[`coord-${id}-${field}`];
          return newErrors;
        });
      }
    }
    
    setFormData(prev => ({
      ...prev,
      coordinates: prev.coordinates.map(coord => 
        coord.id === id ? { ...coord, [field]: value } : coord
      )
    }));
  };
  
  // Handle removing a coordinate
  const handleRemoveCoordinate = (id) => {
    setFormData(prev => ({
      ...prev,
      coordinates: prev.coordinates.filter(coord => coord.id !== id)
    }));
    
    // Clear any errors for this coordinate
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`coord-${id}-`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };
  
  // Handle CSV upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      setCsvData(csvText);
      
      // Parse CSV and convert to coordinates
      try {
        const lines = csvText.split('\n');
        const newCoordinates = [];
        
        lines.forEach((line, index) => {
          if (line.trim() === '') return;
          
          const parts = line.split(',');
          if (parts.length >= 3) {
            const id = Date.now() + index;
            const beaconId = parts[0].trim();
            const lat = parseFloat(parts[1]);
            const lng = parseFloat(parts[2]);
            
            if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
              newCoordinates.push({
                id,
                beaconId,
                lat: lat.toString(),
                lng: lng.toString()
              });
            }
          }
        });
        
        if (newCoordinates.length > 0) {
          setFormData(prev => ({
            ...prev,
            coordinates: newCoordinates
          }));
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setErrors(prev => ({
          ...prev,
          coordinates: 'Error parsing CSV file. Please check the format.'
        }));
      }
    };
    
    reader.readAsText(file);
  };

  // Enhanced handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('uploading');
    setProgress(0);
    
    // Validate form
    const newErrors = {};
    
    if (!formData.titleNumber.trim()) {
      newErrors.titleNumber = 'Title number is required';
    }
    
    if (!formData.deedPlanFile && !formData.deedPlanText.trim()) {
      newErrors.deedPlan = 'Deed plan is required (either file or text)';
    }
    
    // Validate coordinates
    const validCoords = getValidCoordinates();

    if (validCoords.length < 3) {
      newErrors.coordinates = 'At least 3 valid coordinates are required';
    } else {
      // Validate each coordinate
      formData.coordinates.forEach((coord, index) => {
        const lat = parseCoordinate(coord.lat);
        const lng = parseCoordinate(coord.lng);
        
        if (lat === null) {
          newErrors[`coord-${index}-lat`] = 'Valid latitude is required';
        } else if (lat < -90 || lat > 90) {
          newErrors[`coord-${index}-lat`] = 'Latitude must be between -90 and 90';
        }
        
        if (lng === null) {
          newErrors[`coord-${index}-lng`] = 'Valid longitude is required';
        } else if (lng < -180 || lng > 180) {
          newErrors[`coord-${index}-lng`] = 'Longitude must be between -180 and 180';
        }
      });
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      setSubmitStatus('');
      return;
    }
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Prepare FormData
      const formDataToSend = new FormData();
      formDataToSend.append("titleNumber", formData.titleNumber);
      formDataToSend.append("county", formData.county);
      formDataToSend.append("landSize", formData.landSize);
      formDataToSend.append("landSizeUnit", formData.landSizeUnit);
      
      // Append files if they exist
      if (formData.deedPlanFile) {
        formDataToSend.append("deedPlanFile", formData.deedPlanFile);
      }
      if (formData.surveyPlanFile) {
        formDataToSend.append("surveyPlanFile", formData.surveyPlanFile);
      }
      
      // Append text data
      formDataToSend.append("deedPlanText", formData.deedPlanText);
      formDataToSend.append("surveyPlanText", formData.surveyPlanText);
      
      // Append coordinates as JSON
      formDataToSend.append("coordinates", JSON.stringify(validCoords));
      
      // Append supporting documents
      formData.supportingDocs.forEach((file, index) => {
        formDataToSend.append(`supportingDocs_${index}`, file);
      });
      
      // Append supporting document texts
      formDataToSend.append("supportingDocsTexts", JSON.stringify(formData.supportingDocsTexts));

      // Make API call
      const response = await fetch("http://localhost:5000/api/land/upload", {
        method: "POST",
        body: formDataToSend,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data);
      
      setSubmitStatus('success');
      
      // Clear form after successful submission
      setTimeout(() => {
        handleClearForm();
        setIsSubmitting(false);
        setProgress(0);
        // Redirect to analysis page or show success message
        alert('Land data submitted successfully! Redirecting to AI analysis...');
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
      setProgress(0);
      alert('Error submitting form. Please try again.');
    }
  };
  
  // Render the real map with Leaflet
  const renderMap = () => {
    const leafletCoordinates = getLeafletCoordinates();
    const validCoordinates = getValidCoordinates();
    const areaUnits = getAreaInUnits(polygonArea);
    const validCoordinatesCount = leafletCoordinates.length;

    return (
      <div className="map-container">
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%', borderRadius: '16px' }}
          scrollWheelZoom={true}
          key={JSON.stringify(leafletCoordinates)} // Force re-render when coordinates change
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater coordinates={leafletCoordinates} />
          
          {/* Plot markers for each valid coordinate */}
          {leafletCoordinates.map((coord, index) => {
            const originalCoord = validCoordinates[index];
            return (
              <Marker key={originalCoord?.id || index} position={coord}>
                <Popup>
                  Beacon {originalCoord?.beaconId || `Point ${index + 1}`}<br />
                  Lat: {coord[0].toFixed(6)}, Lng: {coord[1].toFixed(6)}
                </Popup>
              </Marker>
            );
          })}
          
          {/* Draw polygon if we have at least 3 valid points */}
          {validCoordinatesCount >= 3 && (
            <Polygon
              positions={leafletCoordinates}
              pathOptions={{
                color: '#ff7e5f',
                weight: 3,
                opacity: 0.8,
                fillColor: '#ff7e5f',
                fillOpacity: 0.3
              }}
            >
              <Popup>
                <div className="polygon-popup">
                  <h4>Land Boundary</h4>
                  <p><strong>Points:</strong> {validCoordinatesCount}</p>
                  <p><strong>Area:</strong> {formatArea(polygonArea)}</p>
                  {polygonArea > 0 && (
                    <div className="area-breakdown">
                      <p><strong>Detailed Area:</strong></p>
                      <ul>
                        <li>{areaUnits.squareMeters.toFixed(2)} m²</li>
                        <li>{areaUnits.hectares.toFixed(4)} hectares</li>
                        <li>{areaUnits.acres.toFixed(4)} acres</li>
                        <li>{areaUnits.squareKilometers.toFixed(6)} km²</li>
                      </ul>
                    </div>
                  )}
                </div>
              </Popup>
            </Polygon>
          )}
        </MapContainer>
        
        {/* Map overlay with information */}
        <div className="map-overlay-info">
          <h4>Land Boundary Map</h4>
          <p><strong>Valid Coordinates:</strong> {validCoordinatesCount} points</p>
          {validCoordinatesCount >= 3 ? (
            <>
              <p><strong>Area:</strong> {formatArea(polygonArea)}</p>
              <p><strong>Status:</strong> <span className="status-complete">Complete</span></p>
            </>
          ) : (
            <p><strong>Status:</strong> <span className="status-incomplete">
              {validCoordinatesCount > 0 ? `Need ${3 - validCoordinatesCount} more` : 'Add coordinates'}
            </span></p>
          )}
        </div>
      </div>
    );
  };

  // Render document input with both text and file options
  const renderDocumentInput = (label, fileType, textType, errorKey, isRequired = false) => {
    const hasFile = formData[fileType];
    const hasText = formData[textType] && formData[textType].trim() !== '';
    
    return (
      <div className="form-group">
        <label htmlFor={fileType}>
          {label} {isRequired && '*'}
        </label>
        
        {/* Text Input */}
        <div className="text-input-section">
          <input
            type="text"
            placeholder={`Enter ${label} details...`}
            value={formData[textType]}
            onChange={(e) => handleDocumentTextChange(textType, e.target.value)}
            className="document-text-input"
            disabled={isSubmitting}
          />
          <span className="input-hint">Or upload a file below</span>
        </div>

        {/* File Upload with Drag & Drop */}
        <div 
          className="file-upload-area"
          ref={fileType === 'deedPlanFile' ? deedPlanDropRef : 
               fileType === 'surveyPlanFile' ? surveyPlanDropRef : supportingDocsDropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, fileType)}
        >
          <input
            type="file"
            id={fileType}
            onChange={(e) => handleFileUpload(e.target.files[0], fileType)}
            accept=".pdf,.jpg,.jpeg,.png"
            disabled={isSubmitting}
          />
          <div className="upload-placeholder">
            <span className="upload-icon">📁</span>
            <p>Drag & drop or click to upload</p>
            <p className="file-types">PDF, JPG, PNG (max 10MB)</p>
          </div>
        </div>

        {/* Show uploaded file */}
        {hasFile && (
          <div className="uploaded-file">
            <span className="file-name">{formData[fileType].name}</span>
            <button 
              type="button" 
              className="remove-file"
              onClick={() => setFormData(prev => ({ ...prev, [fileType]: null }))}
              disabled={isSubmitting}
            >
              Remove
            </button>
          </div>
        )}

        {/* Show current status */}
        <div className="input-status">
          {hasText && <span className="status-text">✓ Text input provided</span>}
          {hasFile && <span className="status-file">✓ File uploaded</span>}
          {!hasText && !hasFile && <span className="status-none">No input provided</span>}
        </div>

        {errors[errorKey] && <span className="error-text">{errors[errorKey]}</span>}
      </div>
    );
  };

  // Render progress bar
  const renderProgressBar = () => {
    if (!isSubmitting) return null;
    
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {submitStatus === 'uploading' && 'Uploading data...'}
          {submitStatus === 'success' && 'Upload successful! Processing...'}
          {submitStatus === 'error' && 'Upload failed. Please try again.'}
          <span>{progress}%</span>
        </div>
      </div>
    );
  };

  const areaUnits = getAreaInUnits(polygonArea);
  const validCoordinatesCount = getLeafletCoordinates().length;
  
  return (
    <div className="land-data-input">
      <div className="header">
        <h1>Land Data Input</h1>
        <p>Provide accurate land details for AI analysis</p>
        
        {/* Action buttons */}
        <div className="header-actions">
          <button 
            type="button" 
            className="secondary-btn"
            onClick={handleLoadSampleData}
            disabled={isSubmitting}
          >
            Load Sample Data
          </button>
          <button 
            type="button" 
            className="secondary-btn danger"
            onClick={handleClearForm}
            disabled={isSubmitting}
          >
            Clear Form
          </button>
        </div>
      </div>
      
      {renderProgressBar()}
      
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          {/* Left Column - Form Fields */}
          <div className="form-column">
            {/* Title Number */}
            <div className="form-card">
              <h2>Land Identification</h2>
              <div className="form-group">
                <label htmlFor="titleNumber">Title Number (L.R./Block/Parcel No.) *</label>
                <input
                  type="text"
                  id="titleNumber"
                  name="titleNumber"
                  value={formData.titleNumber}
                  onChange={handleInputChange}
                  className={errors.titleNumber ? 'error' : ''}
                  placeholder="e.g. LR 12345/67"
                  disabled={isSubmitting}
                />
                {errors.titleNumber && <span className="error-text">{errors.titleNumber}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="county">County</label>
                <select
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select County</option>
                  {counties.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group land-size">
                <label htmlFor="landSize">Land Size</label>
                <div className="land-size-inputs">
                  <input
                    type="number"
                    id="landSize"
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    step="0.01"
                    min="0"
                    disabled={isSubmitting}
                  />
                  <select
                    name="landSizeUnit"
                    value={formData.landSizeUnit}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="acres">Acres</option>
                    <option value="sqm">Square Meters</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Document Uploads */}
            <div className="form-card">
              <h2>Land Documents</h2>
              
              {/* Deed Plan */}
              {renderDocumentInput(
                'Deed Plan / Registry Index Map',
                'deedPlanFile',
                'deedPlanText',
                'deedPlan',
                true
              )}
              
              {/* Survey Plan */}
              {renderDocumentInput(
                'Survey Plan (F.R. No.)',
                'surveyPlanFile',
                'surveyPlanText',
                'surveyPlan'
              )}
              
              {/* Additional Supporting Documents */}
              <div className="form-group">
                <label htmlFor="supportingDocs">Additional Supporting Documents</label>
                
                {/* Text Inputs for Supporting Docs */}
                <div className="supporting-docs-text">
                  {formData.supportingDocsTexts.map((text, index) => (
                    <div key={index} className="supporting-doc-text-item">
                      <input
                        type="text"
                        placeholder="Enter supporting document details..."
                        value={text}
                        onChange={(e) => handleSupportingDocTextChange(index, e.target.value)}
                        className="document-text-input"
                        disabled={isSubmitting}
                      />
                      {formData.supportingDocsTexts.length > 1 && (
                        <button
                          type="button"
                          className="remove-text-input"
                          onClick={() => removeSupportingDocText(index)}
                          disabled={isSubmitting}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-text-input"
                    onClick={addSupportingDocText}
                    disabled={isSubmitting}
                  >
                    + Add Another Text Input
                  </button>
                </div>

                {/* File Upload for Supporting Docs */}
                <div 
                  className="file-upload-area"
                  ref={supportingDocsDropRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'supportingDocsFiles')}
                >
                  <input
                    type="file"
                    id="supportingDocs"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData(prev => ({
                        ...prev,
                        supportingDocs: [...prev.supportingDocs, ...files]
                      }));
                    }}
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={isSubmitting}
                  />
                  <div className="upload-placeholder">
                    <span className="upload-icon">📁</span>
                    <p>Drag & drop or click to upload multiple files</p>
                    <p className="file-types">PDF, JPG, PNG (max 10MB each)</p>
                  </div>
                </div>

                {/* Show uploaded supporting files */}
                {formData.supportingDocs.length > 0 && (
                  <div className="uploaded-files-list">
                    {formData.supportingDocs.map((file, index) => (
                      <div key={index} className="uploaded-file">
                        <span className="file-name">{file.name}</span>
                        <button 
                          type="button" 
                          className="remove-file"
                          onClick={() => {
                            const newFiles = [...formData.supportingDocs];
                            newFiles.splice(index, 1);
                            setFormData(prev => ({ ...prev, supportingDocs: newFiles }));
                          }}
                          disabled={isSubmitting}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Status for Supporting Docs */}
                <div className="input-status">
                  {formData.supportingDocsTexts.some(text => text.trim() !== '') && (
                    <span className="status-text">✓ Text inputs provided</span>
                  )}
                  {formData.supportingDocs.length > 0 && (
                    <span className="status-file">✓ {formData.supportingDocs.length} file(s) uploaded</span>
                  )}
                  {formData.supportingDocsTexts.every(text => text.trim() === '') && formData.supportingDocs.length === 0 && (
                    <span className="status-none">No supporting documents provided</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Beacon Coordinates */}
            <div className="form-card">
              <h2>Beacon Coordinates</h2>
              
              <div className="coordinate-input-tabs">
                <button 
                  type="button" 
                  className={activeTab === 'manual' ? 'active' : ''}
                  onClick={() => setActiveTab('manual')}
                  disabled={isSubmitting}
                >
                  Manual Entry
                </button>
                <button 
                  type="button" 
                  className={activeTab === 'csv' ? 'active' : ''}
                  onClick={() => setActiveTab('csv')}
                  disabled={isSubmitting}
                >
                  CSV Upload
                </button>
              </div>
              
              {activeTab === 'manual' ? (
                <>
                  <div className="coordinates-table">
                    <div className="table-header">
                      <span>Beacon ID</span>
                      <span>Latitude</span>
                      <span>Longitude</span>
                      <span>Validation</span>
                      <span>Action</span>
                    </div>
                    
                    {formData.coordinates.map((coord, index) => {
                      const latValid = parseCoordinate(coord.lat) !== null;
                      const lngValid = parseCoordinate(coord.lng) !== null;
                      const isValid = latValid && lngValid;
                      
                      return (
                        <div key={coord.id} className="table-row">
                          <input
                            type="text"
                            placeholder={`Beacon ${index + 1}`}
                            value={coord.beaconId || ''}
                            onChange={(e) => handleCoordinateChange(coord.id, 'beaconId', e.target.value)}
                            disabled={isSubmitting}
                          />
                          <input
                            type="text"
                            placeholder="-1.2921"
                            value={coord.lat}
                            onChange={(e) => handleCoordinateChange(coord.id, 'lat', e.target.value)}
                            className={
                              errors[`coord-${index}-lat`] 
                                ? 'error' 
                                : !latValid && coord.lat 
                                  ? 'warning' 
                                  : isValid ? 'valid' : ''
                            }
                            disabled={isSubmitting}
                          />
                          <input
                            type="text"
                            placeholder="36.8219"
                            value={coord.lng}
                            onChange={(e) => handleCoordinateChange(coord.id, 'lng', e.target.value)}
                            className={
                              errors[`coord-${index}-lng`] 
                                ? 'error' 
                                : !lngValid && coord.lng 
                                  ? 'warning' 
                                  : isValid ? 'valid' : ''
                            }
                            disabled={isSubmitting}
                          />
                          <div className="validation-status">
                            {isValid ? (
                              <span className="status-valid">✓ Valid</span>
                            ) : coord.lat || coord.lng ? (
                              <span className="status-invalid">⚠ Invalid</span>
                            ) : (
                              <span className="status-empty">Empty</span>
                            )}
                          </div>
                          <button 
                            type="button" 
                            className="remove-coord"
                            onClick={() => handleRemoveCoordinate(coord.id)}
                            disabled={isSubmitting}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button 
                    type="button" 
                    className="add-coord-btn"
                    onClick={handleAddCoordinate}
                    disabled={isSubmitting}
                  >
                    + Add Coordinate
                  </button>
                </>
              ) : (
                <div className="csv-upload">
                  <div className="form-group">
                    <label htmlFor="csvFile">Upload CSV File</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="csvFile"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        disabled={isSubmitting}
                      />
                      <div className="upload-placeholder">
                        <span className="upload-icon">📊</span>
                        <p>Upload CSV with Beacon ID, Latitude, Longitude</p>
                        <p className="file-types">CSV format: A, -1.2345, 36.7890</p>
                      </div>
                    </div>
                  </div>
                  
                  {csvData && (
                    <div className="csv-preview">
                      <h4>CSV Preview</h4>
                      <pre>{csvData}</pre>
                    </div>
                  )}
                </div>
              )}
              
              {errors.coordinates && <span className="error-text">{errors.coordinates}</span>}
              
              <div className="coordinate-help">
                <p>💡 <strong>Real-time Validation:</strong> Coordinates are validated as you type and shown on the map immediately.</p>
                <p>💡 <strong>Format:</strong> Use decimal degrees like -1.2921 for latitude and 36.8219 for longitude.</p>
                <p>💡 <strong>Sample Coordinates:</strong> Try -1.2921, 36.8219 for Nairobi area.</p>
                <p>💡 <strong>Visual Feedback:</strong> Green border = valid, Orange = invalid format, Red = validation error.</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Map and Summary */}
          <div className="map-column">
            {renderMap()}
            
            <div className="summary-card">
              <h2>Data Summary</h2>
              <div className="summary-items">
                <div className="summary-item">
                  <span className="label">Title Number:</span>
                  <span className="value">{formData.titleNumber || 'Not provided'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">County:</span>
                  <span className="value">{formData.county || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Land Size:</span>
                  <span className="value">
                    {formData.landSize ? `${formData.landSize} ${formData.landSizeUnit}` : 'Not provided'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Coordinates:</span>
                  <span className="value">{formData.coordinates.length} points</span>
                </div>
                <div className="summary-item">
                  <span className="label">Valid Coordinates:</span>
                  <span className="value">{validCoordinatesCount} points</span>
                </div>
                <div className="summary-item">
                  <span className="label">Calculated Area:</span>
                  <span className="value">
                    {polygonArea > 0 ? formatArea(polygonArea) : 'Not calculated'}
                  </span>
                </div>
                {polygonArea > 0 && (
                  <>
                    <div className="summary-item">
                      <span className="label">Area in Acres:</span>
                      <span className="value">{areaUnits.acres.toFixed(4)} acres</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Area in Hectares:</span>
                      <span className="value">{areaUnits.hectares.toFixed(4)} ha</span>
                    </div>
                  </>
                )}
                <div className="summary-item">
                  <span className="label">Documents:</span>
                  <span className="value">
                    {[
                      formData.deedPlanFile ? 1 : 0,
                      formData.surveyPlanFile ? 1 : 0,
                      ...formData.supportingDocs.map(() => 1),
                      formData.deedPlanText.trim() ? 1 : 0,
                      formData.surveyPlanText.trim() ? 1 : 0,
                      ...formData.supportingDocsTexts.map(text => text.trim() ? 1 : 0)
                    ].reduce((a, b) => a + b, 0)} total entries
                  </span>
                </div>
              </div>
              
              <div className="ai-preview">
                <h3>AI Analysis Preview</h3>
                <p>Once submitted, our AI will analyze your land based on the provided documents and coordinates to generate detailed insights.</p>
                
                {validCoordinatesCount >= 3 ? (
                  <div className="analysis-ready">
                    <span className="ready-badge">✓ Ready for Analysis</span>
                    <p>Your land boundary is complete and ready for AI analysis.</p>
                    <div className="polygon-status">
                      <div className="polygon-indicator active"></div>
                      <span>Land boundary drawn on real map with {validCoordinatesCount} points</span>
                    </div>
                  </div>
                ) : (
                  <div className="analysis-warning">
                    <span className="warning-badge">
                      {validCoordinatesCount > 0 ? `⚠ Needs ${3 - validCoordinatesCount} More` : '⚠ Needs Coordinates'}
                    </span>
                    <p>
                      {validCoordinatesCount > 0 
                        ? `Add ${3 - validCoordinatesCount} more valid coordinate(s) to complete the land boundary.`
                        : 'Add at least 3 valid coordinates to complete the land boundary.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="submit-section">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || validCoordinatesCount < 3}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Uploading and verifying land data...
              </>
            ) : (
              validCoordinatesCount >= 3 ? 'Analyze Land with AI' : 'Add More Coordinates'
            )}
          </button>
          
          <div className="form-requirements">
            <p><strong>Requirements:</strong> Title Number, Deed Plan, and at least 3 valid coordinates are required.</p>
            {validCoordinatesCount < 3 && (
              <p className="requirement-warning">
                ⚠ {validCoordinatesCount > 0 
                  ? `Add ${3 - validCoordinatesCount} more valid coordinate(s) to draw land boundary` 
                  : 'Add valid coordinates to draw land boundary'
                }
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LandDataInput;