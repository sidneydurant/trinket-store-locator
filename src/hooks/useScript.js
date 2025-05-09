import { useEffect, useState } from 'react';

export default function useScript(src) {
  try {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
      let script = document.querySelector(`script[src="${src}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = function () {
          setLoaded(true)
        }
        document.body.appendChild(script);
      } else {
        setLoaded(true)
      }
    }, [src]);
    return loaded;
  } catch (err) {
    console.error(`An error occurred while loading ${src}`);
  }
}
