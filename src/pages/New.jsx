import Button from "../components/Button";
import Header from "../components/Header";
import Editor from "../components/Editor";
import {useNavigate} from "react-router"
import { useContext, useEffect } from "react";
import {DiaryDispatchContext} from "../contexts/DiaryContext";
import { setPageTitle } from "../util";
const New = () =>{
    const navigete = useNavigate();
    const goBack = () => navigete(-1)
    const {onCreate} = useContext(DiaryDispatchContext);
    const onSubmit = (data) =>{
        const {date, content, emotionId} = data;
        onCreate(date, content, emotionId)
        navigete("/", {replace:true});
    }
    useEffect(()=>{
        setPageTitle("새 일기 쓰기")
    },[])
    return(
        <div>
            <Header
            title={"새 일기 쓰기"}
            leftChild={<Button text="< 뒤로가기" onClick={goBack}/>}/>
            <Editor onSubmit={onSubmit}/>
        </div>
    )
}
export default New;