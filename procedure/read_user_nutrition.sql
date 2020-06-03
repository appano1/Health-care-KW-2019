USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[read_user_nutrition]    Script Date: 2020-06-03 오후 2:01:48 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[read_user_nutrition]
@user_no float

AS

SELECT 권장열량,권장탄수화물,권장단백질,권장지방,권장당류,권장나트륨,권장콜레스테롤,권장포화지방산,권장트랜스지방산
FROM dbo.user_information
WHERE user_no = @user_no
GO

