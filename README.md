# 2019 광운대학교 산학연계SW 프로젝트

광운대학교 산학연계SW 프로젝트로 진행되는 AI를 활용한 건강식단 프로그램입니다. 

#### Requirement
* Node.js
* Visual C++ 14.0
* python3
  * numpy
  * opencv
  * tensorflow >= 1.14.0
  * cython

### 서버 환경 구성
1. 해당 darkflow 폴더 경로로 들어가 줍니다. 그 후 setup.py 실행시켜줍니다.

서버에서 YOLO 모델을 실행하기 위해서 필요한 작업입니다.
```
python setup.py build_ext --inplace
```
위의 작업을 진행하던 중 error: Microsoft Visual C++ 14.0 is required. 해당 오류가 등장한다면

https://visualstudio.microsoft.com/ko/vs/older-downloads/

재배포 가능 패키지 및 빌드 도구 탭에서 Microsoft Build Tools 2015 업데이트 3 를 설치해주세요.

![image](https://user-images.githubusercontent.com/36293619/80299717-7b041080-87d1-11ea-91fc-374d89d793e5.png)
![image](https://user-images.githubusercontent.com/36293619/80299710-66c01380-87d1-11ea-8da4-57721e23ae99.png)


2. pip 이용하여 설치
```
pip install .
```

3. ckpt 파일 설치 
https://drive.google.com/open?id=1qDy5dKi7WQ_IgyWOw7XQXM6wuMvIGDd3

해당 링크에서 ckpt 파일을 다운로드 받고 `server/darkflow-2/` 디렉토리에 추가해주세요.

학습 결과를 가리키는 파일이 100MB를 초과하여 따로 업로드했습니다.

#
#### 아나콘다 이용 시
아나콘다 설치 경로 내부의 파이썬 경로를 확인해야합니다.

해당 경로는 이후 `server/recommendation-model/recommend.js` 에서 options의 pythonPath로 설정해주어야합니다.

일반적인 아나콘다 설치 경로는 다음과 같습니다.

* OSX `/opt/anaconda3/env/[가상환경 이름]/bin/python`
* Window `C:/Users/[YOURNAME]/anaconda3/envs/[가상환경 이름]/python` 또는 `C:/ProgramData/Anaconda3`


#### VSCode 이용 시
VSCode에서 실행되는 터미널 환경에서 파이썬이 올바르게 동작해야합니다.

1. 아나콘다로 파이썬 환경 구축 시

git bash 터미널 실행 후, 홈 디렉토리로 이동해서 .bashrc를 생성해주세요
```bash
cd ~
code .bashrc
```

아나콘다 설치 경로 내부의 conda.sh를 실행 시킬 수 있도록 합니다. conda.sh는 터미널 환경에서 아나콘다가 활성화할 수 있도록 하는 bash 파일입니다.

일반적인 경로는 `[아나콘다 경로]/etc/profile.d/conda.sh`입니다.

.bashrc에 해당 코드를 입력하고 저장해주세요
```bash
source [아나콘다 경로]/etc/profile.d/conda.sh
```
꼭 아나콘다 설치 경로 내부에 있는 `/etc/profile.d/conda.sh`로 지정해주세요.

#
#### 사용 방법
`server/pythonPath.js` 에서
> pythonPath = '/opt/anaconda3/envs/tf1/bin/python3'

해당 부분을 자신이 구축한 파이썬 경로로 지정해주세요.

1. 로컬 서버 실행

아나콘다 가상 환경을 activate 시켜주세요.
```shell
conda activate [자신의 가상환경 이름]
node server/server.js
```
2. 리액트 앱 실행
```npm
npm start
```
또는 yarn 이용 시
```yarn
yarn start
```
