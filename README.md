## Commit_Rule

### This is my commit rule  

1. 제목과 본문을 모두 작성하여 commit한다
2. commit -m 옵션을 사용하지 않고 vim등과 같은 에디터를 사용하여 작성한다
3. **일반적인** git 작성 규칙을 사용한다
4. 변경한 내용을 순서에 따라 적는다
5. 목록형으로 작성 가능

~~~
ex)
Update communication Function

1) Add Bluetooth BLE 4.0 service
2) Remove WiFi Module
~~~

### 일반적인 git 작성 규칙

#### 제목  
- 50자를 넘지 않는다  
- 대문자로 시작한다  
- 마침표를 찍지 않는다  
- 제목과 본문사이에 2번째 행은 비워둔다  

#### 본문   
- 72자를 넘지 않는다  
- 명령형 어조를 사용한다(동사로 시작되며 현재형)  
- 명시적으로 사용한다  

### 커스텀 규칙

#### 제목
- Update : 폴더 단위 파일 변경
- Add : 파일이나 기능 추가
- Remove : 파일이나 기능 제거
- Modify : 파일이나 기능, 내용 수정

#### 본문
- 1,2,3 등의 개조식으로 표현
