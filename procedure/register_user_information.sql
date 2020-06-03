USE [maetdb]
GO

/****** Object:  StoredProcedure [dbo].[register_user_information]    Script Date: 2020-06-03 오후 2:02:40 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC [dbo].[register_user_information]
@id varchar(50),
@password varchar(50),
@name varchar(50),
@age float,
@sex nvarchar(20)
AS

DECLARE @calorie float

SET @calorie =
CASE
WHEN @age>=1 and @age<=2 THEN 1000
WHEN @age>=3 and @age<=5 THEN 1400
WHEN @age>=6 and @age<=8 and @sex='남' THEN 1700
WHEN @age>=9 and @age<=11 and @sex='남' THEN 2100
WHEN @age>=12 and @age<=14 and @sex='남' THEN 2500
WHEN @age>=15 and @age<=18 and @sex='남' THEN 2700
WHEN @age>=19 and @age<=29 and @sex='남' THEN 2600
WHEN @age>=30 and @age<=49 and @sex='남' THEN 2400
WHEN @age>=50 and @age<=64 and @sex='남' THEN 2200
WHEN @age>=65 and @sex='남' THEN 2000

WHEN @age>=6 and @age<=8 and @sex='여' THEN 1500
WHEN @age>=9 and @age<=11 and @sex='여' THEN 1800
WHEN @age>=12 and @age<=14 and @sex='여' THEN 2000
WHEN @age>=15 and @age<=18 and @sex='여' THEN 2000
WHEN @age>=19 and @age<=29 and @sex='여' THEN 2100
WHEN @age>=30 and @age<=49 and @sex='여' THEN 1900
WHEN @age>=50 and @age<=64 and @sex='여' THEN 1800
WHEN @age>=65 and @sex='여' THEN 1600
END


DECLARE @max_no int

   SELECT @max_no = MAX(user_no) + 1 FROM dbo.user_information
   IF @max_no IS NULL SELECT @max_no = 0

INSERT INTO dbo.user_information(user_no,user_id,user_password,user_name,[나이],[성별],[권장열량],[권장탄수화물],[권장단백질],[권장지방],[권장당류],[권장나트륨],[권장콜레스테롤],[권장포화지방산],[권장트랜스지방산])
VALUES
(@max_no,@id,@password,@name,@age,@sex,@calorie,@calorie * (60.0/100) / 4,@calorie * (15.0/100) / 4,@calorie * (25.0/100) / 9,@calorie * (1.0/200),2000,300,15,2)


INSERT INTO dbo.user_preference(user_no)
VALUES
(@max_no)

SELECT @max_no AS user_no
GO

