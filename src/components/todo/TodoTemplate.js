import React, { useContext, useEffect, useState } from 'react'
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'reactstrap';

import './scss/TodoTemplate.scss';

import { API_BASE_URL as BASE, TODO, USER } from '../../config/host-config';
import { getLoginUserInfo } from '../../util/login-utils';
import AuthContext from '../../util/AuthContext';

const TodoTemplate = () => {

  // 로딩 상태값 관리
  const [loading, setLoading] = useState(true);

  // 로그인 인증 토큰 얻어오기
  const [token, setToken] = useState(getLoginUserInfo().token);
  
  const redirection = useNavigate();

  const { setUserInfo } = useContext(AuthContext);

  // 요청 헤더 설정
  const requestHeader = {
    'content-type' : 'application/json',
    'Authorization' : 'Bearer ' + token
  };

  // 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함.
  const API_BASE_URL = BASE + TODO;
  const API_USER_URL = BASE + USER;

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([]);
  // db 연동 전 테스트용 배열
  // const [todos, setTodos] = useState([
  //   // {
  //   //   id: 1,
  //   //   title: '아침 산책하기',
  //   //   done: true
  //   // },
  //   // {
  //   //   id: 2,
  //   //   title: '오늘 주간 신문 읽기',
  //   //   done: true
  //   // },
  //   // {
  //   //   id: 3,
  //   //   title: '샌드위치 사먹기',
  //   //   done: false
  //   // },
  //   // {
  //   //   id: 4,
  //   //   title: '리액트 복습하기',
  //   //   done: false
  //   // }
  // ]);

  // id값 시퀀스 생성 함수
  const makeNewId = () => {
    // if(todos.length === 0) return 1;
    // return todos[todos.length - 1].id + 1;
    return todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
  }
  
  // todoInput에게 todoText를 받아오는 함수
  // 자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는 props 사용이 불가능.
  // 부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언!) -> props로 함수를 전달
  // 자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달.
  const addTodo = todoText => {
    // console.log('할 일 정보 : ', todoText);

    const newTodo = {
      // id: makeNewId(), // 서버와 동기화 시에 필요 X
      title: todoText,
      // done: false // 서버와 동기화 시에 필요 X
    }

    // todos.push(newTodo); (x) -> useState

    // 리액트의 상태변수는 무조건 setter를 통해서만 
    // 상태값을 변경해야 렌더링에 적용된다.
    // 다만, 상태변수가 불변성(immutable)을 가지기 때문에 
    // 새로운 상태를 만들어서 변경해야 합니다.
    // const copyTodos = todos.slice();
    // copyTodos.push(newTodo);
    // setTodos(copyTodos);

    // setTodos(todos.concat([newTodo]));

    // 서버와 동기화 로직
    fetch(API_BASE_URL, {
      method : 'POST',
      headers : requestHeader,
      body : JSON.stringify(newTodo)
    })
    .then(res => {
      if(res.status === 200) return res.json();
      else if(res.status === 401) {
        alert('일반회원은 일정 등록이 5개로 제한됩니다 ㅠㅠ');
      }
    })
    .then(json => {
      json && setTodos(json.todos);
    })

  }

  // 할 일 삭제 처리 함수
  const removeTodo = id => {
    // console.log(`삭제 대상 id : ${id}`);
    /*
    let idx;
    for(let i=0; i<todos.length; i++) {
      if(id === todos[i].id) {
        idx = i;
        break;
      }
    }

    const copyTodos = [...todos];
    copyTodos.splice(idx, 1);

    setTodos(copyTodos);
     */
    
    // ES6 문법부터 주어지는 배열 고차 함수 (map도 마찬가지)
    // 주어진 배열의 값들을 순회하여 조건에 맞는 요소들만 모아서 새로운 배열로 리턴해 주는 함수.
    // 콜백 함수를 매개값으로 받음.
    // setTodos(json.todos.filter(todo => todo.id !== id));

    // 서버와 동기화 로직
    fetch(`${API_BASE_URL}/${id}`, {
      method : 'DELETE',
      headers : requestHeader
    })
    .then(res => res.json())
    .then(json => {
      setTodos(json.todos);
    })
  };

  // 할 일 체크 처리 함수
  const checkTodo = (id, done) => {
    // console.log(`체크한 Todo id :  ${id}`);
    /*
    const copyTodos = [...todos];
    for(let cTodo of copyTodos) {
      if(cTodo.id === id) {
        cTodo.done = !cTodo.done;
      }
    }

    setTodos(copyTodos);
     */
    
    // 삼항 연산자의 결과 값도 리턴, map 함수의 결과값도 리턴
    // 리턴 받은 새로운 값을 setTodos(useState)를 통해 값이 변경되었음을 알림
    // todos가 useEffect로 관리되고 있기 때문에 setTodos를 통해 값이 변경됨을 감지하면 화면을 재렌더링
    // setTodos(todos.map(todo => todo.id === id ? {...todo, done: !todo.done} : todo));

    // 서버와 동기화 로직
    /* 내가 한거
    const updateTodo = {
      id: id,
      done: !done
    }
    fetch(API_BASE_URL, {
      method : 'PUT',
      headers : { 'content-type' : 'application/json' },
      body : JSON.stringify(updateTodo)
    })
    .then(res => res.json())
    .then(json => {
      setTodos(json.todos);
    })
     */

    // 강사님
    fetch(API_BASE_URL, {
      method : 'PUT',
      headers : requestHeader,
      body : JSON.stringify({
        done : !done,
        id : id
      })
    })
    .then(res => res.json())
    .then(json => setTodos(json.todos));
  }

  // 체크가 안된 할 일의 개수 카운트하기
  const countRestTodo = () => todos.filter(todo => !todo.done).length;

  // 비동기 방식 등급 승격 함수
  const fetchPromote = async() => {

    const res = await fetch(API_USER_URL + '/promote', {
      method : 'PUT',
      headers : requestHeader
    });

    if(res.status === 403) {
      alert('이미 프리미엄 회원입니다.');
    } else if(res.status === 200) {
      const json = await res.json();
      // console.log(json);
      setUserInfo(json);
      setToken(json.token);
    }

  }

  // 등급 승격 서버 요청 (프리미엄)
  const promote = () => {
    // console.log('등급 승격 서버 요청!');
    fetchPromote();
  }

  // todos 배열에 변화가 있을 때 재렌더링
  // 첫번째 매개변수 : 실행할 함수, 두번째 매개변수 : 변화를 감지할 값
  useEffect(() => {
    
    // 페이지가 렌더링 됨과 동시에 할 일 목록을 요청해서 뿌려 주겠습니다.
    fetch(API_BASE_URL, {
      method : 'GET',
      headers : requestHeader
    })
      .then(res => {
        if(res.status === 200) return res.json();
        else if(res.status === 403) {
          alert('로그인이 필요한 서비스입니다.');
          redirection('/login');
          return;
        } else {
          alert('관리자에게 문의하세요!');
        }
        return;
      })
      .then(json => {
        // console.log(json.todos);

        // fetch를 통해 받아온 데이터를 상태 변수에 할당.
        if(json) setTodos(json.todos);

        // 로딩 완료 처리
        setLoading(false);
      });

  }, []);

  // 로딩이 끝난 후 보여줄 컴포넌트
  const loadEndedPage = (
    <>
      <TodoHeader 
        count={countRestTodo} 
        promote={promote}
      />
      <TodoMain 
        todoList={todos} 
        remove={removeTodo} 
        check={checkTodo} 
      />
      <TodoInput addTodo={addTodo} />
    </>
  );

  // 로딩 중일 때 보여줄 컴포넌트
  const loadingPage = (
    <div className='loading'>
      <Spinner color='danger'>
        loading...
      </Spinner>
    </div>
  )

  return (
    <div className='TodoTemplate'>
        { loading ? loadingPage : loadEndedPage }
    </div>
  );
}

export default TodoTemplate;