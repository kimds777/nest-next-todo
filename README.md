# Todo 관리 웹 애플리케이션(작성중)
 
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


  
## 주요 기능

<img width="953" height="561" alt="image" src="https://github.com/user-attachments/assets/3957d73b-635d-47de-9fe1-70db8e9dec2b" />

- **Todo CRUD**: 등록·수정·삭제 및 완료/미완료 상태 변경
- **키워드 검색**: LIKE 검색 기반 제목 검색
- **필터링**: 완료 상태별 목록 필터링
- **Optimistic UI**: 클라이언트에서 즉시 반영 후, 실패 시 롤백되는 에러 응답 구조
<!-- 각 기능별 스크린샷을 추가하면 좋습니다 -->


  
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


  
## 트러블슈팅 / 기술적 의사결정


  
### 왜 SQLite를 선택했는가
개인 프로젝트 규모에서 별도 DB 서버 설치 없이 빠르게 개발/배포하기 위해 선택


  
### Optimistic UI의 에러 응답 구조 설계
클라이언트에서 먼저 상태를 반영한 뒤, 서버 응답 실패 시 이전 상태로 롤백


  
### NestJS 계층 구조로 관심사를 분리한 경험
<!-- Controller-Service-Module 구조를 적용하며 얻은 인사이트 -->


  
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
