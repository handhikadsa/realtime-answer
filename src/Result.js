import './App.css';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from './utils/firebase';
import { useEffect, useState, useRef, useCallback } from 'react';

const Answer = ({ item }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const ref = useRef();
  
    const setPositionCallback = useCallback(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setPosition({
          top: `${Math.random() * (100 - rect.height / window.innerHeight * 100)}vh`,
          left: `${Math.random() * (100 - rect.width / window.innerWidth * 100)}vw`,
        });
      }
    }, []);
  
    useEffect(() => {
      setPositionCallback();
    }, [setPositionCallback]);
  
    return (
        <div 
            ref={ref}
            className="text-white bg-dark p-3 rounded-3 shadow-lg"
            style={{
                animationName: 'flyAround',
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
                animationIterationCount: 'infinite',
                position: 'absolute',
                top: position.top,
                left: position.left,
                transition: 'all 0.5s ease',
                fontSize: '20px',
            }}
        >
            {item.answer}
      </div>
    );
};  

const Results = () => { 
    const [answer, setAnswer] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "answers"), (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
      setAnswer(newData);
    });

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