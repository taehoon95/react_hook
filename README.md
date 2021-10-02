# 1.useState

### useState 사용한 코드
```js
const App = () => {
  const [item, setItem] = useState(1);
  const incrementItem = () => setItem(item + 1);
  const decrementItem = () => setItem(item - 1);
  return (
    <div className="App">
      <h1>Hello {item}</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={incrementItem}>increment</button>
      <button onClick={decrementItem}>decrement</button>
    </div>
  );
}

```
### class component에서 state사용한 코드

```js
class AppUgly extends React.Component {
  state = {
    item : 1,
  }
  render(){
    const {item} = this.state;
    return (
      <div className="App">
        <h1>Hello {item}</h1>
        <h2>Start editing to see some magic happen!</h2>
        <button onClick={this.incrementItem}>increment</button>
        <button onClick={this.decrementItem}>decrement</button>
      </div>
    )
  };
  
  decrementItem = () => {
    this.setState(state => {
      return {
        item: state.item - 1
      }
    });
  }

  incrementItem = () => {
    this.setState(state => {
      return {
        item: state.item + 1
      }
    });
  }
}
```

## 1-2.useInput

### code둘다 사용가능 {...name}
```js
<input placeholder="Name" {...name}/>
```
```js
<input placeholder="Name" value={name.value } />
```

### useInput.js : input에 들어가는 값(유효성검사) 체크
```js
import React, {useState} from "react";
  
export const useInput = (initialValue, validator) => {
    const [value, setValue] = useState(initialValue);

    const onChange = event => {
      const { target: {value} } = event;
  
      let willUpdate = true;
      if (typeof validator === "function") {
        willUpdate = validator(value);
      }
      if (willUpdate) {
        setValue(value);
      };
    }
    return {
      value,
      onChange
    };
}
```

### App.js
```js
const App = () => {
  const maxLen = (value) => value.length <= 10;
  const name = useInput("Mr.", maxLen);
  return (
    <div className="App">
      <h1>Hello</h1>
      <input placeholder="Name" {...name}/>
    </div>
  );
}
```


### useTabs : 배열로 만들어서 
```js
import React, {useState} from "react";

const contents = [
    {
      tab : "Section 1",
      content : "I'm the content of te Section1"
    },
    {
      tab : "Section 2",
      content : "I'm the content of te Section2"
    }
];


const useTabs = (initialTab, allTabs) => {
  const [currentIndex, currentIndex] = useState(initialTab); //currentIndex : tab의 인덱스값, currentIndex : tab의 값 세팅
  if(!allTabs || !Array.isArray(allTabs)){ // allTabs가 배열이 아니면 return
    return;
  }
  return { // 반복문으로 생성된 tab들의 값을 받아올수 있다.
    currentItem : allTabs[currentIndex], 
    changeItem : setCurrentIndex,
  }
}

const App = () => {
  const {currentItem, changeItem} = useTabs(0, contents);
  return ( 
    <div className = "App" >
      {contents.map((section, index) => 
                    (<button onClick={() => changeItem(index)}>{section.tab}</button>))}
      <div>{currentItem.content}</div>
    </div>
  );
}

export default App;
```

# 2.useEffect
### componentDidMount, componentWillUpdate, componentWillUnMount와 비슷
### component mount -> function 실행 -> 
### useEffect : mount될때 한번 수행하고,event가 일어날때마다 수행함 
### 2개의 인자를 받는데 첫번째는 function으로써의 effect, 두번째인자 dependency(deps)
### 만약 deps가 있다면 effect는 (deps)리스트에 있는 값일 때만 값이 변하도록 활성화 된다.

## 2-1.useTitle
### 제목을 업데이트 시켜주는걸 담당하는 hooks
```js
import React, {useEffect, useState} from "react";

const useTitle = (initialTitle) => {
  const [title, setTitle] = useState(initialTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerText = title;
  };
  useEffect(updateTitle, [title]); 
  return setTitle;
}

const App = () => {
  const titleUpdater = useTitle("Loading...");
  setTimeout(() => titleUpdater("Home"),1000)
  return ( 
    <div className = "App" >
        <div>Hi</div>
    </div>
  );
}

export default App;
```

## 2-2.useClick

### useRef() : reference는 기본적으로 component의 어떤 부분을 선택할 수 있는 방법(document.getElementByID() 사용한것과 동등)
```js
import React, {useEffect, useState, useRef} from "react";

const App = () => {
  const potato = useRef();
  setTimeout(() => potato.current.focus(),5000); // 5초후에 focus된다.
  return ( 
    <div className = "App" >
        <div>Hi</div>
        <input ref={potato} placeholder="la"/>
    </div>
  );
}

export default App;
```

### useClick
```js
import React, {useEffect, useState, useRef} from "react";

const useClick = (onClick) => {
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

const App = () => {
  const sayHello = () => console.log("say Hello");
  const title = useClick(sayHello);
  return ( 
    <div className = "App" >
        <h1 ref = {title}>Hi</h1>
    </div>
  );
}

export default App;
```

## 2-3 usePreventLeave , useConfirm 
###  실제 hooks는 아니다 useEffect와 useState를 사용하지 않기 때문에

### useConfirm : 사용자가 무언가를 하기전에 확인
```js
export const useConfirm = (message, onConfirm, onCancel) => {
    if(!onConfirm || typeof onConfirm !== "function") return;
 
    if(onCancel && typeof onCancel !== "function") return;

    const confirmAction = () => {
      window.confirm(message) ? onConfirm() : onCancel();
    }
    return confirmAction;
};
```

### usePreventLeave : 사용자가 브라우저 창을 끌때 확인
```js
const usePreventLeave = () => {
  const listener = event => {
    event.preventDefault();
    event.returnValue ="";
  };
  const enablePrevent = () => window.addEventListener("beforeunload",listener);
  const disablePrevent = () => window.removeEventListener("beforeunload",listener);
  return {enablePrevent, disablePrevent};
};
```

### useBeforeLeave : 마우스가 브라우저 창위로 나갈때 이벤트
```js
const useBeforeLeave = (onBefore) => {
    const handle = (event) => {
      const { clientY } = event;
      if(clientY <= 0) 
        onBefore();
    }
    useEffect(()=>{
      document.addEventListener("mouseleave",handle )
      return () => document.removeEventListener("mouseleave");
    }, []);
    if(typeof onBefore !== "function"){
      return;
    }
  }
```

### useFadeIn 
```js
import {useRef, useEffect} from "react";

export const useFadeIn = (duration = 1, delay = 0) => {
    const element = useRef();
    useEffect(() => {
      if(element.current){
        const {current} = element;
        current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`
        current.style.opacity = 1;
      }
    },[]) 
    if(typeof duration !== "number" || typeof delay !== "number" ) return;
    return {ref : element, style:{opacity: 0}};
  }
```

### useFullscreen

```js
const useFullscreen = (callback) => {
  const element = useRef();
  const triggerFull = () => {
    if(element.current){
      element.current.requestFullscreen();
      if(callback && typeof callback === "function") callback(true);
    }
  }
  const exitFull = () => {
    document.exitFullscreen();
    if(callback && typeof callback === "function") callback(false);
  }
  return {element, triggerFull, exitFull};
};
```

### useNotificatioin
```js
const useNotificatioin = (title, options) => {
  if(!("Notification" in window))
    return;

  const fireNotif = () => {
    if(Notification.permission !== "granted"){
      Notification.requestPermission().then(permission => {
        if(permission === "granted"){
          new Notification(title, options);
        }else{
          return;
        }
      });
    } else{
      new Notification(title, options);
    }
  };
  return fireNotif;
};
```


### useAxios
#### axios가 먼지 : 
##### 1.HTTP request를 만든다. 
##### 약간의 customization과 configuration을 허용한다.(defaulturl설정이나 자동으로 헤더를 설정하는것들을 허용한다.)

```js
import defaultAxios from "axios";
import { useEffect, useState } from "react";

const useAxios = (opts, axiosInstance = defaultAxios) => {
    const [state, setState] = useState({
        loading: true,
        error: null,
        data: null,
    });
    const [trigger, setTrigger] = useState(0);
    const refetch = () => {
        setState({
            ...state,
            loading: true
        })
        setTrigger(Date.now());
    }
    useEffect(()=> {
        axiosInstance(opts)
        .then(data => {
            setState({
                ...state,
                loading:false,
                data
            });
        })
        .catch(error => {
            setState({...state, loading: false, error});
        });
    },[trigger])
    if(!opts.url){
        return;
    }
    return {...state, refetch};
};

export default useAxios;
```