USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[remove_hate_food]    Script Date: 2020-06-03 오후 2:02:59 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[remove_hate_food]
@user_no float,
@food_names nvarchar(max)

AS

declare @food_no float
declare @food_name nvarchar(30)

-----------------반복문-------------------
WHILE CHARINDEX(',', @food_names) > 0
BEGIN
-- 처음 발견한 , 왼쪽 음식 이름 빼와서 저장
SET @food_name = LEFT(@food_names, CHARINDEX(',', @food_names)-1)
-- 음식 이름으로 음식 번호 가져오기
SELECT @food_no = food_no FROM food_ingredient WHERE food_name = @food_name

EXEC('UPDATE dbo.user_preference SET [' + '음식_' + @food_no + '] = 0 ' + ' WHERE user_no = ' + @user_no)


-- 처음 발견한 , 오른쪽 음식 번호들을 다시 @food_no에 저장
set @food_names = RIGHT(@food_names, len(@food_names)-CHARINDEX(',', @food_names))

END;


---food_names에 남아있는 마지막 항목도 추가해주는 작업----

SELECT @food_no = food_no FROM food_ingredient WHERE food_name = @food_names
EXEC('UPDATE dbo.user_preference SET [' + '음식_' + @food_no + '] = 0 ' + ' WHERE user_no = ' + @user_no)

----------------------------------------
GO

