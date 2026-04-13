import debounce from 'lodash/debounce';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

interface FloatingInputFieldProps {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  error?: string;
}

export const FloatingInputField = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = ' ',
  disabled = false,
  readOnly = false,
  className = 'form-control ant-input-floating-control',
  error,
}: FloatingInputFieldProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const cancelTokenRef = useRef<any>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (word: string) => {
    if (!word) {
      setSuggestions([]);
      return;
    }

    try {
      // cancel previous request
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Cancelled previous request');
      }

      cancelTokenRef.current = axios.CancelToken.source();

      const response = await axios.get('https://api.datamuse.com/sug', {
        params: { s: word },
        cancelToken: cancelTokenRef.current.token,
      });

      setSuggestions(response.data.map((item: any) => item.word));
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error('API Error:', error);
    }
  };

  const debouncedFetch = useRef(
    debounce((word: string) => {
      fetchSuggestions(word);
    }, 300),
  ).current;

  const handleChange = (val: string) => {
    onChange(val);

    const lastWord = val.split(' ').pop();

    if (!lastWord) {
      setSuggestions([]);
      return;
    }

    debouncedFetch(lastWord);
  };

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const applySuggestion = (suggestion: string) => {
    const words = value.split(' ');
    words[words.length - 1] = suggestion;
    onChange(words.join(' '));
    setSuggestions([]);
  };

  return (
    <div ref={inputContainerRef} className="position-relative">
      <div
        className={`form-floating ant-input-floating ${
          error ? 'has-error' : ''
        }`}
      >
        <input
          id={id}
          type={type}
          className={className}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          spellCheck
          onChange={e => handleChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setSuggestions([]);
            }
          }}
          onBlur={() => {
            // A short delay
            setTimeout(() => {
              setSuggestions([]);
            }, 200);
          }}
        />
        <label htmlFor={id}>{label}</label>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 &&
        typeof document !== 'undefined' &&
        createPortal(
          <ul
            ref={el => {
              if (el && inputContainerRef.current) {
                const rect = inputContainerRef.current.getBoundingClientRect();
                el.style.top = `${rect.bottom + window.scrollY}px`;
                el.style.left = `${rect.left + window.scrollX}px`;
                el.style.width = `${rect.width}px`;
              }
            }}
            className="list-group position-absolute shadow"
            style={{
              zIndex: 999999,
              maxHeight: '250px',
              overflowY: 'auto',
            }}
          >
            {suggestions.slice(0, 5).map((s, i) => (
              <li
                key={i}
                className="list-group-item list-group-item-action"
                style={{ cursor: 'pointer' }}
                onClick={() => applySuggestion(s)}
              >
                {s}
              </li>
            ))}
          </ul>,
          document.body,
        )}

      {error && <div className="announce-master-field-error">{error}</div>}
    </div>
  );
};
