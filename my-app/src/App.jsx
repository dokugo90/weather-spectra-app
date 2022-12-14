import { useState, useEffect, useRef } from 'react'

function App() {
  const [country, setCountry] = useState("London")
  const [location, setLocation] = useState("London")
  const [speed, setSpeed] = useState("0")
  const [humidity, setHumidity] = useState("0")
  const [feel, setFeel] = useState("0")
  const [temp, setTemp] = useState("0")
  const [desc, setDesc] = useState("Description")
  const [chance, setChance] = useState(0)
  const [unit, setUnit] = useState("°C")
  const [theme, setTheme] = useState("dark_mode")
  const [visible, setVisible] = useState(false);
  const [condition, setCondition] = useState("")
  const [offline, setOffline] = useState(false)
  

  const mem = useRef("metric")
  const one = useRef()
  const timer = useRef()
  const otherTimer = useRef()

  const styles = {
    width: 500,
    height: 500,
    backgroundColor: "black",
    borderRadius: 15,
    boxShadow: "0px 15px 10px black",
    marginTop: 30,
    transition: ".5s",
    marginBottom: 50
  }

  const inputStyle = {
    outline: "none",
  border: "none",
  width: 200,
  height: 30,
  borderBottom: "3px solid white",
  background: "transparent",
  fontWeight: "bolder",
  color: "white",
  transition: ".5s",
  fontFamily: "Concert One, cursive"
  }

  const searchIcon = {
    cursor: "pointer",
    color: "white",
    transition: ".5s",
    marginLeft: "-15px"
  }

  const textColor = {
    color: "white",
    textAlign: "center",
    fontWeight: "bolder",
    transition: ".5s",
    fontFamily: "Concert One, cursive",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }

  const unitStyle = {
    color: "white",
    cursor: "pointer",
    fontWeight: "bolder",
    transition: ".5s",
    fontFamily: "Concert One, cursive"
  }

  if (localStorage.getItem("theme") && localStorage.getItem("theme") == "light_mode") {
    styles.backgroundColor = "white"
    inputStyle.color = "black";
    inputStyle.borderBottom = "3px solid black"
    searchIcon.color = "black"
    textColor.color = "black"
    unitStyle.color = "black"
  } else {
    styles.backgroundColor = "black"
    inputStyle.color = "white";
    inputStyle.borderBottom = "3px solid white"
    searchIcon.color = "white"
    textColor.color = "white"
    unitStyle.color = "white"
  };

  function handleTheme() {
    if (theme == "dark_mode") {
      setTheme("light_mode")
      localStorage.setItem("theme", theme)
    } else if (theme == "light_mode") {
      setTheme("dark_mode")
      localStorage.setItem("theme", theme)
    }
  }

  function handleUnit() {
    getWeather()
    if (unit == "°C") {
      setUnit("°F")
      mem.current = "imperial"
    } else {
      setUnit("°C")
      mem.current = "metric"
    }
  }

  async function getWeather() {
    try {
        const locationReq = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=${1}&appid=28fe7b5f9a78838c639143fc517e4343`, {
          mode: "cors"
        })
        const locationRes = await locationReq.json()
        const weatherReq = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${locationRes[0].lat}&lon=${locationRes[0].lon}&units=${mem.current}&appid=28fe7b5f9a78838c639143fc517e4343`, { mode: "cors" });
        const weatherRes = await weatherReq.json();
        /*console.log(locationRes)
        console.log(weatherRes)*/
        setLocation(`${locationRes[0].name}, ${locationRes[0].country}`)
          setTemp(Math.round(weatherRes["current"].temp))
          setSpeed(weatherRes["current"].wind_speed)
          setHumidity(Math.round(weatherRes["current"].humidity))
          setFeel(Math.round(weatherRes["current"].feels_like))
          one.current = weatherRes["current"]["weather"][0].description.charAt(0).toUpperCase()
          setDesc(one.current + weatherRes["current"]["weather"][0].description.substring(1))
          setChance(weatherRes["hourly"][45].pop)
          if (weatherRes["current"]["weather"][0].description.includes("cloud")) {
            setCondition("cloud")
          } else if (weatherRes["current"]["weather"][0].description.includes("rain")) {
            setCondition("thunderstorm")
          } else if (weatherRes["current"]["weather"][0].description.includes("sky")) {
            setCondition("light_mode")
          } else if (weatherRes["current"]["weather"][0].description.includes("fog")) {
            setCondition("filter_drama")
          } else if (weatherRes["current"]["weather"][0].description == "mist") {
            setCondition("water_drop")
          } else {
            setCondition("nightlight")
          }
        
    } catch(err) {
      setVisible(true)
          return ;
    }
  }

  if (visible == true) {
    timer.current = setTimeout(function() {
      setVisible(false);
    }, 5000);
  } else {
    clearTimeout(timer.current)
  }

  window.addEventListener("load", getWeather)
  window.addEventListener("offline", () => {
    setOffline(true)
  })

  if (offline == true) {
    otherTimer.current = setTimeout(function() {
      setVisible(false);
    }, 5000);
  } else {
    clearTimeout(otherTimer.current)
  }
 
  return (
   <div>
     {
     visible &&
     <div className='flex'>
     <div className='error-msg'> 
     <p style={{marginTop: 15}}>There was an error processing your request</p>
     </div>
     </div>
     }
     {
     offline &&
     <div className='flex'>
     <div className='error-msg'> 
     <p style={{marginTop: 15}}>No Internet Connection</p>
     </div>
     </div>
     }
    <h1 className='app-name'>Weather Spectra</h1>
    <i className='theme-mode-btn material-icons' onClick={() => handleTheme()}>{
      localStorage.getItem("theme") ?
      localStorage.getItem("theme")
      : "light_mode"
    }</i>
    <div className='weather-modal'>
    <div style={styles}>
    <form action="#">
    <h6 style={unitStyle} onClick={() => handleUnit()}>{unit}</h6>
    <input type="text" style={inputStyle} placeholder='City' onChange={e => setCountry(e.target.value)}/>
    <i style={searchIcon} className='material-icons' onClick={() => getWeather()}>search</i>
</form>
    <h2 style={textColor}><i className='material-icons'>flag</i>{location}</h2>
    <h3 style={textColor}>{temp} {unit}</h3>
    <h4 style={textColor}><i className='material-icons'>air</i> Wind Speed: {speed} mph</h4>
    <h4 style={textColor}><i className='material-icons'>water_drop</i> Humidity: {humidity} %</h4>
    <h4 style={textColor}><i className='material-icons'>thermostat</i> Feels Like: {feel} {unit}</h4>
    <h4 style={textColor}><i className='material-icons'>{condition}</i> {desc}</h4>
    <h4 style={textColor}><i className='material-icons'>thunderstorm</i> Chance of Rain: {Math.round(chance * 100)} %</h4>
    </div>
    </div>
   </div>
  )
}

export default App;
