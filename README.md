# Todo 관리 웹 애플리케이션(작성중)
 
NestJS와 Next.js로 프론트엔드와 백엔드를 함께 구현한 Todo 관리 웹 애플리케이션입니다.
실무에서 다루기 어려웠던 프론트-백엔드 통신 구조와 에러 응답 설계를 직접 처음부터 끝까지 설계해보기 위해 시작했습니다.
 
<!-- 실행 화면 GIF나 스크린샷 삽입예정 -->
<!-- ![demo](./docs/demo.gif) -->

 <br/>
## 목차
 
- [기술 스택](#기술-스택)
- [아키텍처](#아키텍처)
- [ERD](#erd)
- [주요 기능](#주요-기능)
- [API 명세](#api-명세)
- [트러블슈팅 / 기술적 의사결정](#트러블슈팅--기술적-의사결정)
- [실행 방법](#실행-방법)
- [폴더 구조](#폴더-구조)

<br/>
## 기술 스택
 
| 구분 | 기술 |
| --- | --- |
| Backend | NestJS |
| Database | SQLite (with TypeORM) |
| Frontend | Next.js |
| Tool | Git, VS Code |

<br/>
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

<br/>
## ERD
 
<!-- Todo 테이블 구조(필드, 타입, 관계)를 표 또는 다이어그램으로 정리하세요 -->
 
| 컬럼명 | 타입 | 설명 |
| --- | --- | --- |
| id | number | PK |
| title | string | 할 일 제목 |
| isDone | boolean | 완료 여부 |
| createdAt | datetime | 생성일시 |

<br/>
## 주요 기능
 
- **Todo CRUD**: 등록·수정·삭제 및 완료/미완료 상태 변경
- **키워드 검색**: LIKE 검색 기반 제목 검색
- **필터링**: 완료 상태별 목록 필터링
- **Optimistic UI**: 클라이언트에서 즉시 반영 후, 실패 시 롤백되는 에러 응답 구조
<!-- 각 기능별 스크린샷을 추가하면 좋습니다 -->

<br/>
## API 명세
 
| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/todos` | Todo 목록 조회 (검색/필터 쿼리 파라미터 지원) |
| POST | `/todos` | Todo 등록 |
| PATCH | `/todos/:id` | Todo 수정 (완료 상태 변경 포함) |
| DELETE | `/todos/:id` | Todo 삭제 |
 
<!-- 요청/응답 예시(JSON)를 추가하면 좋습니다. Swagger 적용 시 링크로 대체 가능 -->

<br/>
## 트러블슈팅 / 기술적 의사결정

<br/>
### 왜 SQLite를 선택했는가
<!-- 예: 개인 프로젝트 규모에서 별도 DB 서버 설치 없이 빠르게 개발/배포하기 위해 선택했다는 식으로 서술 -->

<br/>
### Optimistic UI의 에러 응답 구조 설계
<!-- 예: 클라이언트에서 먼저 상태를 반영한 뒤, 서버 응답 실패 시 이전 상태로 롤백하는 구조를 어떻게 설계했는지 -->

<br/>
### NestJS 계층 구조로 관심사를 분리한 경험
<!-- Controller-Service-Module 구조를 적용하며 얻은 인사이트 -->

<br/>
## 실행 방법
 
```bash
# 저장소 클론
git clone https://github.com/kimds777/<repo-name>.git
 
# 백엔드 실행
cd backend
npm install
npm run start:dev
 
# 프론트엔드 실행
cd frontend
npm install
npm run dev
```

환경변수 설정이 필요한 경우 `.env.example`을 참고해 `.env` 파일을 생성하세요.

<br/>
## 폴더 구조
 
```
.
├── backend/
│   ├── src/
│   │   ├── todo/
│   │   │   ├── todo.controller.ts
│   │   │   ├── todo.service.ts
│   │   │   └── todo.module.ts
│   │   └── main.ts
│   └── ...
└── frontend/
    ├── pages/
    ├── components/
    └── ...
```
