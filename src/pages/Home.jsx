import {useSearchParams} from "react-router";
import Button  from "../components/Button";
import Header from "../components/Header";
import Editor from "../components/Editor";
import { useContext, useEffect, useState } from "react";
import { DiaryDispatchContext, DiaryStateContext } from "../contexts/DiaryContext";
import { getMonthRangeByDate, setPageTitle } from "../util";
import DiaryList from "../components/DiaryList";

const Home = () =>{
    //월 이동 시 표기할 날짜를 저장하는 state변수와 함수 기능
        // 일기 데이터 불러오기
    const data = useContext(DiaryStateContext);
    const [pivotDate, setPivotDate] = useState(new Date());
    //필터링한 데이터를 저장할 state변수
    const [filteredData, setFilterData] = useState([]);
    const onIncreaseMonth = ()=>{
        setPivotDate(
            new Date(pivotDate.getFullYear(), pivotDate.getMonth()+1)
        );
    }
    const onDecreaseMonth = ()=>{
        setPivotDate(
            new Date(pivotDate.getFullYear(), pivotDate.getMonth()-1)
        );
    }
    const headerTitle =`${pivotDate.getFullYear()}년 ${pivotDate.getMonth() +1}월`
    //날짜에 따른 일기 필터

    console.log(data);
    useEffect(()=>{
        setPageTitle("김태홍의 감정 일기장")
         console.log("HOME 마운트");
         console.log(data.length >=1);
        if(data.length >=1){
            console.log("HOME 마운트 IF문");
            const {beginTimeStamp, endTimeStamp} =getMonthRangeByDate(pivotDate);
            setFilterData(data.filter((it) => beginTimeStamp <= it.date && it.date <= endTimeStamp))
        }else{
            setFilterData([]);
        }
    }, [data,pivotDate])
    return(
        <div>
            <Header
                title={headerTitle}
                leftChild={<Button text={"<"} onClick={onDecreaseMonth}/>}
                rightChild={<Button text={">"} onClick={onIncreaseMonth}/>}
            />
            <DiaryList data ={filteredData}/>
        </div>
    );
}
export default Home;