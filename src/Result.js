import './App.css';
import { collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from './utils/firebase';
import { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';

const Answer = ({ item }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [step, setStep] = useState(0);
    const [maxSteps, setMaxSteps] = useState(Math.floor(Math.random() * 5) + 5); // Random number between 5 and 10
    const ref = useRef();
  
    const setPositionCallback = useCallback(() => {
      if (ref.current) {
        const rectWidth = ref.current.offsetWidth;
        const rectHeight = ref.current.offsetHeight;
        const cellSize = 100; // Size of each cell in the grid
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
    }, [setPositionCallback]);
  
    return (
        <div 
            ref={ref}
            className="text-dark bg-light p-3 rounded-3 shadow-lg fw-bold text-container"
            style={{
                animationName: 'flyAround',
                animationDuration: `${Math.random() * 8 + 8}s`,
                animationDelay: `${Math.random() * 5}s`,
                animationIterationCount: 'infinite',
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

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []); // Only set up the subscription when the component mounts

    return (
        <div className="App">
            <header style={{backgroundColor: "#282c34", height: "100vh"}}>
                {answer?.map((item, i) => <Answer key={i} item={item} />)}
            </header>
        </div>
    )
}

export default Results;