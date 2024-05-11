import logo from './logo.svg';
import './App.css';
import { set, useForm } from "react-hook-form"
import { useEffect, useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from './utils/firebase';

function App() {
  const [count, setCount] = useState(0)
  const { register, handleSubmit, reset } = useForm()
  const [isAnswered, setIsAnswered] = useState(false)
  
  const onSubmit = async (data) => {
    console.log(data)
    try {
      const docRef = await addDoc(collection(db, "answers"), {
        answer: data.answer,    
      });
      setIsAnswered(true)
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    reset();
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="position-absolute top-0 start-50 translate-middle-x mt-5">
          <div className="row justify-content-center">
            <div className="col-4">
              <img className="w-100" src="/youth-logo.png" alt="" />
            </div>
          </div>
        </div>
        {
          isAnswered ?
          <div className="alert alert-success" role="alert">
            It's okay! Roh Kudus bersamamu!
          </div> :  
            <form className="w-75" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="answer" className="form-label mb-3" style={{fontSize: 25}}>Apa yang menjadi tantangan terbesar buat kamu dalam menjalankan ketaatan?</label>
                <input {...register("answer")} type="text" className="form-control mb-3" id="answer" aria-describedby="answer" placeholder="tulis jawaban mu di sini!" />
              </div>
              <button type="submit" className="btn btn-primary px-5">Kirim</button>
            </form>
          }
      </header>
    </div>
  );
}

export default App;
