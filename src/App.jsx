

import{Link,Route,Routes} from "react-router"
import './App.css'
import Home from "./pages/Home"
import New from "./pages/New"
import Diary from "./pages/Diary"
import Edit from "./pages/Edit"
import { useEffect, useReducer, useRef, useState } from "react"
import { DiaryDispatchContext, DiaryStateContext } from "./contexts/DiaryContext"

//Reducer가 사용하는 함수
function reducer(state, action){
  switch(action.type){
    case "CREATE": {
      const newState = [action.data, ...state];
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState
    }
    case "UPDATE":{
      const newState = state.map((it) => String(it.id)===String(action.data.id) ? {...action.data} : it);
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState
    }
    case "DELETE": {
      const newState = state.filter((it) => String(it.id) !== String(action.targetId));
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "INIT": {
      return action.data;
    }
    default : {
        return state;
    }
  }
}

const mockData =[
  {
    id: "mock1",
    date : new Date().getTime()-1,
    content : "mock1",
    emotionId:1,
  },
  {
    id: "mock2",
    date : new Date().getTime()-2,
    content : "mock2",
    emotionId :2,
  },
  {
    id: "mock3",
    date : new Date().getTime()-3,
    content : "mock3",
    emotionId:3,
  },
]
function App() {
  //데이터 로딩 상태
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  // 일기 state 업데이트를 위한 Reducer정의의, (작성, 수정, 삭제)
  const [data,disptch] = useReducer(reducer, []);
  // 새 일기 추가 시 keyfh 사용할 참조객체
  const idRef = useRef(0);
  const fetchData = async () =>{
    const response = await fetch("https://my-json-server.typicode.com/kinea225/backendTest/diary");
    const data = await response.json();
    disptch({type:"INIT", data:data});
    setIsDataLoaded(true);
  }
  useEffect(()=>{
    fetchData();
  },[])
  //useEffect를 이용하여 app컴포넌트 마운트 시 state값을 mock 데이터로 업데이트
  // useEffect(()=> {
  //   // disptch({
  //   //   type : "INIT",
  //   //   data:mockData
  //   // });
  //   // //로딩 완료시 true
  //   // setIsDataLoaded(true);

  //   const rawData = localStorage.getItem("diary");
  //   if(!rawData){
  //     setIsDataLoaded(true);
  //     return;
  //   }
  //   const localData = JSON.parse(rawData);
  //   if(localData.length ===0){
  //     setIsDataLoaded(true);
  //     return;
  //   }
  //   localData.sort((a,b) => Number(b.id) - Number(a.id));
  //   idRef.current = localData[0].id+1;
  //   disptch({type:"INIT", data:localData});
  //   setIsDataLoaded(true);
  // } ,[])

  //Create 기능, 새일기 생성 함수 (날짜:date, 일기:string, 감정이미지 번호:num )
  const onCreate = (date, content, emotionId) =>{
    disptch({
      type:"CREATE",
      data:{
        id:idRef.current,
        date : new Date(date).getTime(),
        content,
        emotionId,
      },
    });
    idRef.current +=1;
  }
  //Update 기능, 기존 일기 변경 (변경할:> 타겟, 날짜, 일기, 감정이미지번호)
  const onUpdate = (targetId, date, content, emotionId)=>{
    disptch({type:"UPDATE",
      data:{
        id:targetId,
        date : new Date(date).getTime(),
        content,
        emotionId,
      },
    });
  }
  //DELETE기능, 일기 삭제(삭제할 타겟)
  const onDelete =(targetId) =>{
    disptch({
      type : "DELETE",
      targetId,
    });
  }
  if( !isDataLoaded){
    return <div>데이터를 불러오는 중입니다.</div>;
  }else{
    return (
      <DiaryStateContext value ={data}>
        <DiaryDispatchContext
          value = {{
            onCreate,
            onUpdate,
            onDelete,
          }}>
          <div className='App'>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/new" element={<New/>}/>
                {/* 일기의 id를 받기위해 :id 사용*/}
                <Route path="/diary/:id" element={<Diary/>}/>
                <Route path="/edit/:id" element={<Edit/>}/>
            </Routes>
          </div>
        </DiaryDispatchContext>
      </DiaryStateContext>
    );
  }
}

export default App
