import React from 'react'
import { useState } from 'react'
import './index.css'
import axios from "axios"
import { useEffect } from 'react'




const App = () => {
  const [notes,setNotes] = useState([])

  function fetchNotes(){
    axios.get("http://localhost:3000/notes")
    .then((res)=>{
      console.log(res.data)
      setNotes(res.data.note)
    })
  }

  useEffect(fetchNotes,[])

  async function submitHandler(e){
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;

    await axios.post("http://localhost:3000/notes",{
      title:title,
      description:description
    })
    .then((res)=>{
      console.log(res.data.message);
      fetchNotes();
      
    })

  }

  async function updateHandler(e,id){
    e.preventDefault();
    const description2 = e.target.description2.value;
    e.target.description2.value="";
    

    await axios.patch("http://localhost:3000/notes/"+id,{
      description:description2
    })
    .then((res)=>{
      fetchNotes();
      console.log(res.data.message);
      
      
    })

  }

  function deleteHandler(id){
    axios.delete("http://localhost:3000/notes/"+id)
    .then((res)=>{
      console.log(res.data.message);
      fetchNotes();
    })

  }
    

  


  
  return (
    <>
    <form action="" onSubmit={submitHandler}>
      <input id='title' type="text" placeholder='Enter Title'/>
      <input id='description' type="text" placeholder='Enter description' />
      <button>Submit</button>
    </form>

    <div className="notes">
      {notes.map((note)=>{
        return <div className="note">
          <h1>{note.title}</h1>
          <form action="" onSubmit={(e)=>{
            updateHandler(e,note._id)
          }}>
            <input id='description2' type="text" placeholder={note.description} />
            <button className='update'>Update</button>
          </form>
          <button onClick={()=>{
            deleteHandler(note._id)
          }}>Delete</button>
        </div>
      })}

    </div>
    </>
  )
}

export default App
