# 1. 소개
Frip의 호스트와 유저 간 서비스를 demo버전으로 구현한 프로젝트입니다. 모임 등록, 참가, 후기 작성 등의 기능이 구현되었습니다.

# 2. UseCase
```plantuml
left to right direction
skinparam packageStyle rectangle
actor administrator
actor host
actor user
rectangle meeting {
    (register meeting) <-- host
    (update meeting) <-- host
    (delete meeting) <-- host
    (check attendance) <-- host
    (report no-show participant) <-- host
    (report no-show participant) .> (check attendance) : include

    user --> (see meeting)
    user --> (register review)
    user --> (update review)
    user --> (delete review)
    user --> (apply for meeting)
    user --> (cancel the application)
    (apply for meeting) .> (pay the cost) : include

    (see meeting) -[hidden]- (register meeting)
    (register review) -[hidden]- (update meeting)
    (update review) -[hidden]- (delete meeting)
    (delete review) -[hidden]- (check attendance)
}
```
# 3. ERD
<img width="950" alt="ERD" src="https://user-images.githubusercontent.com/54763136/105135807-f3ff8100-5b33-11eb-99ac-79217ed51d7a.png">

# 4. Getting Started

DB configuration
```
# .env.test

PORT=4080
DB_HOST=localhost
DB_USERNAME='write your username'
DB_PASSWORD='write your password'
DB_DATABASE=frientripTest

# .env.development

PORT=4080
DB_HOST=localhost
DB_USERNAME='write your username'
DB_PASSWORD='write your password'
DB_DATABASE=frip
```

Install dependencies

    npm install

Run tests

    npm test    

Run development server

    npm run dev

# 5. Swagger

explore swagger docs
`localhost:4080/api-docs/`
