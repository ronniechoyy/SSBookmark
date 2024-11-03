import { useEffect } from 'react';
import "./Popup.css";
import Mother from '../components/Mother';

export default function() {
  useEffect(() => {
    console.log("Hello from the popup!");
  }, []);

  return (
    // <div className=''>
    //   <img src="/icon-with-shadow.svg" />
    //   <h1>vite-plugin-web-extension</h1>
    //   <p>
    //     Template: <code>react-js</code>
    //   </p>
    // </div>
    <Mother />
  )
}
