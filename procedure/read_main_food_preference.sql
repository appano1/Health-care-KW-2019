USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[read_main_food_preference]    Script Date: 2020-06-03 오후 2:01:15 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[read_main_food_preference]
AS
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
EXEC('SELECT ' + @main_food_no + ' FROM dbo.user_preference order by user_no asc')
GO

