import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'moment';
import './css/Rooms.css';
import firebase from '../Firebase';
import LoadingBar from 'react-top-loading-bar';
import { getDatabase, ref, onValue, push, set, query, orderByChild, equalTo, update } from 'firebase/database';


function Rooms() {
  const database = getDatabase(firebase);
  const history = useHistory();
  const [room, setRoom] = useState([]);
  const [progress, setProgress] = useState(0);
  const [name, setName] = useState('');
  const refs = ref(database, 'rooms/')
  const chatRefs = ref(database, 'chats/');
  const roomUserRefs = ref(database, 'roomusers/');

  // Fetch data when rooms page visited
  useEffect(() => {
    const fetchData = () => {
      setProgress(100);
      setName(localStorage.getItem('name'));
      onValue(refs, response => {
        setRoom([]);
        setRoom(snapshotToArray(response));
      });
    };

    fetchData();
  }, []);

  // This function will get response and get the value and then return a array with each value with it's key.
  const snapshotToArray = (snapshot) => {
    const Arr = [];
    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      Arr.push(item);
    });
    return Arr;
  };



  const enterChatRoom = (roomname) => {
    const chat = { roomname: '', name: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.name = name;
    chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
    chat.message = `${name} joined`;
    chat.type = 'join';

    const newMessage = push(chatRefs);
    set(newMessage, chat);

    const countRef = query(roomUserRefs, orderByChild('roomname'), equalTo(roomname));
    onValue(countRef, (resp) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.name === name);
      if (user !== undefined) {
        const userRef = ref(database, 'roomusers/' + user.key);
        update(userRef, { status: 'online' });

      } else {
        const newroomuser = { roomname: '', name: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.name = name;
        newroomuser.status = 'online';
        const newRoomUser = push(roomUserRefs);
        set(newRoomUser, newroomuser);
      }
    });

    history.push('/chatroom/' + roomname);
  };

  const logout = () => {
    localStorage.removeItem('name');
    history.push('/join');
  }


  return (
    <>
      <LoadingBar height={3} color="red" progress={progress}
        onLoaderFinished={() => setProgress(0)} />
      <div className='container-md container-fluid roomPage mt-0 mt-md-5'>
        <div className='row'>
          <div className='col-12 heading'>
            <h3>{name} <button className='btn btn-danger btn-sm' onClick={() => { logout() }}>Logout</button></h3>
          </div>
          <div className="col-12 roomAdd mt-1">
            <h2>Rooms List</h2>
            <button className='btn btn-info addRoom mb-1'><Link to="/createroom">Add Room</Link></button>
          </div>
          <div>
            {room.map((item, idx) => (
              <div key={idx} className='roomName bg-primary' onClick={() => { enterChatRoom(item.roomname) }}>{item.roomname}</div>
            ))}
          </div>
        </div>
      </div>

    </>
  )
}

export default Rooms