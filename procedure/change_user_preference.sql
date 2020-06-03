USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[change_user_preference]    Script Date: 2020-06-03 오후 1:59:08 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[change_user_preference]
@user_no float,			--회원번호
@food_no float,			--음식번호
@type float				--선호도 올릴지 내릴지
AS
DECLARE @column CHAR(8)				--해당 회원 해당 음식이 있는 열
DECLARE @before_preference float	--바꾸기 전 원래 선호도
SET @before_preference = 0;

--인자로 받은 food_no으로 음식_?? 형태로 바꿔준다
SELECT @column = '음식_' + CONVERT(VARCHAR(10),@food_no) FROM dbo.user_preference
WHERE user_no = @user_no


declare @Table table
( preference float)

--해당 회원의 해당 음식 선호도를 가져와서 임시 테이블인 @Table에 저장
insert @Table EXEC('select '+ @column + ' from dbo.user_preference WHERE user_no = '+@user_no)

--임시 테이블에 저장된 값을 가져옴
SELECT @before_preference = preference FROM @Table

--인자로 받은 type에 따라 선호도를 올리거나 내림
IF (@type = 0)
	SET @before_preference += 1;
ELSE
	SET @before_preference -= 1;

EXEC('UPDATE dbo.user_preference SET [' + @column + '] =' + @before_preference +' WHERE user_no = ' + @user_no)

---------------------
DECLARE @main_food_no VARCHAR(3000)

--초기화
IF OBJECT_ID('tempdb..#Table3') IS NOT NULL
BEGIN
DROP TABLE #Table3
END
--
SELECT food_no INTO #Table3 FROM dbo.food_ingredient WHERE food_type = 0

DECLARE @food_no_cur float
DECLARE CUR CURSOR FOR   --CUR라는 이름의 커서 선언

SELECT --쿼리 조회
food_no                
FROM #Table3
OPEN CUR      --커서 오픈
FETCH NEXT FROM CUR INTO @food_no_cur  --SELECT한 값을 @food_no_cur 변수에 넣는다.

--커서를이용해 한ROW씩 읽음 
WHILE @@FETCH_STATUS = 0
BEGIN
--SELECT 한 데이터의 행집합을 가지고 수행할 작업
DECLARE @abc VARCHAR(9)
SET @abc = '음식_' + CONVERT(VARCHAR(10),@food_no_cur) + ','
SET @main_food_no = CONCAT(@main_food_no, @abc)
FETCH NEXT FROM CUR INTO @food_no_cur --다음ROW로 이동
END

--커서 닫고 초기화
CLOSE CUR
DEALLOCATE CUR

SET @main_food_no = left(@main_food_no,len(@main_food_no) - 1)
EXEC('SELECT ' + @main_food_no + ' FROM dbo.user_preference')
GO

