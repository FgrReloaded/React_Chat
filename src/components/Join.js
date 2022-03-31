import React, { useState } from 'react'
import './css/Join.css';
import { useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import firebase from '../Firebase';
import { getDatabase, ref, set, onValue, push, query, orderByChild, equalTo } from "firebase/database";


function Join() {
  const database = getDatabase(firebase);
  const history = useHistory();
  const [credential, setCredential] = useState({ name: '' });
  const [progress, setProgress] = useState(0);
  const refs = ref(database, 'users/');

  // Function to Handle Form Submission
  const handleForm = (e) => {
    e.preventDefault();
    setProgress(50);
    setProgress(100);
    const countRef = query(refs, orderByChild('name'), equalTo(credential.name));
    onValue(countRef, snapshot => {
      if (snapshot.exists()) {
        localStorage.setItem('name', credential.name);
        history.push('/rooms');
      } else {
        const pushUsers = push(refs);
        set(pushUsers, credential);
        localStorage.setItem('name', credential.name);
        history.push('/rooms');
      }
    }, {onlyOnce: true});
  }
  // This handle input field of name and set value of credential
  const handleChange = (e) => {
    e.persist();
    setCredential({ ...credential, [e.target.name]: e.target.value });
  }


  return (
    <>
      <LoadingBar height={3} color="red" progress={progress}
        onLoaderFinished={() => setProgress(0)} />

      <form onSubmit={handleForm} className='form'>
        <div className="formBox">
          <input className='nameInp' type="text" value={credential.name} onChange={handleChange} required placeholder='Enter Your Name' name='name' />
          <button className='submit' type='submit'>Join</button>
        </div>
      </form>
    </>
  )
}

export default Join