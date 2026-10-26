# Todo 관리 웹 애플리케이션
 
NestJS와 Next.js로 프론트엔드와 백엔드를 함께 구현한 Todo 관리 웹 애플리케이션입니다.
실무에서 다루기 어려웠던 프론트-백엔드 통신 구조와 에러 응답 설계를 직접 처음부터 끝까지 설계해보기 위해 시작했습니다.
 
<!-- 실행 화면 GIF나 스크린샷 삽입예정 -->
<!-- ![demo](./docs/demo.gif) -->


  
## 목차
 
- [기술 스택](#기술-스택)
- [아키텍처](#아키텍처)
- [ERD](#erd)
- [주요 기능](#주요-기능)
- [API 명세](#api-명세)
- [트러블슈팅 / 기술적 의사결정](#트러블슈팅--기술적-의사결정)
- [실행 방법](#실행-방법)
- [폴더 구조](#폴더-구조)


  
## 기술 스택
 
| 구분 | 기술 |
| --- | --- |
| Backend | NestJS |
| Database | SQLite (with TypeORM) |
| Frontend | Next.js |
| Tool | Git, VS Code |



  
## 아키텍처
 
<!-- 프론트-백엔드 요청/응답 흐름과 Controller-Service-Module 계층 구조도를 삽입하세요 -->
<!-- 예: Next.js(Client) → NestJS Controller → Service → TypeORM → SQLite -->
 
```
[Next.js Client]
      │  REST API (fetch)
      ▼
[NestJS Controller]
      │
      ▼
[Service Layer]
      │
      ▼
[TypeORM] ──▶ [SQLite]
```


  
## ERD
 
<!-- Todo 테이블 구조(필드, 타입, 관계)를 표 또는 다이어그램으로 정리하세요 -->
 
| 컬럼명 | 타입 | 설명 |
| --- | --- | --- |
| id | number | PK |
| title | string | 할 일 제목 |
| isDone | boolean | 완료 여부 |
| createdAt | datetime | 생성일시 |

  
  <br>
  
## 주요 기능

<img width="956" height="690" alt="image" src="https://github.com/user-attachments/assets/c0100908-578a-4910-83d3-64e575a1a53a" />


- **Todo CRUD**: 등록·수정·삭제 및 완료/미완료 상태 변경
- **키워드 검색**: LIKE 검색 기반 제목 검색
- **필터링**: 완료 상태별 목록 필터링
- **Optimistic UI**: 클라이언트에서 즉시 반영 후, 실패 시 롤백되는 에러 응답 구조
- **페이지네이션**: 서버 사이드 페이지네이션 적용 page, limit 기반으로 필요한 Todo 데이터만 조회, 전체 데이터 개수에 따라 페이지 버튼을 동적으로 생성
- **정렬**: Todo 조회 API에 정렬 기준(최신순, 오래된순, 제목순)과 정렬 방향을 적용하여 기능 구현

  
  <br>
## API 명세
 
<!-- 요청/응답 예시(JSON)를 추가하면 좋습니다. Swagger 적용 시 링크로 대체 가능 -->
### GET /todos
Todo 목록 조회
 
**Query Parameters**
 
| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| keyword | string | N | 제목 검색 키워드 (LIKE 검색) |
| isDone | boolean | N | 완료 상태 필터 |

  
### POST /todos
Todo 등록
 
**Request Body**
 
| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| title | string | Y | 할 일 제목 |

  
### PATCH /todos/:id
Todo 수정 (완료 상태 변경 포함)
 
**Path Parameter**
 
| 이름 | 타입 | 설명 |
| --- | --- | --- |
| id | number | 수정할 Todo의 ID |
 
**Request Body**
 
| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| title | string | N | 수정할 제목 |
| isDone | boolean | N | 수정할 완료 상태 |

   
### DELETE /todos/:id
Todo 삭제
 
**Path Parameter**
 
| 이름 | 타입 | 설명 |
| --- | --- | --- |
| id | number | 삭제할 Todo의 ID |


  <br>
  
## 트러블슈팅 / 기술적 의사결정


  
### 1. 왜 SQLite를 선택했는가
개인 프로젝트 규모에서 별도 DB 서버 설치 없이 빠르게 개발/배포하기 위해 선택

  <br>
  
### 2. Optimistic UI의 에러 응답 구조 설계
클라이언트에서 먼저 상태를 반영한 뒤, 서버 응답 실패 시 이전 상태로 롤백

  <br>
  
### 3. 페이지 이동 시 필터·검색·정렬 조건이 초기화되는 문제

#### 문제 상황
- '완료' 필터를 적용한 상태에서 2페이지를 누르면 필터가 풀리고 전체 Todo 목록이 출력됨
- 검색어를 입력한 상태에서 페이지를 이동해도 검색 조건이 사라짐
- 정렬 옵션을 변경해도 목록이 다시 조회되지 않음
- 서버 에러 없이 결과만 잘못 나오는 로직 오류

#### 원인 분석
브라우저 Network 탭에서 실제 요청 URL을 확인한 결과, 페이지 이동 시 필터 파라미터가 빠진 채로 요청되고 있었음.

```
GET /todo?page=2&limit=10&order=DESC&sort=createdAt   ← completed 파라미터 누락
```

요청 URL에 필터가 없으므로 백엔드는 정상 동작했고, 원인은 프론트엔드에 있었음.

1. **조회 함수가 조건을 인자로 받는 구조**
   `fetchTodos(completed, searchWord)`처럼 조건을 인자로 받다 보니, 페이지 변경 시 `fetchTodos()`를 인자 없이 호출하면 필터와 검색어가 `undefined`로 전달됨
2. **정렬 값이 state가 아닌 일반 변수**
   `let sort = "createdAt"`은 렌더링마다 초기값으로 다시 생성되기 때문에, `useEffect(..., [sort])`가 정렬 변경을 감지하지 못함
3. **조건 변경 시 페이지가 초기화되지 않음**
   3페이지를 보다가 필터를 바꾸면 해당 필터의 3페이지를 요청해 빈 화면이 나올 수 있음

#### 해결 방법
조회 조건(페이지·필터·정렬·검색어)을 모두 state로 관리하고, 조회 함수는 인자 없이 **항상 현재 state를 읽도록** 변경. 조건이 바뀔 때 다시 조회하는 `useEffect`도 하나로 통합함.

**Before**
```tsx
const fetchTodos = async (completed?: string, searchWord?: string) => { ... };

useEffect(() => { fetchTodos(); }, [page]);   // 필터·검색어 누락
useEffect(() => { fetchTodos(); }, [sort]);   // sort가 state가 아니라 감지 안 됨
```

**After**
```tsx
const fetchTodos = async () => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), sort, order });
  if (filter !== "all") params.set("completed", filter);
  if (appliedSearch) params.set("searchWord", appliedSearch);
  // ...
};

// 조건 변경 시 1페이지로 이동
const handleFilter = (value) => { setFilter(value); setPage(1); };
const handleSearch = () => { setAppliedSearch(searchWord); setPage(1); };
const handleSort = (value) => { setSortName(value); setPage(1); };

// 조회 조건 중 하나라도 바뀌면 다시 조회
useEffect(() => {
  fetchTodos();
}, [page, filter, sortName, appliedSearch]);
```

검색은 입력 중인 값(`searchWord`)과 실제 적용된 값(`appliedSearch`)을 분리해, 검색 버튼을 눌렀을 때만 조회되도록 함.

#### 배운 점
- 화면 결과가 이상할 때는 **Network 탭에서 실제 요청 URL을 먼저 확인**하면 프론트·백엔드 중 어디가 문제인지 빠르게 구분할 수 있음
- 여러 조회 조건이 함께 동작하는 화면에서는 조건을 함수 인자로 흩어서 넘기기보다, **state를 단일 기준(Single Source of Truth)으로 두고 한 곳에서 요청을 만드는 구조**가 버그를 줄임
- `useEffect`의 의존성 배열에는 **렌더링 사이에 값이 유지되는 state**를 넣어야 변경을 감지할 수 있음

  <br>

### 4. 조회 결과가 0건일 때 다음 페이지 버튼이 활성화되는 문제

#### 문제 상황
- 완료 항목이 하나도 없는 상태에서 '완료' 필터를 누르면 목록은 비어 있는데 `›`, `»` 버튼이 활성화됨
- 버튼을 누르면 2페이지, 3페이지로 계속 이동하며 빈 목록을 요청함

#### 원인 분석
전체 페이지 수는 `Math.ceil(total / limit)`로 계산하는데, 결과가 0건이면 `totalPages`가 0이 됨.
버튼 비활성화 조건이 `page === totalPages`(1 === 0)라서 항상 `false`가 되어 버튼이 막히지 않았음.

#### 해결 방법
뒤로 가는 버튼의 조건을 `===`에서 `>=`로 변경해, 현재 페이지가 마지막 페이지 **이상**이면 비활성화되도록 함.

```tsx
// Before
disabled={page === totalPages}

// After
disabled={page >= totalPages}
```

앞으로 가는 버튼(`«`, `‹`)은 기존처럼 `page === 1`을 기준으로 유지함.

#### 배운 점
- 경계값 조건은 `===`보다 `>=`, `<=`처럼 **범위로 비교**하는 것이 예상치 못한 값(0건, 범위 초과)에 더 안전함
- 기능 구현 후 **데이터가 없는 경우, 첫 페이지, 마지막 페이지** 같은 경계 상황을 따로 테스트해야 함

  <br>
  
## 실행 방법
 
```bash
# 저장소 클론
git clone https://github.com/kimds777/nest-next-todo.git
 
# 백엔드 실행
cd todo-server-nest
npm install
npm run start:dev
 
# 프론트엔드 실행
cd todo-client-next
npm install
npm run dev
```

환경변수 설정이 필요한 경우 `.env.example`을 참고해 `.env` 파일을 생성하세요.


  
## 폴더 구조
 
```
.
├── todo-server-nest/
│   ├── src/
│   │   ├── todo/
│   │   │   ├── todo.controller.ts
│   │   │   ├── todo.service.ts
│   │   │   └── todo.module.ts
│   │   └── main.ts
│   └── ...
└── todo-client-next/
    ├── app/
    │   ├── page.tsx
    │   └── ...
    ├── components/
    └── ...
```
