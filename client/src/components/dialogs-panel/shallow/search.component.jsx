import React, { useState, useCallback, useRef, useEffect } from 'react';
import ResultBox from '../result-box.component';
import Animate from 'rc-animate';
import debounce from 'lodash.debounce';

const Search = ({ token }) => {
  const [value, setValue] = useState('');
  const [isReady, setReady] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const outsideDetection = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setReady(false);
      }
    };

    document.addEventListener('mousedown', outsideDetection);
    return () => {
      document.removeEventListener('mousedown', outsideDetection);
    };
  }, [boxRef]);

  const startSearching = useCallback(
    debounce(() => {
      setReady(true);
    }, 600),
    []
  );

  const handleSearch = (e) => {
    setValue(e.target.value);
    setReady(false);
    startSearching();
  };

  return (
    <div className="dialogs-panel__search">
      <input
        onChange={handleSearch}
        value={value}
        className="search-input"
        placeholder="Search user"
        type="search"
      />
      <Animate component="" transitionName="fade">
        {value && isReady ? (
          <div ref={boxRef} className="search-box">
            <ResultBox token={token} searchText={value} setReady={setReady} />
          </div>
        ) : null}
      </Animate>
    </div>
  );
};

export default Search;
