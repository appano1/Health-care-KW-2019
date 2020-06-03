USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[read_user_today_nutrition]    Script Date: 2020-06-03 오후 2:02:07 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[read_user_today_nutrition]
@user_no float
AS

--초기화
IF OBJECT_ID('tempdb..#Table1') IS NOT NULL
BEGIN
DROP TABLE #Table1		--Table1은 특정 유저만 뽑은 테이블
END

IF OBJECT_ID('tempdb..#Table2') IS NOT NULL
BEGIN
DROP TABLE #Table2		--Table2은 특정 유저의 당일 날짜까지 고려한 테이블
END
------------------
--특정 유저가 섭취한 음식들만 뽑아서 임시 테이블
SELECT food_no,date INTO #Table1 FROM dbo.food_eaten_by_users WHERE user_no = @user_no

DECLARE @date nvarchar(30)
SET @date = CONVERT(CHAR(10), GETDATE(), 23)
------------------------------------------------------------------------------CONVERT(CHAR(7), GETDATE(), 23) 이거로 달씩 쪼갤 수 있음
SELECT food_no INTO #Table2 FROM #Table1 WHERE (CHARINDEX(@date,CONVERT(CHAR(10), date, 23))>0)

-------------------------------
--@Table에 영양성분들 저장
DECLARE @Table table
(열량 float, 탄수화물 float, 단백질 float, 지방 float, 당류 float, 나트륨 float, 콜레스테롤 float, 포화지방산 float, 트랜스지방산 float)

-------------
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
INSERT INTO @Table (열량, 탄수화물, 단백질, 지방, 당류, 나트륨, 콜레스테롤, 포화지방산, 트랜스지방산)
	SELECT 열량_kcal,탄수화물_g,단백질_g,지방_g,당류_g,나트륨_mg,콜레스테롤_mg,포화지방산_g,트랜스지방산_g
	FROM dbo.food_nutrition
	WHERE food_no = @food_no
	
FETCH NEXT FROM CUR INTO @food_no --다음ROW로 이동
END

--커서 닫고 초기화
CLOSE CUR
DEALLOCATE CUR
-------------
DECLARE @열량 float, @탄수화물 float, @단백질 float, @지방 float, @당류 float, @나트륨 float, @콜레스테롤 float, @포화지방산 float, @트랜스지방산 float

SELECT @열량 = sum(열량) from @Table
SELECT @탄수화물 = sum(탄수화물) from @Table
SELECT @단백질 = sum(단백질) from @Table
SELECT @지방 = sum(지방) from @Table
SELECT @당류 = sum(당류) from @Table
SELECT @나트륨 = sum(나트륨) from @Table
SELECT @콜레스테롤 = sum(콜레스테롤) from @Table
SELECT @포화지방산 = sum(포화지방산) from @Table
SELECT @트랜스지방산 = sum(트랜스지방산) from @Table

SELECT @열량 AS 열량, @탄수화물 AS 탄수화물, @단백질 AS 단백질, @지방 AS 지방, @당류 AS 당류, @나트륨 AS 나트륨, @콜레스테롤 AS 콜레스테롤, @포화지방산 AS 포화지방산, @트랜스지방산 AS 트랜스지방산
GO

