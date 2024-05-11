import logo from './logo.svg';
import './App.css';
import { set, useForm } from "react-hook-form"
import { useEffect, useState } from 'react';

function App() {
  const [newData, setNewData] = useState([])
  const { register, handleSubmit } = useForm()
  
  const onSubmit = (data) => {
    console.log(data)
    setNewData([...newData, data])
  }

  useEffect(() => {
    console.log(newData)
  }, [newData])
    
  return (
    <div className="App">
      <header className="App-header">
        {
          newData.map((item, index) => {
            return (
              <div key={index} className="text-danger" style={{fontSize: 16}} role="alert">
                {item.answer}
              </div>
            )
          })
        }
        <form className="w-75" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="answer" className="form-label" style={{fontSize: 30}}>Email address</label>
            <input {...register("answer")} type="text" className="form-control" id="answer" aria-describedby="answer" />
          </div>
          <button type="submit" className="btn btn-primary px-5">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default App;
