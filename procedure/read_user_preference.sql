USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[read_user_preference]    Script Date: 2020-06-03 오후 2:01:56 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[read_user_preference]
AS

SELECT *
FROM dbo.user_preference order by user_no asc
GO

