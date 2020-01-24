import React, { useState, useEffect } from 'react';
import api from  './services/api'; 

import './global.css';
import'./App.css'; 
import './Sidebar.css'; 
import './Main.css';

//componente: Bloco isolado de Html css e js o qual não interfere no resto da aplicação 
// Porpiedade: Informacões que um componente Pai passa para componentes Filho 
//estado : informações mantidas pelo componente (lembrar: imultabilidade)

function App() {
  const [ devs, setDevs] = useState([]);
  const[latitude, setlatitude] = useState(''); 
  const[longitude, setlongitude] = useState(''); 

  const[github_username, setGithubUsername] = useState(''); 
  const[techs, setTechs] = useState(''); 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude,longitude} = position.coords;

        setlatitude(latitude);
        setlongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    )
  }, []);

  useEffect(() =>{ 
    async function loadDevs(){
      const response = await api.get('/devs');

      setDevs(response.data);
    }
    loadDevs();
  },[]);
  async function handleAddDev(e){
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude,
    })
    setGithubUsername('');
    setTechs('');
    

  }

  return (
  <div id="app">
    <aside>
      <strong>Cadastrar</strong>
      <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do Github</label>
            <input
             name= "github_username" 
             id="github_username" 
             value={github_username}
             onChange= {e => setGithubUsername(e.target.value)}
             required
             /> 
          </div>

          <div className="input-block">
            <label htmlFor="techs"> Tecnologias </label>
            <input 
            name= "techs" 
            id="techs" 
            value={techs}
            onChange= {e => setTechs(e.target.value)}
            required
            /> 
          </div>

          <div className="input-group">
            <div className="input-block">
            <label htmlFor="latitude"> Latitude </label>
            <input
             type="number" 
            name= "latitude" 
            id="latitude" 
            value={latitude}
            onChange={e => setlatitude(e.target.value)}
            required 
            /> 
          </div>


          <div className="input-block">
            <label htmlFor="longitude"> Longitude </label>
            <input
             type="number"
             name= "longitude" 
             id="longitude"
             required 
             value={longitude}
             onChange={e => setlongitude(e.target.value)}
             /> 
          </div>  
        </div>

        <button type="submit">Salvar</button>
      </form>
    </aside>
    <main>
      <ul>
        {devs.map(dev => (
           <li key={dev._id} className="dev-item">
           <header>
             <img src={dev.avatar_url} alt={dev.name}/> 
             <div className="user_info"> 
               <strong> {dev.name} </strong>
               <span>{dev.techs.join(', ')}</span>
             </div>
           </header>
           <p>F{dev.bio}</p>
           <a href={`http://github.com/${dev.github_username}`}>Acessar perfil no github</a>
         </li>
        ))}
      </ul>
    </main>
  </div>
  );
}

export default App;
