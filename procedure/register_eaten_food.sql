USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[register_eaten_food]    Script Date: 2020-06-03 오후 2:02:24 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[register_eaten_food]
@user_no float,
@food_no float

AS

declare @food_name nvarchar(30)
declare @date datetime

SELECT @food_name = food_name
FROM dbo.food_ingredient
WHERE food_no = @food_no

SELECT @date = CURRENT_TIMESTAMP

INSERT INTO dbo.food_eaten_by_users(user_no,food_no,food_name,date)
VALUES
(@user_no,@food_no,@food_name,@date)
GO

