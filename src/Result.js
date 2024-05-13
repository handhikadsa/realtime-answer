import './App.css';
import { collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from './utils/firebase';
import { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';

const Answer = ({ item }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef();

  const setPositionCallback = useCallback(() => {
    if (ref.current) {
      const rectWidth = ref.current.offsetWidth;
      const rectHeight = ref.current.offsetHeight;
      const cellSize = 100;
      const gridRows = Math.floor((window.innerHeight - rectHeight - 200) / cellSize);
      const gridColumns = Math.floor((window.innerWidth - rectWidth - 200) / cellSize);
      const randomRow = Math.floor(Math.random() * gridRows);
      const randomColumn = Math.floor(Math.random() * gridColumns);
      setPosition({
        top: `${randomRow * cellSize + 100}px`,
        left: `${randomColumn * cellSize + 100}px`,
      });
    }
  }, []);

  useLayoutEffect(() => {
    setPositionCallback();
  }, []);
  
  return (
    <div 
      ref={ref}
      className="text-dark bg-light p-3 rounded-3 shadow-lg fw-bold text-container"
      style={{
        animationDuration: `${Math.random() * 10 + 10}s`,
        position: 'absolute',
        top: position.top,
        left: position.left,
        transition: 'all 0.5s ease',
        fontSize: '25px',
      }}
    >
      {item.answer}
    </div>
  );
};  

const Results = () => { 
    const [answer, setAnswer] = useState([]);

    useEffect(() => {
      const unsubscribe = onSnapshot(
        query(collection(db, "answers"), orderBy("timestamp", "asc")),
        (snapshot) => {
          const newData = snapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
          setAnswer(newData);
        }
      );

      return () => unsubscribe();
    }, []);

    return (
      <div className="App">
        <header style={{backgroundColor: "#282c34", height: "100vh"}}>
          {answer?.map((item, i) => <Answer key={item.id} item={item} />)}
        </header>
      </div>
    )
}

export default Results;