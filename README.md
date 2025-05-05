# FindingBird-api

## Description
시민 참여형 생태 탐사 프로젝트 `{새}^{*}보러가자`의 백엔드 레포지토리입니다.

## Project setup

```bash
$ yarn install
```
## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Deploy

Github Action을 통해 EC2 에 자동배포됩니다.

## Architecture

본 프로젝트는 DDD 설계를 기반으로 하며, Hexagonal Architecture의 개념을 참고해 각 계층을 분리하였습니다.

각 도메인은 4개의 layer로 구성됩니다.
(본 프로젝트에서 도메인은 `src/modules/` 내의 폴더로 구분됩니다.)

### Domain Layer
- 해당 도메인 내에서 사용되는 객체(도메인 엔티티 및 값 객체)들을 정의합니다.
- 각 객체들의 속성과 따라야 할 규칙, 이를 검증하는 로직을 구현합니다.
- 필요 시 해당 도메인에서 수행되어야 하는 기능(ex. 여러 객체들 중 하나를 추천하는 기능 등)을 구현합니다.

### Application Layer
- 해당 도메인의 유즈케이스들을 정의합니다. (본 프로젝트에서는 개발의 편의를 위해 여러 유스케이스들을 '서비스'라는 하나의 파일에서 정의합니다.)
- In/Out 포트를 정의합니다.
  - In Port: 외부에서 내부 로직을 사용하기 위한 인터페이스 정의(ex. 서비스 인터페이스 등)
  - Out Port: 내부에서 외부 영역에 접근하기 위한 인터페이스 정의(ex. 레포지토리 인터페이스, 외부 API Client 등)
- In Port 의 어댑터(실제 구현체)를 구현합니다.

### Infrastructure Layer
- Out Port 의 인터페이스에 의존하며 해당 포트의 어댑터(실제 구현체)를 구현합니다.
- 도메인 객체의 영속화를 위한 ORM Entity 및 변환을 위한 Mapper를 정의합니다.
- 외부 API(ex. OpenAI, AWS S3 등)의 실제 호출을 구현합니다.

### Presentation Layer
- In Port 의 인터페이스에 의존하며 유즈케이스들을 외부에 드러냅니다.
- 요청 및 응답 구조를 정의하며 사용자 요청에 대한 검증을 수행합니다.
- API 에 대한 문서를 작성합니다.

<br>

여러 도메인에 걸친 로직은 다음과 같이 수행합니다.

- 한 도메인에서 다른 도메인의 In Port 인터페이스에 의존하여 로직 수행
  - 두 도메인이 명확히 독립적이고, 특정 도메인에서 다른 도메인의 기능을 참조만 해야 할 때 수행합니다.
  - 간단한 협력관계일 때 수행합니다.
  - (본 프로젝트에서는 개발의 편의를 위해 다른 도메인의 호출을 위한 Out Port를 정의하지는 않습니다.)

- 상위 Orchestration 모듈을 정의한 후 하위 도메인의 인터페이스를 통해 로직 수행
  - 여러 도메인이 협력하여 하나의 비즈니스 프로세스를 완성할 때 수행합니다.
  - 조정자 역할(ex. Transaction 경계 설정 등) 이 필요할 때 수행합니다.

## Directory Structure

디렉토리 구조는 다음과 같습니다.

```bash
src/
├── modules/                        # 도메인별 모듈 모음
│   ├── bird/                       # 'bird' 도메인
│   │   ├── domain/                 # Domain Layer
│   │   │   ├── models/             # 도메인 엔티티 및 값 객체
│   │   │   └── services/           # 도메인 서비스
│   │   │
│   │   ├── application/            # Application Layer
│   │   │   ├── ports/
│   │   │   │   ├── in/             # In Port (서비스 인터페이스)
│   │   │   │   └── out/            # Out Port (레포지토리, API 클라이언트 인터페이스)
│   │   │   ├── services/           # 유스케이스 구현 (In Port Adapter)
│   │   │   └── dtos/
│   │   │
│   │   ├── infrastructure/         # Infrastructure Layer
│   │   │   ├── repositories/       # DB 접근 레포지토리 구현 (Out Port Adapter)
│   │   │   ├── entities/           # ORM Entity
│   │   │   └── mappers/            # ORM ↔ 도메인 매핑
│   │   │
│   │   └── presentation/           # Presentation Layer
│   │       └── http/               # HTTP 요청 컨트롤러
│   │           └── dtos/
│   └── other-domain/
│       └── ...                     # 동일한 구조
│
├── common/                         # 공통 유틸리티 및 예외 처리
│   ├── models/                     # 도메인 엔티티 및 값 객체의 기본 형태
│   ├── interceptors/               # 공통 인터셉터(Logging)
│   ├── filters/                    # 공통 예외필터
│   ├── exceptions/                 # 공통 예외 객체
│   ├── utils/                      # 공통 유틸리티
│   └── ...
│
├── config/                         # 환경설정 (DB, 외부 API 등)
│   ├── typeorm.config.ts
│   └── ...
│
├── app.module.ts
└── main.ts                         # 애플리케이션 진입점
```

## Technology & Infra

NestJS, PostgreSQL, OAuth(Kakao), OpenAI API, AWS S3

## API DOCS

- [배포 Swagger 문서 보기](https://findingbird.ksssssh.me/docs)
- (또는 로컬에서 실행 후 `http://localhost:3000/docs` 에서 확인 가능)