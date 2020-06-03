USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[read_user_week_nutrition]    Script Date: 2020-06-03 오후 2:02:16 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[read_user_week_nutrition]
@user_no float
AS
--초기화
IF OBJECT_ID('tempdb..#Table1') IS NOT NULL
BEGIN
DROP TABLE #Table1		--Table1은 특정 유저만 뽑은 테이블
END
--특정 유저가 섭취한 음식들만 뽑아서 임시 테이블
SELECT food_no,date INTO #Table1 FROM dbo.food_eaten_by_users WHERE user_no = @user_no
--하루 섭취 영양성분의 합들이 담길 결과 테이블
DECLARE @Result_Table table
(날짜 nvarchar(30), 열량 float, 탄수화물 float, 단백질 float, 지방 float, 당류 float, 나트륨 float, 콜레스테롤 float, 포화지방산 float, 트랜스지방산 float)

DECLARE @Result_Table2 table
(날짜 nvarchar(30), 주차 float, 열량 float, 탄수화물 float, 단백질 float, 지방 float, 당류 float, 나트륨 float, 콜레스테롤 float, 포화지방산 float, 트랜스지방산 float)

DECLARE @count int
SET @count = 0

-------------------------------------------반복문 시작----------------------------------------------------
WHILE @count < 7
BEGIN

--하루 동안 먹은 음식들 담길 테이블이기 때문에 반복문 안에서 생성
DECLARE @Table table
(날짜 nvarchar(30), 열량 float, 탄수화물 float, 단백질 float, 지방 float, 당류 float, 나트륨 float, 콜레스테롤 float, 포화지방산 float, 트랜스지방산 float)
------

DECLARE @date nvarchar(30)
SET @date = CONVERT(CHAR(10),dateadd(day,-@count,getdate()), 23)		--여기서 하루씩 빼면서 날짜 이동


IF OBJECT_ID('tempdb..#Table2') IS NOT NULL
BEGIN
DROP TABLE #Table2		--Table2은 특정 유저의 당일 날짜까지 고려한 테이블
END
------------------

-----------------------------------------------------------------CONVERT(CHAR(7), GETDATE(), 23) 이거로 달씩 쪼갤 수 있음
SELECT food_no INTO #Table2 FROM #Table1 WHERE (CHARINDEX(@date,CONVERT(CHAR(10), date, 23))>0)
------------------
DECLARE @food_no float
DECLARE CUR CURSOR FOR   --CUR라는 이름의 커서 선언

SELECT --쿼리 조회
food_no
FROM #Table2
OPEN CUR      --커서 오픈
FETCH NEXT FROM CUR INTO @food_no  --SELECT한 값을 @NAME,@AGE 변수에 넣는다.

--커서를이용해 한ROW씩 읽음 
WHILE @@FETCH_STATUS = 0
BEGIN
--SELECT 한 데이터의 행집합을 가지고 수행할 작업
INSERT INTO @Table (날짜, 열량, 탄수화물, 단백질, 지방, 당류, 나트륨, 콜레스테롤, 포화지방산, 트랜스지방산)
	SELECT @date, 열량_kcal,탄수화물_g,단백질_g,지방_g,당류_g,나트륨_mg,콜레스테롤_mg,포화지방산_g,트랜스지방산_g
	FROM dbo.food_nutrition
	WHERE food_no = @food_no
	
FETCH NEXT FROM CUR INTO @food_no --다음ROW로 이동
END

--커서 닫고 초기화
CLOSE CUR
DEALLOCATE CUR
-------------

--결과 테이블에 해당 날짜와 성분들의 합 저장

INSERT INTO @Result_Table (날짜, 열량, 탄수화물, 단백질, 지방, 당류, 나트륨, 콜레스테롤, 포화지방산, 트랜스지방산)
	SELECT @date, ISNULL(sum(열량),0),ISNULL(sum(탄수화물),0),ISNULL(sum(단백질),0),ISNULL(sum(지방),0),ISNULL(sum(당류),0),ISNULL(sum(나트륨),0),ISNULL(sum(콜레스테롤),0),ISNULL(sum(포화지방산),0),ISNULL(sum(트랜스지방산),0)
	FROM @Table

SET @count = @count +1

DELETE FROM @Table -- 임시 테이블 @Table 삭제

END

SELECT * FROM @Result_Table


--------------------------------------------------월별------------------------------------------------


SET @count = 0

-----------------반복문 시작---------------------
--일 수만큼 반복
WHILE @count < DAY(GETDATE())
BEGIN

--하루 동안 먹은 음식들 담길 테이블이기 때문에 반복문 안에서 생성
DECLARE @Table2 table
(날짜 nvarchar(30), 열량 float, 탄수화물 float, 단백질 float, 지방 float, 당류 float, 나트륨 float, 콜레스테롤 float, 포화지방산 float, 트랜스지방산 float)
------

SET @date = CONVERT(CHAR(10),DATEADD(D, -DAY(GETDATE() - 1) + @count, GETDATE()),23)		--여기서 하루씩 더하면서 날짜 이동


IF OBJECT_ID('tempdb..#Table4') IS NOT NULL
BEGIN
DROP TABLE #Table4		--Table2은 특정 유저의 하루 섭취량 저장될 테이블
END
------------------

-----------------------------------------------------------------CONVERT(CHAR(7), GETDATE(), 23) 이거로 달씩 쪼갤 수 있음
SELECT food_no INTO #Table4 FROM #Table1 WHERE (CHARINDEX(@date,CONVERT(CHAR(10), date, 23))>0)
------------------
DECLARE @food_no2 float
DECLARE CUR CURSOR FOR   --CUR라는 이름의 커서 선언

SELECT --쿼리 조회
food_no
FROM #Table4
OPEN CUR      --커서 오픈
FETCH NEXT FROM CUR INTO @food_no2  --SELECT한 값을 @food_no2 변수에 넣는다.

--커서를이용해 한ROW씩 읽음 
WHILE @@FETCH_STATUS = 0
BEGIN
--SELECT 한 데이터의 행집합을 가지고 수행할 작업
INSERT INTO @Table2 (날짜, 열량, 탄수화물, 단백질, 지방, 당류, 나트륨, 콜레스테롤, 포화지방산, 트랜스지방산)
	SELECT @date, 열량_kcal,탄수화물_g,단백질_g,지방_g,당류_g,나트륨_mg,콜레스테롤_mg,포화지방산_g,트랜스지방산_g
	FROM dbo.food_nutrition
	WHERE food_no = @food_no2
	
FETCH NEXT FROM CUR INTO @food_no2 --다음ROW로 이동
END

--커서 닫고 초기화
CLOSE CUR
DEALLOCATE CUR
-------------

--결과 테이블에 해당 날짜와 성분들의 합 저장
INSERT INTO @Result_Table2 (날짜, 주차, 열량, 탄수화물, 단백질, 지방, 당류, 나트륨, 콜레스테롤, 포화지방산, 트랜스지방산)
	SELECT @date,CEILING((DAY(@date) + DATEPART(DW, LEFT(CONVERT(VARCHAR(10), getdate(), 112), 6) + '01') - 1) / 7.0), sum(열량),sum(탄수화물),sum(단백질),sum(지방),sum(당류),sum(나트륨),sum(콜레스테롤),sum(포화지방산),sum(트랜스지방산)
	FROM @Table2

SET @count = @count +1

DELETE FROM @Table2 -- 임시 테이블 @Table 삭제

END



------------------
DECLARE @week float
SET @week = 1
DECLARE @max_week float
SELECT @max_week = max(주차) FROM @Result_Table2

DECLARE @month_result table
(주차 float, 열량 float, 탄수화물 float, 단백질 float, 지방 float, 당류 float, 나트륨 float, 콜레스테롤 float, 포화지방산 float, 트랜스지방산 float)

WHILE(@week<=@max_week)
BEGIN

INSERT INTO @month_result (주차, 열량, 탄수화물, 단백질, 지방, 당류, 나트륨, 콜레스테롤, 포화지방산, 트랜스지방산)
	SELECT @week, ISNULL(avg(열량),0),ISNULL(avg(탄수화물),0),ISNULL(avg(단백질),0),ISNULL(avg(지방),0),ISNULL(avg(당류),0),ISNULL(avg(나트륨),0),ISNULL(avg(콜레스테롤),0),ISNULL(avg(포화지방산),0),ISNULL(avg(트랜스지방산),0)
	FROM @Result_Table2
	WHERE 주차 = @week
	
SET @week +=1
END

DECLARE @마지막주차 int
SET @마지막주차 = CEILING((DAY(DATEADD(d,-1,CONVERT(DATETIME,CONVERT(CHAR(6),DATEADD(m,1,getdate()),112) + '01'))) + DATEPART(DW, LEFT(CONVERT(VARCHAR(10), getdate(), 112), 6) + '01') - 1) / 7.0)

WHILE (@week <= @마지막주차)
BEGIN
INSERT INTO @month_result (주차, 열량, 탄수화물, 단백질, 지방, 당류, 나트륨, 콜레스테롤, 포화지방산, 트랜스지방산)
	VALUES(@week,0,0,0,0,0,0,0,0,0)
SET @week += 1
END

SELECT * FROM @month_result


EXEC read_all_user_nutrition

-------
GO

