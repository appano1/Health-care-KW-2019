USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[change_user_preference_by_score]    Script Date: 2020-06-03 오후 1:59:55 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[change_user_preference_by_score]
@user_no float,
@food_no float,
@score float
AS

DECLARE @column CHAR(8)				--해당 회원 해당 음식이 있는 열
DECLARE @before_preference float	--바꾸기 전 원래 선호도
SET @before_preference = 0;

--인자로 받은 food_no으로 음식_?? 형태로 바꿔준다
SELECT @column = '음식_' + CONVERT(VARCHAR(10),@food_no) FROM dbo.user_preference
WHERE user_no = @user_no


declare @Table table
(preference float)

--해당 회원의 해당 음식 선호도를 가져와서 임시 테이블인 @Table에 저장
insert @Table EXEC('select '+ @column + ' from dbo.user_preference WHERE user_no = '+@user_no)

--임시 테이블에 저장된 값을 가져옴
SELECT @before_preference = preference FROM @Table

--인자로 받은 score에 따라 선호도를 바꿔줌
SET @before_preference = @before_preference * (convert(float,1)/5) * @score

EXEC('UPDATE dbo.user_preference SET [' + @column + '] =' + @before_preference +' WHERE user_no = ' + @user_no)
GO

