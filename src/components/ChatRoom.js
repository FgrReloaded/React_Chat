import React, { useState, useEffect } from 'react'
import Moment from 'moment';
import './css/ChatRoom.css';
import firebase from '../Firebase';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useParams, useHistory } from 'react-router-dom';
import { getDatabase, ref, onValue, push, set, query, orderByChild, equalTo, update } from 'firebase/database';


function ChatRoom() {
  const database = getDatabase(firebase);
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [roomname, setRoomname] = useState('');
  const [newchat, setNewchat] = useState({ roomname: '', name: '', message: '', date: '', type: '' });
  const history = useHistory();
  const { room } = useParams();
  const refs = ref(database, 'rooms/');
  const chatRefs = ref(database, 'chats/');
  const roomUserRefs = ref(database, 'roomusers/');

  useEffect(() => {
    const fetchData = () => {
      setName(localStorage.getItem('name'));
      setRoomname(room);
      const chatCountRefs = query(chatRefs, orderByChild('roomname'), equalTo(roomname));
      onValue(chatCountRefs, response => {
        setChats([]);
        setChats(snapshotToArray(response));
      });
    };

    fetchData();
  }, [room, roomname]);

  useEffect(() => {
    const fetchData = () => {
      setName(localStorage.getItem('name'));
      setRoomname(room);
      const countRef = query(roomUserRefs, orderByChild('roomname'), equalTo(roomname));
      onValue(countRef, response2 => {
        setUsers([]);
        const roomusers = snapshotToArray(response2);
        setUsers(roomusers.filter(x => x.status === 'online'));
      })
    };

    fetchData();
  }, [room, roomname]);

  const snapshotToArray = (snapshot) => {
    const Arr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      Arr.push(item);
    });

    return Arr;
  };

  const submitMessage = (e) => {
    e.preventDefault();
    const chat = newchat;
    chat.roomname = roomname;
    chat.name = name;
    chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
    chat.type = 'message';
    const newMessage = push(chatRefs);
    set(newMessage, chat);
    setNewchat({ roomname: '', name: '', message: '', date: '', type: '' });
  };

  const onChange = (e) => {
    e.persist();
    setNewchat({ ...newchat, [e.target.name]: e.target.value });
  }

  const exitChat = (e) => {
    const chat = { roomname: '', name: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.name = name;
    chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
    chat.message = `${name} left`;
    chat.type = 'exit';
    const newMessage = push(chatRefs);
    set(newMessage, chat);

    const countRef = query(roomUserRefs, orderByChild('roomname'), equalTo(roomname));
    onValue(countRef, (resp) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.name === name);
      if (user !== undefined) {
        const userRef = ref(database, 'roomusers/' + user.key);
        update(userRef, { status: 'offline' });
      }
    }, { onlyOnce: true });

    history.goBack();
  }
  return (
    <>
      <div className="container-fluid container-md">
        <div className="row chatHead">
          <div className="col-12 order-1 head">
            <button type="button" className="btn-danger btn-sm btn" onClick={() => { exitChat() }}>Exit Chat</button>
            <button className='btn-warning btn-sm btn'>Room: {room}</button>
          </div>
          <div className="col-2 order-last order-md-2">
            {users.map((item, idx) => (
              <div key={idx} className="UsersCard">
                <div className='userName'>{item.name}</div>
              </div>
            ))}
          </div>
          <div className="col-md-10 order-3 col-12">
            <ScrollToBottom className="ChatContent">
              {chats.map((item, idx) => (
                <div key={idx} className="MessageBox mb-1">
                  {item.type === 'join' || item.type === 'exit' ?
                    <div className="ChatStatus">
                      <span className="ChatDate">{item.date}</span>
                      <span className={`${item.type === 'exit' ? "chatLeave" : "chatJoin"}`}>{item.message}</span>
                    </div> :
                    <div className="ChatMessage">
                      <div className={`${item.name === name ? "RightBubble" : "LeftBubble"}`}>
                        {item.name === name ?
                          <span className="MsgName">Me</span> : <span className="MsgName">{item.name}</span>
                        }
                        <p>{item.message}</p>
                      </div>
                    </div>
                  }
                </div>
              ))}
            </ScrollToBottom>
          </div>
          <div className="col-md-8 order-4 col-12">
            <footer className="StickyFooter">
              <form className="MessageForm" onSubmit={submitMessage}>
                <input type="text" required className='nameInp msgInp' name="message" id="message" placeholder="Enter message here" value={newchat.message} onChange={onChange} />
                <button className='btn btn-success my-4 mx-2' type="submit">Send</button>
              </form>
            </footer>
          </div>
        </div>
      </div >
    </>
  )
}

export default ChatRoom