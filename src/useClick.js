import { useRef, useEffect } from "react";

export const useClick = (onClick) => {
    const element = useRef();
    useEffect(() => {
      if(element.current){ // 1.
        element.current.addEventListener("click", onClick);
      }
      return () => { // 2.
        if(element.current){
          element.current.removeEventListener("click", onClick)
        }
      }; 
    }, []) // [] componentDidMount떄 단 한번만 실행되라는 의미 그후 -> componentWillUnMount때 2번 호출 (2번 쓴이유 : component가 mount되지 않았을때 eventListner배치 안하려고)
    if(typeof onClick !== "function"){
      return;
    }
    return element;
  }