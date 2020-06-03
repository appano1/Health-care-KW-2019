USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[read_food_nutrition]    Script Date: 2020-06-03 오후 2:01:06 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[read_food_nutrition]
AS

SELECT food_no, food_name, food_type
FROM dbo.food_ingredient
GO

