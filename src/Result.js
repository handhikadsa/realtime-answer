import "./App.css";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./utils/firebase";
import { useEffect, useState, useRef } from "react";

const Answer = ({ item }) => {
  const ref = useRef(null);

  // We use a ref to track position and velocity to prevent constant React re-renders
  const motion = useRef({
    // Start at random coordinates (keeping a safe distance from edges initially)
    x: Math.random() * (window.innerWidth - 300),
    y: Math.random() * (window.innerHeight - 100),
    // Start with a random direction and speed
    dx: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.1 + 0.4),
    dy: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.1 + 0.4),
  });

  useEffect(() => {
    let animationId;
    const el = ref.current;

    const animate = () => {
      if (!el) return;

      // Get current dimensions of the element and window
      const rect = el.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      // Check boundaries and "Bounce" horizontally
      if (motion.current.x <= 0 || motion.current.x >= maxX) {
        motion.current.dx *= -1; // Reverse direction
        // Force the element back inside if it gets trapped outside the screen
        motion.current.x = motion.current.x <= 0 ? 0 : maxX;
      }

      // Check boundaries and "Bounce" vertically
      if (motion.current.y <= 0 || motion.current.y >= maxY) {
        motion.current.dy *= -1; // Reverse direction
        motion.current.y = motion.current.y <= 0 ? 0 : maxY;
      }

      // Update coordinates
      motion.current.x += motion.current.dx;
      motion.current.y += motion.current.dy;

      // Apply the position directly to the DOM for high performance
      el.style.transform = `translate(${motion.current.x}px, ${motion.current.y}px)`;

      // Loop the animation
      animationId = requestAnimationFrame(animate);
    };

    // Start the loop
    animationId = requestAnimationFrame(animate);

    // Cleanup animation if the component unmounts
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      ref={ref}
      className="bg-white p-3 rounded-3 font-bold text-container text-[#325630] absolute text-[22px] max-w-[400px] break-words monkey leading-tight"
      style={{
        position: "absolute",
        willChange: "transform", // Helps browser optimize the animation
      }}
    >
      {item.answer}
    </div>
  );
};

const Results = () => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // Limit to 50 items and order by newest first
    const q = query(
      collection(db, "answers"),
      orderBy("timestamp", "desc"),
      limit(50),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAnswers(newData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {/* Added overflow hidden so scrollbars don't flash during bouncing */}
      <header className="bg-[#325630] h-dvh overflow-hidden relative">
        {answers?.map((item) => (
          <Answer key={item.id} item={item} />
        ))}
      </header>
    </div>
  );
};

export default Results;
