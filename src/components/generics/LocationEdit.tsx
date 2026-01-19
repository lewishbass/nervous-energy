import React, { useState, useRef, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import SubmitIcon, { SubmitIconRef } from './SubmitIcon';

import { Map, Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaAngleDown } from 'react-icons/fa';

type LocationValue = { lat: number; lon: number };

interface LocationEditProps {
  editable?: boolean;
  value: string | LocationValue;
  submitField?: string;
  submitRoute?: string;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onSuccess?: (response) => void;
  // @ts-expect-error some of your api calls are gonna be anys and you just have to deal with it
  onError?: (error) => void;
}

/**
 * Simple placeholder used for testing.
 * Renders a white box and accepts the same props as the real component.
 */
const LocationEdit: React.FC<LocationEditProps> = ({
  editable = true,
  value: initialValue,
  submitField,
  submitRoute,
  onSuccess,
  onError,
}) => {

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<LocationValue>(initialValue as LocationValue);
  const submitIconRef = useRef<SubmitIconRef>(null);
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isFadingIn, setIsFadingIn] = useState<boolean>(false);

  const mapStyles: string[] = [
    "mapbox://styles/mapbox/streets-v11",
    "mapbox://styles/mapbox/satellite-v9",
    "mapbox://styles/mapbox/outdoors-v11",
    "mapbox://styles/mapbox/light-v10",
    "mapbox://styles/mapbox/dark-v10",
  ]

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    setTimeout(() => {
      setIsFadingIn(true);
    }, 1500);
  }, []);

  useEffect(() => {
    if (typeof initialValue === 'string') {
      const [lat, lon] = initialValue.split(',').map(Number);
      setValue({ lat, lon });
    } else {
      setValue(initialValue);
    }
  }, [initialValue]);

  const toggleEdit = () => {
    if (editable) {
      setIsEditing(!isEditing);
      // Focus input when entering edit mode
      setTimeout(() => {
        if (containerRef.current && !isEditing) {
          containerRef.current.focus();
        }
      }, 10);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key down:', e.key);
    if (e.key === 'Enter') {
      submitIconRef.current?.submit();
    } else if (e.key === 'Escape') {
      setValue(submitIconRef.current?.lastSuccessfulData as LocationValue);
      if (!submitIconRef.current?.idle())
        await new Promise((resolve) => setTimeout(resolve, 500));
      setIsEditing(false);
      console.log(submitIconRef.current?.idle());
    }
  };

  const handleMapClick = (event: any) => {
    if (!isEditing) return;
    setValue({ lat: event.lngLat.lat, lon: event.lngLat.lng });
  }

  useEffect(() => {
    if (!editable) setIsEditing(false);
  }, [editable]);

  return (
    <div className="relative w-full tc1">
      <div className={`max-w-full w-full ${isEditing ? 'h-96' : 'h-48'} transition-all duration-300 bg2 rounded-lg relative overflow-hidden shadow-lg outline-hidden `}
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsEditing(false)}>
        {isLoaded && <Map
          initialViewState={{
            latitude: value.lat,
            longitude: value.lon,
            zoom: 14
          }}
          style={{
            width: "100%",
            height: "200%",
            zIndex: 20,
            position: 'absolute',
            top: isEditing ? '0' : '-50%',
            opacity: isFadingIn ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out, top 0.3s ease-in-out'
          }}
          mapStyle={mapStyles[0]}
          mapboxAccessToken={"pk.eyJ1Ijoid29ybGRzaW5nZXIiLCJhIjoiY202Z2hscG9zMDFhczJpb296Y2I2dDlvayJ9.Fv0uqkCRxvu1tb07rt5Qog"}
          interactive={isEditing}
          attributionControl={false}
          scrollZoom={isEditing}
          dragPan={isEditing}
          onClick={handleMapClick}
          ref={mapRef}
        >
          <Marker longitude={value.lon} latitude={value.lat} anchor="bottom">
            <FaAngleDown
              className={`inline-block mr-2 text-[#f00] text-3xl -mb-2`}
            />
          </Marker>
        </Map>}
        {submitField && submitRoute && (
          <div className="ml-2 absolute right-1 top-1 z-40 rounded-full bg1"
            style={{ opacity: isEditing ? 1 : 0, pointerEvents: 'none', cursor: "pointer", transition: 'opacity 0.3s ease-in-out' }}>
            <SubmitIcon
              ref={submitIconRef}
              data={`${value.lat}, ${value.lon}`}
              submitField={submitField}
              submitRoute={submitRoute}
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
        )}
        <FaEdit
          className={"bg1 rounded-full absolute right-1 top-1 w-5 h-5 z-40 cursor-pointer overflow-visible " + (submitIconRef.current?.idle() ? 'text-blue-500 hover:text-blue-700' : 'text-yellow-500 hover:text-yellow-600')}
          style={{ opacity: (editable && !isEditing) ? 1 : 0, pointerEvents: (editable && !isEditing) ? 'auto' : 'none', cursor: (editable && !isEditing) ? 'pointer' : 'default', transition: 'opacity 0.3s ease-in-out' }}
          onClick={toggleEdit}
        />
        <div className="absolute bottom-2 left-2 bg-white/75 dark:bg-gray-800/75 rounded px-2 py-1 text-sm z-40 cursor-pointer select-none" style={{ fontFamily: 'monospace' }}>
          <p>{`Lat: ${value.lat > 0 ? '\u00A0' : ''}${value.lat.toFixed(4)}`}</p>
          <p>{`Lon: ${value.lon > 0 ? '\u00A0' : ''}${value.lon.toFixed(4)}`}</p>
          <div 
            className={`${isEditing ? 'max-h-10 opacity-100 mt-2 py-1' : 'max-h-0 opacity-0'} 
              transition-all duration-300 
              text-center text-blue-600 dark:text-blue-400 
              hover:text-blue-800 dark:hover:text-blue-300 
              border-t border-gray-300 dark:border-gray-600 
              font-medium tracking-wide`}
            onClick={() => { submitIconRef.current?.submit(); setIsEditing(false); }}
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationEdit;
