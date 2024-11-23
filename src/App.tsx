import  { useState, useEffect } from "react";
import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";
import { IoIosSearch, IoIosClose } from "react-icons/io";
import { IconContext } from "react-icons";

function MyCustomComponent() {
  const { mapData, mapView } = useMap();
  const [input1, setInput1] = useState('');
  const [autofill1, setAutofill1] = useState<JSX.Element[]>([])
  const [input2, setInput2] = useState('');
  const [autofill2, setAutofill2] = useState<JSX.Element[]>([])

  const [showMenu, setShowMenu] = useState(true)

  mapView.expand()
  mapView.Outdoor.setStyle('https://tiles-cdn.mappedin.com/styles/starlight/style.json');
  var spaceList: string[] = []
  var collapsedList: string[][] = []
  mapData.getByType("space").forEach((space) => {
    if (space.name){
      spaceList.push(space.name.trim())
      collapsedList.push([space.name.trim(), space.floor.name])
    }
    mapView.updateState(space, {
      interactive: true,
      hoverColor: "#1374c5",
    });
  });
  mapData.getByType("connection").forEach((connection) => {
    const coords = connection.coordinates.find(
      (coord) => coord.floorId === mapView.currentFloor.id
    );
    if (coords) {
      mapView.Labels.add(coords, connection.name);
    }
  });
  var fullList:string[] = spaceList
  spaceList = [...new Set(spaceList)]
  spaceList.sort()
  collapsedList = [...new Set(collapsedList)]
  collapsedList.sort()

  const router = (space1:string, space2:string) => {
    const firstSpace = mapData.getByType('space').find(s => s.id === space1);
    const secondSpace:any[] = []
    mapData.getByType('space').forEach(s => {
      if (s.name==space2){
        secondSpace.push(s)
      }
    });
    if (firstSpace && secondSpace) {
      const directions = mapView.getDirections(firstSpace, secondSpace);
      if (directions) {
        mapView.Navigation.draw(directions);
        setShowMenu(false)
        setAutofill2([])
        setInput2('')
        setContent2(['', ''])
      }
    } else {
      
    }
  }

  const [content1, setContent1] = useState(['', '', '', ''])
  const [content2, setContent2] = useState(['', ''])

  const runMenu1 = (strs:string[]) => {
    let itemCount:number = 0
    for (let i = 0; i<collapsedList.length; i++){
      if (collapsedList[i][0]==strs[0]){
        itemCount+=1
      }
    }
    if (itemCount==1){
      var images: string = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
      mapData.getByType("space").forEach((space) => {
        if (space.name==strs[0]&&space.floor.name==strs[1]){
          if (space.images.length>0){
            images = space.images[0]
          }
          setContent1([strs[0], strs[1], images, space.id])
        }
      });
      setInput1(strs[0])
      setAutofill1([])
      setTimeout(function(){setAutofill1([]), 1})
    } else {
      console.log('error')
    }
  }
  const runMenu2 = (nameStr:string) => {
    let itemCount:number = 0
    for (let i = 0; i<fullList.length; i++){
      if (fullList[i]==nameStr){
        itemCount+=1
      }
    }
    if (itemCount==1){
      var images: string = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
      mapData.getByType("space").forEach((space) => {
        if (space.name==nameStr){
          if (space.images.length>0){
            images = space.images[0]
          }
          setContent2([nameStr, images])
        }
      });
      setInput2(nameStr)
      setTimeout(function(){setAutofill2([]), 1})
    } else if (itemCount>1){
      var images: string = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
      mapData.getByType("space").forEach((space) => {
        if (space.name==nameStr){
          if (space.images.length>0){
            images = space.images[0]
          }
          setContent2([nameStr, images])
        }
      });
      setAutofill2([])
      setInput2('')
      setContent2(['', ''])
      setAutofill1([])
      setInput1('')
      setContent1(['', '', '', ''])
    } else {
      console.log(itemCount)
    }
  }

  useEffect(()=>{
    var rows: JSX.Element[] = []
    for (let i = 0; i<collapsedList.length; i++){
      if ((input1!='')&&(collapsedList[i][0].toLowerCase().indexOf(input1.toLowerCase())!=-1)){
        rows.push(
          <div key={i} className="hover:bg-[#eee] py-[0.3rem] px-[20px] border-t-[1px] border-t-[#bbb] border-t-solid text-[0.9rem] cursor-pointer bg-white flex flex-row gap-4" onClick={()=>{
            runMenu1(collapsedList[i])
          }}>
            <p className="text-[#222]">{collapsedList[i][0]}</p>
            <p className="text-[#999]">{collapsedList[i][1]}</p>
          </div>
        )
      }
    }
    setAutofill1(rows)
  }, [input1])
  useEffect(()=>{
    var rows: JSX.Element[] = []
    for (let i = 0; i<spaceList.length; i++){
      if ((input2!='')&&(spaceList[i].toLowerCase().indexOf(input2.toLowerCase())!=-1)){
        rows.push(
          <div key={i} className="hover:bg-[#eee] py-[0.3rem] px-[20px] border-t-[1px] border-t-[#bbb] border-t-solid text-[0.9rem] cursor-pointer bg-white" onClick={()=>{
            runMenu2(spaceList[i])
          }}>
            <p className="text-[#222]">{spaceList[i]}</p>
          </div>
        )
      }
    }
    setAutofill2(rows)
  }, [input2])

  return (
    <>
      {mapData.getByType("space").map((space) => {
        return (
          <Label key={space.id} target={space.center} text={space.name} />
        )
      })}
      <div style={{ display: showMenu ? 'flex' : 'none' }} className="pointer-events-none bg-[#0008] flex top-0 flex-col items-center justify-center fixed box-border w-screen h-screen p-[20px]">
        <div className="pointer-events-auto bg-white border-2 border-solid border-[#ddd] w-[500px] box-content max-w-full max-h-full flex flex-col items-center justify-start overflow-hidden">
          <div className="flex flex-col p-4">
            <div className="h-[1.5rem] m-[0.6rem]"/>
          </div>
          <hr/>
          <div className="flex flex-col p-4">
            <div className="h-[1.5rem] m-[0.6rem]"/>
          </div>
          <hr/>
          <div className="flex items-center align-center w-full p-4">
            <button className="w-full text-[1rem] py-[0.6rem] rounded-none" onClick={()=>{router(content1[3], content2[0])}} disabled={(content1[0]==content2[0])||((content1[0]==''&&content1[1]==''&&content1[2]==''&&content1[3]=='')||(content2[0]==''&&content2[1]==''))}>Let's Go!</button>
          </div>
        </div>
      </div>
      <div style={{ display: showMenu ? 'flex' : 'none' }} className="w-[500px] max-w-full flex flex-col p-4 gap-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[2.475rem]">
        <div className="focus-within:border-[#4ad] bg-white border-[0.125rem] border-solid border-[#ddd] rounded-[15px] p-0 flex flex-col items-start w-full justify-start overflow-hidden">
          <div className="bg-white flex flex-row items-center justify-center grow gap-[10px] w-full py-[10px] px-[20px] box-border">
            <IoIosSearch/>
            <input placeholder="Destination" className="text-[1rem] b-0 grow focus:outline-none" value={input2} onChange={
              (e)=>{
                setInput2(e.target.value)
              }
            }/>
            <div className="bg-white rounded-full hover:brightness-90 overflow-none cursor-pointer" onClick={()=>{
              setAutofill2([])
              setInput2('')
              setContent2(['', ''])
            }}>
              <IconContext.Provider value={{size:'1.5rem'}}>
                <IoIosClose/>
              </IconContext.Provider>
            </div>
          </div>
          <div className="flex w-full flex-col">
            {autofill2}
          </div>
        </div>
      </div>
      <div style={{ display: showMenu ? 'flex' : 'none' }} className="w-[500px] max-w-full flex flex-col p-4 gap-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[7.2rem]">
        <div className="focus-within:border-[#4ad] bg-white border-[0.125rem] border-solid border-[#ddd] rounded-[15px] p-0 flex flex-col items-start w-full justify-start overflow-hidden">
          <div className="bg-white flex flex-row items-center justify-center grow gap-[10px] w-full py-[10px] px-[20px] box-border">
            <IconContext.Provider value={{size:'1rem'}}>
              <IoIosSearch/>
            </IconContext.Provider>
            <input placeholder="Starting point" className="text-[1rem] b-0 grow focus:outline-none" value={input1} onChange={(e)=>{setInput1(e.target.value)}}/>
            <div className="bg-white rounded-full hover:brightness-90 overflow-none cursor-pointer" onClick={()=>{
              setAutofill1([])
              setInput1('')
              setContent1(['', '', '', ''])
            }}>
              <IconContext.Provider value={{size:'1.5rem'}}>
                <IoIosClose/>
              </IconContext.Provider>
            </div>
          </div>
          <div className="flex w-full flex-col">
            {autofill1}
          </div>
        </div>
      </div>
      <div style={{ display: showMenu ? 'flex' : 'none' }} className="cursor-pointer flex items-center justify-center fixed rounded-full bg-white right-[20px] top-[20px] hover:rotate-90 transition-all" onClick={()=>{
        setAutofill1([])
        setInput1('')
        setContent1(['', '', '', ''])
        setAutofill2([])
        setInput2('')
        setContent2(['', ''])
        setShowMenu(false)
      }}>
        <IconContext.Provider value={{size:'2rem'}}>
          <IoIosClose/>
        </IconContext.Provider>
      </div>
      <div style={{ display: showMenu ? 'none' : 'flex' }} className="flex flex-row gap-8 items-center justify-center fixed p-8 bottom-0 right-0">
        <a className="flex flex-row gap-2 items-center justify-center" href="/">
          <img className="h-8" src="/wcimapp.svg"/>
          <h1 className="text-white text-[1.5rem] font-bold">WCI MApp</h1>
        </a>
        <button onClick={()=>{
          setShowMenu(true)
        }}>Set a new route</button>
      </div>
    </>
  );
}

export default function App() {
  // See Demo API key Terms and Conditions
  // https://developer.mappedin.com/v6/demo-keys-and-maps/
  const { isLoading, error, mapData } = useMapData({
    mapId: '6736169666ce60000b916aa4',
    key: import.meta.env.VITE_MY_VERCEL_MY_KEY,
    secret: import.meta.env.VITE_MY_VERCEL_MY_SECRET,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen w-screen">
      <div className="animate-spin rounded-[50%] border-8 border-solid border-transparent border-t-8 border-t-solid border-t-[#000] h-16 w-16"></div>
    </div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  return mapData ? (
    <MapView mapData={mapData}>
      <MyCustomComponent />
    </MapView>
  ) : null;
}