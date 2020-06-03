USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[read_all_user_nutrition]    Script Date: 2020-06-03 오후 2:00:18 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[read_all_user_nutrition]
AS

DECLARE @ResultTable Table
(열량 float, 탄수화물 float, 단백질 float, 지방 float, 당류 float, 나트륨 float, 콜레스테롤 float, 포화지방산 float, 트랜스지방산 float)

DECLARE @max_user_no int

SELECT @max_user_no = max(user_no) FROM user_information
DECLARE @count int
SET @count = 0

WHILE @count < @max_user_no + 1		--유저 번호가 0~8까지면 9명이므로 9번 반복해야 함
BEGIN
DECLARE @TempTable Table
(주차 float, 열량 float, 탄수화물 float, 단백질 float, 지방 float, 당류 float, 나트륨 float, 콜레스테롤 float, 포화지방산 float, 트랜스지방산 float)

INSERT INTO @TempTable
Exec read_user_month_nutrition @count

INSERT INTO @ResultTable (열량, 탄수화물, 단백질, 지방, 당류, 나트륨, 콜레스테롤, 포화지방산, 트랜스지방산)
	SELECT  avg(열량),avg(탄수화물),avg(단백질),avg(지방),avg(당류),avg(나트륨),avg(콜레스테롤),avg(포화지방산),avg(트랜스지방산)
	FROM @TempTable

SET @count += 1
DELETE FROM @TempTable
END

SELECT * FROM @ResultTable
GO

