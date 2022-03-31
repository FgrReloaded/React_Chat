import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import firebase from '../Firebase';
import { getDatabase, ref, set, onValue, push, query, orderByChild, equalTo } from "firebase/database";
import LoadingBar from 'react-top-loading-bar';


function CreateRoom() {
  const database = getDatabase(firebase);
  const history = useHistory();
  const [room, setRoom] = useState({roomname: ""});
  const [progress, setProgress] = useState(0);
  const refs = ref(database, 'rooms/');
  const save = (e) => {
    e.preventDefault();
    setProgress(100);
    const countRef = query(refs, orderByChild('roomname'), equalTo(room.roomname));
    onValue(countRef, (snapshot) => {
      if (snapshot.exists()) {
        alert("Room Already Present");
      } else {
        const pushRooms = push(refs);
        set(pushRooms, room);
        history.goBack();
      }
    }, {onlyOnce: true});
  }
  const onChange = (e) => {
    e.persist();
    setRoom({ ...room, [e.target.name]: e.target.value });
  };
  const Cancel = ()=>{
    history.goBack();
  }
  return (
    <>
    <LoadingBar height={3} color="red" progress={progress}
        onLoaderFinished={() => setProgress(0)} />
      <form onSubmit={save} className='form'>
        <div className="formBox">
          <input type="text" required className='nameInp' name="roomname" value={room.roomname} placeholder="Enter Room Name" onChange={onChange} />
          <button className='submit' type="submit">Create Room</button>
          <button onClick={Cancel} className='btn btn-warning' type="submit">Cancel</button>
        </div>
      </form>
    </>
  )
}

export default CreateRoom