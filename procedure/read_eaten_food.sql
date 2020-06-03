USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[read_eaten_food]    Script Date: 2020-06-03 오후 2:00:30 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[read_eaten_food]
@user_no float
AS

IF OBJECT_ID('tempdb..#Table1') IS NOT NULL
BEGIN
DROP TABLE #Table1		--Table1은 특정 유저만 뽑은 테이블
END

SELECT food_no,food_name, date INTO #Table1 FROM dbo.food_eaten_by_users WHERE user_no = 0


DECLARE @Table table
(food_no float, food_name nvarchar(30), date nvarchar(30))

DECLARE @food_no float
DECLARE @food_name nvarchar(30)
DECLARE @date date

DECLARE CUR CURSOR FOR   --CUR라는 이름의 커서 선언

SELECT --쿼리 조회
food_no, food_name, date
FROM #Table1
OPEN CUR      --커서 오픈
FETCH NEXT FROM CUR INTO @food_no,@food_name,@date  --SELECT한 값을 @NAME,@AGE 변수에 넣는다.

--커서를이용해 한ROW씩 읽음 
WHILE @@FETCH_STATUS = 0
BEGIN
--SELECT 한 데이터의 행집합을 가지고 수행할 작업
INSERT INTO @Table (food_no, food_name, date)
	VALUES (@food_no,@food_name,CONVERT(CHAR(10), @date, 23))
	
FETCH NEXT FROM CUR INTO @food_no,@food_name,@date --다음ROW로 이동
END

--커서 닫고 초기화
CLOSE CUR
DEALLOCATE CUR

select * from @Table
GO

