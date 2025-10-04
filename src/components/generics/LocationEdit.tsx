import React, { useState, useRef, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SubmitIcon, { SubmitIconRef } from './SubmitIcon';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type LocationValue = { lat: number; lon: number };

interface LocationEditProps {
  editable?: boolean;
  value: LocationValue;
  submitField?: string;
  submitRoute?: string;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onSuccess?: (response) => void;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onError?: (error) => void;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lon: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationEdit: React.FC<LocationEditProps> = ({
  editable = true,
  value: initialValue,
  submitField,
  submitRoute,
  onSuccess,
  onError,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<LocationValue>(initialValue);
  const submitIconRef = useRef<SubmitIconRef>(null);

  // Update value when prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Toggle editing mode
  const toggleEdit = () => {
    if (editable) {
      setIsEditing(!isEditing);
    }
  };

  // Handle location selection on map
  const handleLocationSelect = (lat: number, lon: number) => {
    setValue({ lat, lon });
  };

  // Handle key presses
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      submitIconRef.current?.submit();
    } else if (e.key === 'Escape') {
      setValue(submitIconRef.current?.lastSuccessfulData as LocationValue);
      if (!submitIconRef.current?.idle())
        await new Promise((resolve) => setTimeout(resolve, 500));
      setIsEditing(false);
    }
  };

  return (
    <div className="relative flex items-center w-full">
      {isEditing ? (
        <div 
          className="w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <MapContainer
            center={[value.lat, value.lon]}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
            className="rounded"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[value.lat, value.lon]} />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
          </MapContainer>
          <div className="text-sm text-gray-600 mt-1 px-1">
            Lat: {value.lat.toFixed(6)}, Lon: {value.lon.toFixed(6)}
          </div>
        </div>
      ) : (
        <div 
          className="w-full px-1 py-1 truncate"
          style={{paddingRight: ((editable) ? '1.75rem' : '0rem'), transition: 'padding-right 0.3s ease-in-out'}}
          onClick={undefined}
        >
          {value.lat !== 0 || value.lon !== 0 
            ? `${value.lat.toFixed(6)}, ${value.lon.toFixed(6)}` 
            : <span style={{opacity:0.25}}>No location set</span>
          }
        </div>
      )}
      
      <div className="flex items-center m-0 max-w-0">
        {submitField && submitRoute && (
          <div className="ml-2 absolute right-1"
            style={{opacity: isEditing ? 1 : 0, pointerEvents: 'none', cursor:"pointer", transition: 'opacity 0.3s ease-in-out'}}>
            <SubmitIcon
              ref={submitIconRef}
              data={value}
              submitField={submitField}
              submitRoute={submitRoute}
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
        )}
        
        <FaEdit
          className={"absolute right-1 w-5 h-5 cursor-pointer " + (submitIconRef.current?.idle() ? 'text-blue-500 hover:text-blue-700' : 'text-yellow-500 hover:text-yellow-600')}
          style={{opacity: (editable && !isEditing) ? 1 : 0, pointerEvents: (editable && !isEditing) ? 'auto' : 'none', cursor: (editable && !isEditing) ? 'pointer' : 'default', transition: 'opacity 0.3s ease-in-out'}}
          onClick={toggleEdit}
        />
      </div>
    </div>
  );
};

export default LocationEdit;
