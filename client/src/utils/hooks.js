import { useState, useEffect } from 'react';

function useFetch(url) {

  const [data, setData] = useState([]);

  async function fetchUrl() {
    const response = await fetch(url);
    const json = await response.json();

    setData(json);
  }

  useEffect(() => {
    fetchUrl();
  }, []);

  return [data];

}

export { useFetch };