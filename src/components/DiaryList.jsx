import { useEffect, useState } from "react";
import {useNavigate} from "react-router";
import Button from "./Button";
import DiaryItem from "./DiaryItem";
import "./DiaryList.css"

//상단부 정렬 기능 구현
const sortOptionList =[
    {value: "latest", name:"최신순"},
    {value: "oldest", name:"오래된 순"}
];

const DiaryList = ({data})=>{
    console.log("1. 부모에게 받은 data:", data);
    //사용자가 선택한 정렬 타입을 저장할 state 변수 정의와 사용
    const [sortType, setSortType] = useState("latest");
    const onChangeSortType = (e) => setSortType(e.target.value);

    //정렬기능 구현
    const [sortedData, setSortedData] = useState([]);
    useEffect(()=>{
        const compare = (a,b)=>{
            if(sortType === "latest") return Number(b.date) - Number(a.date);
            else return Number(a.date) - Number(b.date);
        };
        const copyList = JSON.parse(JSON.stringify(data));
        copyList.sort(compare);
        setSortedData(copyList);
    }, [data,sortType]);
    console.log("2. 렌더링할 sortedData:", sortedData);
    // 새 일기 쓰기 버튼 -> new 페이지로 이동 react-router 사용
    const navigate = useNavigate();
    const onClickNew = () => navigate("/new");
    return (
        <div className="DiaryList">
            <div className="menu_wrapper">
                <div className="left_col">
                    <select value={sortType} onChange={onChangeSortType}>
                        {sortOptionList.map((it, idx) =>{
                            return(
                            <option key={idx} value={it.value}>
                                {it.name}
                            </option>
                            )
                        })}
                    </select>
                </div>
                <div className="right_col">
                    <Button type="positive" text="새 일기 쓰기"
                            onClick={onClickNew}/>
                </div>
            </div>
            <div className="list_wrapper">
                {sortedData.map((it) =>(<DiaryItem key={it.id} {...it}/>))} 
            </div>
        </div>
    )
}

export default DiaryList;
