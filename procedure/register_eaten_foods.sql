USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[register_eaten_foods]    Script Date: 2020-06-03 오후 2:02:32 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[register_eaten_foods]
@user_no float,
@food_nos nvarchar(500)
AS

declare @date datetime
SET @date = CURRENT_TIMESTAMP

declare @food_no nvarchar(5)
declare @food_name nvarchar(30)

-----------------반복문-------------------
WHILE CHARINDEX(',', @food_nos) > 0
BEGIN
-- 처음 발견한 , 왼쪽 음식 번호를 빼와서 저장
SET @food_no = LEFT(@food_nos, CHARINDEX(',', @food_nos)-1)

-- 처음 발견한 , 왼쪽 음식 번호를 이용해서 음식 번호 저장
SELECT @food_name = food_name
FROM dbo.food_ingredient
WHERE food_no = @food_no				--음식 번호 들어가야함

-- 유저 번호, 음식 번호, 음식 이름, 날짜 테이블에 INSERT
INSERT INTO dbo.food_eaten_by_users(user_no,food_no,food_name,date)
VALUES
(@user_no,@food_no,@food_name,@date)

-- 처음 발견한 , 오른쪽 음식 번호들을 다시 @food_no에 저장
set @food_nos = RIGHT(@food_nos, len(@food_nos)-CHARINDEX(',', @food_nos))

END;


---food_nos에 남아있는 마지막 항목도 추가해주는 작업----
SELECT @food_name = food_name
FROM dbo.food_ingredient
WHERE food_no = @food_nos

INSERT INTO dbo.food_eaten_by_users(user_no,food_no,food_name,date)
VALUES
(@user_no,@food_nos,@food_name,@date)

----------------------------------------
GO

