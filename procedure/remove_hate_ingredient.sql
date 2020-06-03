USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[remove_hate_ingredient]    Script Date: 2020-06-03 오후 2:03:07 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[remove_hate_ingredient]
@user_no float,
@ingredient nvarchar(30)
AS

DECLARE @Table table
(food_no nvarchar(30))

INSERT INTO @Table (food_no)
	SELECT '음식_'+CONVERT(VARCHAR(10),food_no)
	FROM food_ingredient
	WHERE ingredient like '%'+@ingredient+'%'


DECLARE @food_no nvarchar(30)
DECLARE CUR CURSOR FOR   --CUR라는 이름의 커서 선언

SELECT --쿼리 조회
food_no                
FROM @Table
OPEN CUR      --커서 오픈
FETCH NEXT FROM CUR INTO @food_no  --SELECT한 값을 @NAME,@AGE 변수에 넣는다.

--커서를이용해 한ROW씩 읽음 
WHILE @@FETCH_STATUS = 0
BEGIN
--SELECT 한 데이터의 행집합을 가지고 수행할 작업

EXEC('UPDATE dbo.user_preference SET [' + @food_no + '] = 0 ' + ' WHERE user_no = ' + @user_no)

FETCH NEXT FROM CUR INTO @food_no --다음ROW로 이동
END

--커서 닫고 초기화
CLOSE CUR
DEALLOCATE CUR
GO

