USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[calculate_nutrition]    Script Date: 2020-06-03 오후 1:57:54 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[calculate_nutrition]
@user_no float
AS
DECLARE 
@aa float,
@bb numeric(18,5),
@cc numeric(18,5),
@dd numeric(18,5),
@ee numeric(18,5),
@ff numeric(18,5),
@gg numeric(18,5),
@hh numeric(18,5),
@ii numeric(18,5),
@eat_aa float,
@eat_bb numeric(18,5),
@eat_cc numeric(18,5),
@eat_dd numeric(18,5),
@eat_ee numeric(18,5),
@eat_ff numeric(18,5),
@eat_gg numeric(18,5),
@eat_hh numeric(18,5),
@eat_ii numeric(18,5)

-- 특정 회원의 권장 영양 성분들 빼와서 각각 변수에 저장
SELECT @aa = [권장열량] FROM dbo.user_information
WHERE user_no = @user_no
SELECT @bb = [권장탄수화물] FROM dbo.user_information
WHERE user_no = @user_no
SELECT @cc = [권장단백질] FROM dbo.user_information
WHERE user_no = @user_no
SELECT @dd = [권장지방] FROM dbo.user_information
WHERE user_no = @user_no
SELECT @ee = [권장당류] FROM dbo.user_information
WHERE user_no = @user_no
SELECT @ff = [권장나트륨] FROM dbo.user_information
WHERE user_no = @user_no
--SELECT @gg = [권장콜레스테롤] FROM dbo.user_information
--WHERE user_no = @user_no
--SELECT @hh = [권장포화지방산] FROM dbo.user_information
--WHERE user_no = @user_no
--SELECT @ii = [권장트랜스지방산] FROM dbo.user_information
--WHERE user_no = @user_no
SET @gg = 0
SET @hh = 0
SET @ii = 0

--권장 영양 성분에서 섭취량 빼주는 과정

IF OBJECT_ID('tempdb..#eat_table') IS NOT NULL
BEGIN
DROP TABLE #eat_table		--Table1은 특정 유저만 뽑은 테이블
END

CREATE TABLE #eat_table (섭취열량 float, 섭취탄수화물 numeric(18,5), 섭취단백질 numeric(18,5), 섭취지방 numeric(18,5), 섭취당류 numeric(18,5), 섭취나트륨 numeric(18,5), 섭취콜레스테롤 numeric(18,5), 섭취포화지방산 numeric(18,5), 섭취트랜스지방산 numeric(18,5))

insert into #eat_table exec read_user_today_nutrition @user_no

SELECT @eat_aa = ISNULL([섭취열량],0) FROM #eat_table
SELECT @eat_bb = ISNULL([섭취탄수화물],0) FROM #eat_table
SELECT @eat_cc = ISNULL([섭취단백질],0) FROM #eat_table
SELECT @eat_dd = ISNULL([섭취지방],0) FROM #eat_table
SELECT @eat_ee = ISNULL([섭취당류],0) FROM #eat_table
SELECT @eat_ff = ISNULL([섭취나트륨],0) FROM #eat_table
SELECT @eat_gg = ISNULL([섭취콜레스테롤],0) FROM #eat_table
SELECT @eat_hh = ISNULL([섭취포화지방산],0) FROM #eat_table
SELECT @eat_ii = ISNULL([섭취트랜스지방산],0) FROM #eat_table

drop table #eat_table 
SET @aa -= @eat_aa
SET @bb -= @eat_bb
SET @cc -= @eat_cc
SET @dd -= @eat_dd
SET @ee -= @eat_ee
SET @ff -= @eat_ff
SET @gg -= @eat_gg
SET @hh -= @eat_hh
SET @ii -= @eat_ii

----------------------------------------


--임시 테이블-------
DECLARE @Table table
( result numeric(18,10))
--------------------
DECLARE @a float, @b numeric(18,5), @c numeric(18,5), @d numeric(18,5), @e numeric(18,5), @f numeric(18,5), @g numeric(18,5), @h numeric(18,5), @i numeric(18,5)
DECLARE @result numeric(18,10)
DECLARE @num INT
SET @num = 0

WHILE @num < 518
BEGIN

	SELECT @a = [열량_kcal] FROM dbo.food_nutrition
	WHERE food_no = @num
	SELECT @b = [탄수화물_g] FROM dbo.food_nutrition
	WHERE food_no = @num
	SELECT @c = [단백질_g] FROM dbo.food_nutrition
	WHERE food_no = @num
	SELECT @d = [지방_g] FROM dbo.food_nutrition
	WHERE food_no = @num
	SELECT @e = [당류_g] FROM dbo.food_nutrition
	WHERE food_no = @num
	SELECT @f = [나트륨_mg] FROM dbo.food_nutrition
	WHERE food_no = @num
	SELECT @g = [콜레스테롤_mg] FROM dbo.food_nutrition
	WHERE food_no = @num
	SELECT @h = [포화지방산_g] FROM dbo.food_nutrition
	WHERE food_no = @num
	SELECT @i = [트랜스지방산_g] FROM dbo.food_nutrition
	WHERE food_no = @num
	
	SET @result = POWER(@aa/100.0 - @a/100.0,2) + POWER(@bb/100.0 - @b/100.0,2) + POWER(@cc/10.0 - @c/10.0,2) + POWER(@dd/10.0 - @d/10.0,2) + POWER(@ee/10.0 - @e/10.0,2) + POWER(@ff/1000.0 - @f/1000.0,2) + POWER(@gg/100.0 - @g/100.0,2) + POWER(@hh - @h,2) + POWER(@ii*10.0 - @i*10.0,2)

	INSERT INTO @Table(result) VALUES (@result/9)
SET @num = @num + 1
END

SELECT * FROM @Table
GO

