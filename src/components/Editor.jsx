import { useCallback, useEffect, useState } from "react";
import "./Editor.css";
import { emotionList, getFormattedDate } from "../util";
import Button from "./Button";
import {useNavigate} from "react-router"
import EmotionItem from "./EmotionItem";


const Editor = ({initData, onSubmit}) =>{
    const [state,setState] = useState({
        date:getFormattedDate(new Date()),
        emotionId:3,
        content:"",
    });
    useEffect(()=>{
        if(initData){
            setState({
                ...initData,
                date:getFormattedDate(new Date(initData.date))
            });
        }
    },[initData]);
    const handleChangeDate = (e) =>{
        setState({
            ...state,
            date : e.target.value,
        });
    };
    const handleChangeContent = (e) =>{
        setState({
            ...state,
            content: e.target.value,
        });
    };

    //완료
    const handleSubmit =() =>{
        onSubmit(state);
    }
    //취소 
    const navigate = useNavigate();
    const handleGoBack = useCallback(() => navigate(-1),[navigate]);
    const handleChangeEmotion = useCallback((emotionId)=>{
        setState((state) =>({...state, emotionId}));
    },[]);
    return(
        <div className="Editor">
            <div className="editor_section">
                {/* 날짜 */}
                <h4>오늘의 날짜</h4>
                <div className="input_section">
                    <input type="date" value={state.data} 
                    onChange={handleChangeDate}/>
                </div>
            </div>
            <div className="editor_section">
                {/* 감정 */}
                <h4>오늘의 감정</h4>
                <div className="input_wrapper emotion_list_wrapper">
                    {emotionList.map((it)=>{
                        return(
                        <EmotionItem
                            key={it.id}
                            {...it}
                            onClick={handleChangeEmotion}
                            isSelected={state.emotionId === it.id}
                        />
                        )
                    })}
                </div>
            </div>
            <div className="editor_section">
                {/*일기 */}
                <h4>오늘의 일기</h4>
                <div className="input_wrapper">
                    <textarea 
                    placeholder="오늘은 어땠나요?"
                    value={state.content}
                    onChange={handleChangeContent}/>
                </div>
            </div>
            <div className="editor_section bottom_section">
                {/*작성 완료, 취소 */}
                <Button text="취소하기" onClick={handleGoBack}/>
                <Button text="작성완료" type="positive" onClick={handleSubmit}/>
            </div>

        </div>
    )
}

export default Editor;