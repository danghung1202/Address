USE [Address]
GO
/****** Object:  User [Address]    Script Date: 8/20/2019 2:18:06 PM ******/
CREATE USER [Address] WITHOUT LOGIN WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [Address]
GO
/****** Object:  UserDefinedTableType [dbo].[AddressOfLocation]    Script Date: 8/20/2019 2:18:06 PM ******/
CREATE TYPE [dbo].[AddressOfLocation] AS TABLE(
	[idex] [int] NULL,
	[aid] [varchar](64) NULL,
	[aname] [nvarchar](200) NULL,
	[aparent] [varchar](64) NULL,
	[alevel] [tinyint] NULL
)
GO
/****** Object:  UserDefinedFunction [dbo].[SplitString]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 06.05.12
-- Description:	hàm split xâu theo một ký tự cho trước, trả lại các phần có đã bỏ đi các ký tự trắng 2 đầu
-- =============================================
CREATE FUNCTION [dbo].[SplitString] 
(
    -- Add the parameters for the function here
    @myString nvarchar(max),
    @deliminator varchar(10)
)
RETURNS 
@ReturnTable TABLE 
(
    -- Add the column definitions for the TABLE variable here
    [id] [int] IDENTITY(1,1) NOT NULL,
    [part] [nvarchar](max) NULL
)
AS
BEGIN
        Declare @iSpaces int
        Declare @part varchar(50)
		declare @len_deliminator int = len('*' + @deliminator + '*') - 2;
        --initialize spaces
        Select @iSpaces = charindex(@deliminator,@myString,0)
        While @iSpaces > 0

        Begin
            Select @part = substring(@myString,0,charindex(@deliminator,@myString,0))

            Insert Into @ReturnTable(part)
            Select ltrim(rtrim(@part))
			
			Select @myString = substring(@mystring,charindex(@deliminator,@myString,0)+ @len_deliminator ,len('*' + @myString + '*') - 2 - charindex(@deliminator,@myString,0))

            Select @iSpaces = charindex(@deliminator,@myString,0)
        end

        If len(@myString) > 0
            Insert Into @ReturnTable
            Select ltrim(rtrim(@myString))

    RETURN 
END

GO
/****** Object:  UserDefinedFunction [dbo].[STCheckIntersectPercentBetweentTwoPolygons]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION  [dbo].[STCheckIntersectPercentBetweentTwoPolygons]
(
	-- Add the parameters for the function here
	@Polygon1 geography,
	@Polygon2 geography
)
RETURNS float
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result float, @Polygon geography;

	-- Add the T-SQL statements to compute the return value here
	set @Polygon = @Polygon1.STIntersection(@Polygon2);
	set @Result = @Polygon.STArea() / @Polygon1.STArea() * 100
	-- Return the result of the function
	RETURN @Result

END

GO
/****** Object:  UserDefinedFunction [dbo].[ToGuid]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 06.05.12
-- Description:	Hàm chuyển string sang kiểu guid (uniqueidentifier)
-- =============================================
CREATE FUNCTION [dbo].[ToGuid] 
(
	@AddressID varchar(64)
)
RETURNS uniqueidentifier
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result uniqueidentifier

	-- Add the T-SQL statements to compute the return value here
	SELECT @Result = CAST(@AddressID AS UNIQUEIDENTIFIER)

	-- Return the result of the function
	RETURN @Result

END

GO
/****** Object:  UserDefinedFunction [dbo].[ToLineString]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[ToLineString]
(
	-- Add the parameters for the function here
	@polyline varchar(max)
)
RETURNS varchar(max)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result varchar(max)
	
	-- Add the T-SQL statements to compute the return value here
	SELECT @Result = SUBSTRING(@polyline, charindex('(', @polyline, 0) + 1, charindex(')', @polyline, 0) -charindex('(', @polyline, 0) - 1);

	-- Return the result of the function
	RETURN @Result

END

GO
/****** Object:  UserDefinedFunction [dbo].[ToPointString]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[ToPointString]
(
	-- Add the parameters for the function here
	@point varchar(64)
)
RETURNS varchar(64)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result varchar(64)
	
	-- Add the T-SQL statements to compute the return value here
	SELECT @Result = SUBSTRING(@point, charindex('(', @point, 0) + 1, charindex(')', @point, 0) -charindex('(', @point, 0) - 1);

	-- Return the result of the function
	RETURN @Result

END

GO
/****** Object:  UserDefinedFunction [dbo].[ToPolygonString]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[ToPolygonString]
(
	-- Add the parameters for the function here
	@polygon varchar(max)
)
RETURNS varchar(max)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result varchar(max)
	
	-- Add the T-SQL statements to compute the return value here
	SELECT @Result = SUBSTRING(@polygon, charindex('((', @polygon, 0) + 2, charindex('))', @polygon, 0) -charindex('((', @polygon, 0) - 2);

	-- Return the result of the function
	RETURN @Result

END

GO
/****** Object:  UserDefinedFunction [dbo].[udfGetAddressOfLocation]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 03/07/2012
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[udfGetAddressOfLocation] 
(
	-- Add the parameters for the function here
	@location geography
	,@aid varchar(64)
	,@alevel tinyint
)
RETURNS 
@tbl TABLE 
(
	-- Add the column definitions for the TABLE variable here
	idex int,
	aid varchar(64),
	aname nvarchar(200),
	aparent varchar(64),
	alevel tinyint
)
AS
BEGIN
	-- Fill the table variable with the rows for your result set
	if @aid != '' or @aid is not null
	begin
		declare @tempCount int
		declare @count int
		declare @isNearAddress bit

		set @count = 0
		if(@alevel < 16) begin
			select @count = count([A_ID])from dbo.Address 
			where @location.STIntersects(A_Border) = 1
			and A_Level = @alevel
			and A_ParentID =[dbo].ToGuid(@aid)
			and A_Status != 4

		end else begin
			select @count = count([A_ID])from dbo.Address 
			where A_Border.STDistance(@location) < 20 
			and A_Level = @alevel
			and A_Status != 4
		end
		if(@count > 0)
		begin
		if(@alevel < 16) begin
			insert @tbl(idex,aid, aname,aparent, alevel) select ROW_NUMBER() over( order by [A_ID]),cast(A_ID as varchar(64)), A_Name, cast(A_ParentID as varchar(64)) , A_Level
			from dbo.Address
			where @location.STIntersects(A_Border) = 1
			and A_Level = @alevel
			and A_ParentID =[dbo].ToGuid(@aid)
			and A_Status != 4
		end else begin
			insert @tbl(idex,aid, aname,aparent, alevel) select ROW_NUMBER() over( order by [A_ID]),cast(A_ID as varchar(64)), A_Name, cast(A_ParentID as varchar(64)) , A_Level
			from dbo.Address
			where A_Border.STDistance(@location) < 20 
			and A_Level = @alevel
			and A_Status != 4
		end
			declare @row int
			set @row = 1
			while @row <= @count
			begin
				select @tempCount = count(idex) from @tbl
				select @aid = aid from @tbl where idex = @row
				insert @tbl(idex,aid, aname, aparent, alevel) select ROW_NUMBER() over( order by idex) + @tempCount,aid, aname, aparent, alevel
				from [udfGetAddressOfLocation](@location, @aid, @alevel * 2)
				set @row = @row +1
			end
		end
	end
	RETURN 
END

GO
/****** Object:  UserDefinedFunction [dbo].[udfGetAddressStringOfLocation]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE FUNCTION [dbo].[udfGetAddressStringOfLocation] 
(
	-- Add the parameters for the function here
	@tblAddressOfLocation AddressOfLocation readonly
	,@address_name nvarchar(500)
	,@address_pid varchar(64)
)
RETURNS 
@tbl TABLE 
(
	-- Add the column definitions for the TABLE variable here
	address_name nvarchar(500)
)
AS
BEGIN
	declare @count int
	declare @tempTable table (
		idex int, 
		aid varchar(64),
		aname nvarchar(200),
		aparent varchar(64),
		alevel tinyint
	);

	set @count = 0
	select @count = count(idex) from @tblAddressOfLocation where aparent = @address_pid
			

	if(@count > 0)
	begin
		insert @tempTable (idex, aid, aname, aparent,alevel) 
		select ROW_NUMBER() over( order by idex), aid, aname, aparent,alevel from @tblAddressOfLocation where @address_pid = aparent

		declare @row int
		set @row = 1
		while @row <= @count
		begin
				
			select @address_name = ', ' +  aname  +  @address_name, @address_pid = aid from @tempTable where idex = @row;

			insert @tbl(address_name) select address_name from [dbo].[udfGetAddressStringOfLocation](@tblAddressOfLocation, @address_name, @address_pid) 
			set @row = @row +1
		end
	end else begin
			if(@address_name != '' or @address_name is not null) begin
				insert @tbl(address_name) values(@address_name)
			end
 
	end
	RETURN  
END

GO
/****** Object:  UserDefinedFunction [dbo].[udfGetParentOfAddress]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE FUNCTION [dbo].[udfGetParentOfAddress] 
(
	-- Add the parameters for the function here
	@childID varchar(64)
)
RETURNS 
@tbl TABLE 
(
	-- Add the column definitions for the TABLE variable here
	idex int,
	parentID varchar(64),
	aname nvarchar(200),
	alevel tinyint
)
AS
BEGIN
	-- Fill the table variable with the rows for your result set
	if @childID != '' or @childID is not null
	begin
		declare @tempCount int
		declare @count int
		set @count = 0
		select @count = count([A_ID])from dbo.Address where [A_ID] = [dbo].ToGuid(@childID)
		if(@count > 0)
		begin
			insert @tbl(idex,parentID, aname, alevel) select ROW_NUMBER() over( order by [A_ID]),cast(A_ParentID as nchar(64)), A_Name, A_Level
			from dbo.Address
			where [A_ID] =[dbo].ToGuid(@childID)
			declare @row int
			set @row = 1
			while @row <= @count
			begin
				select @tempCount = count(idex) from @tbl
				select @childID = parentID from @tbl where idex = @row
				insert @tbl(idex,parentID, aname, alevel) select ROW_NUMBER() over( order by idex) + @tempCount,parentID, aname, alevel
				from udfGetParentOfAddress(@childID)
				set @row = @row +1
			end
		end
	end
	RETURN 
END

GO
/****** Object:  Table [dbo].[Address]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Address](
	[A_ID] [uniqueidentifier] NOT NULL,
	[A_Center] [geography] NULL,
	[A_CenterXY] [geometry] NULL,
	[A_Border] [geography] NULL,
	[A_BorderXY] [geometry] NULL,
	[A_ParentID] [uniqueidentifier] NULL,
	[A_Level] [tinyint] NULL,
	[A_Name] [nvarchar](200) NULL,
	[A_Description] [nvarchar](3000) NULL,
	[A_CreatedByUser] [varchar](128) NULL,
	[A_CreatedOnDate] [datetime2](7) NULL,
	[A_ReviewedByUser] [varchar](128) NULL,
	[A_ReviewedOnDate] [datetime2](7) NULL,
	[A_Status] [tinyint] NULL,
 CONSTRAINT [PK_Address_1] PRIMARY KEY CLUSTERED 
(
	[A_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AddressBorderExtension]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AddressBorderExtension](
	[AE_ID] [uniqueidentifier] NOT NULL,
	[AE_AddressID] [uniqueidentifier] NULL,
	[AE_Border] [geography] NULL,
	[AE_BorderXY] [geometry] NULL,
 CONSTRAINT [PK_AddressBorderExtension] PRIMARY KEY CLUSTERED 
(
	[AE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AddressCenterExtension]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AddressCenterExtension](
	[ACE_ID] [uniqueidentifier] NOT NULL,
	[ACE_AddressID] [uniqueidentifier] NULL,
	[ACE_Center] [geography] NULL,
	[ACE_CenterXY] [geometry] NULL,
 CONSTRAINT [PK_AddressCenterExtension] PRIMARY KEY CLUSTERED 
(
	[ACE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[History]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[History](
	[H_ID] [uniqueidentifier] NOT NULL,
	[H_AddressID] [uniqueidentifier] NULL,
	[H_Center] [geography] NULL,
	[H_CenterXY] [geometry] NULL,
	[H_Border] [geography] NULL,
	[H_BorderXY] [geometry] NULL,
	[H_ParentID] [uniqueidentifier] NULL,
	[H_Level] [tinyint] NULL,
	[H_Name] [nvarchar](200) NULL,
	[H_Description] [nvarchar](3000) NULL,
	[H_CreatedByUser] [varchar](128) NULL,
	[H_CreatedOnDate] [datetime2](7) NULL,
	[H_ModifiedOnDate] [datetime2](7) NULL,
	[H_Action] [varchar](50) NULL,
	[H_ActionDetail] [nvarchar](1000) NULL,
	[H_Rate] [int] NULL,
	[H_Status] [tinyint] NULL,
 CONSTRAINT [PK_History] PRIMARY KEY CLUSTERED 
(
	[H_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[User]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[U_User] [varchar](128) NOT NULL,
	[U_FullName] [nvarchar](200) NULL,
	[U_Birthday] [datetime2](7) NULL,
	[U_Gender] [tinyint] NULL,
	[U_Email] [nvarchar](300) NULL,
	[U_CreatedOnDate] [datetime2](7) NULL,
	[U_Role] [tinyint] NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[U_User] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [dbo].[Address] ADD  CONSTRAINT [DF_Address_A_ID]  DEFAULT (newid()) FOR [A_ID]
GO
ALTER TABLE [dbo].[Address]  WITH CHECK ADD  CONSTRAINT [FK_Address_User] FOREIGN KEY([A_CreatedByUser])
REFERENCES [dbo].[User] ([U_User])
GO
ALTER TABLE [dbo].[Address] CHECK CONSTRAINT [FK_Address_User]
GO
ALTER TABLE [dbo].[Address]  WITH CHECK ADD  CONSTRAINT [FK_Address_User2] FOREIGN KEY([A_ReviewedByUser])
REFERENCES [dbo].[User] ([U_User])
GO
ALTER TABLE [dbo].[Address] CHECK CONSTRAINT [FK_Address_User2]
GO
ALTER TABLE [dbo].[AddressBorderExtension]  WITH CHECK ADD  CONSTRAINT [FK_AddressBorderExtension_Address] FOREIGN KEY([AE_AddressID])
REFERENCES [dbo].[Address] ([A_ID])
GO
ALTER TABLE [dbo].[AddressBorderExtension] CHECK CONSTRAINT [FK_AddressBorderExtension_Address]
GO
ALTER TABLE [dbo].[AddressCenterExtension]  WITH CHECK ADD  CONSTRAINT [FK_AddressCenterExtension_Address] FOREIGN KEY([ACE_AddressID])
REFERENCES [dbo].[Address] ([A_ID])
GO
ALTER TABLE [dbo].[AddressCenterExtension] CHECK CONSTRAINT [FK_AddressCenterExtension_Address]
GO
ALTER TABLE [dbo].[History]  WITH CHECK ADD  CONSTRAINT [FK_History_Address] FOREIGN KEY([H_AddressID])
REFERENCES [dbo].[Address] ([A_ID])
GO
ALTER TABLE [dbo].[History] CHECK CONSTRAINT [FK_History_Address]
GO
ALTER TABLE [dbo].[History]  WITH CHECK ADD  CONSTRAINT [FK_History_User1] FOREIGN KEY([H_CreatedByUser])
REFERENCES [dbo].[User] ([U_User])
GO
ALTER TABLE [dbo].[History] CHECK CONSTRAINT [FK_History_User1]
GO
/****** Object:  StoredProcedure [dbo].[Address_Add]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	Thêm mới địa chỉ, kiem tra user chua ton tai cung them vao luon
-- =============================================
CREATE PROCEDURE [dbo].[Address_Add] 
	-- Add the parameters for the stored procedure here
	
    @A_Center varchar(64) 
    ,@A_Border varchar(max) 
    ,@A_ParentID varchar(64) = '00000000-0000-0000-0000-000000000000' 
    ,@A_Level tinyint 
    ,@A_Name nvarchar(200) 
    ,@A_Description nvarchar(2000) 
    ,@A_CreatedByUser varchar(128) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @A_ID uniqueidentifier = newid(), @roweffect int=0;

	--Check exits user in address system
	if not exists (select 1 from [Address].[dbo].[User] where U_User = @A_CreatedByUser)
	begin
		insert into [Address].[dbo].[User] (U_User, U_CreatedOnDate, U_Role)
		values (@A_CreatedByUser, getdate(),2)
	end

	declare @userRole tinyint, @A_ReviewedByUser nchar(128) = null
           ,@A_ReviewedOnDate datetime2(7) =null
           ,@A_Status tinyint;
	select @userRole = U_Role from [Address].[dbo].[User] where U_User = @A_CreatedByUser
	if(@userRole & 12 != 0) -- check user la cong tac vien va admin
	begin
		set @A_ReviewedByUser = @A_CreatedByUser;
		set @A_ReviewedOnDate = GETDATE();
		set @A_Status = 2 -- trang thai duoc review
	end
	else
	begin
		set @A_Status = 1
	end
    -- Insert statements for procedure here
	
    begin transaction address_add
	save transaction save_address_add

	declare @border geography
	if(@A_Level != 16) begin
		set @border = geography::STGeomFromText('POLYGON((' + @A_Border + '))', 4326);
	if (@border.EnvelopeAngle() >= 90)
	begin
		set @border= @border.ReorientObject();
	end

	end 
	INSERT INTO [dbo].[Address]
           ([A_ID]
           ,[A_Center]
           ,[A_CenterXY]
           ,[A_Border]
           ,[A_BorderXY]
           ,[A_ParentID]
           ,[A_Level]
           ,[A_Name]
           ,[A_Description]
           ,[A_CreatedByUser]
           ,[A_CreatedOnDate]
           ,[A_ReviewedByUser]
           ,[A_ReviewedOnDate]
           ,[A_Status])
     VALUES 
		( @A_ID
		,geography::STGeomFromText('POINT(' + @A_Center + ')', 4326)
		,geometry::STGeomFromText('POINT(' + @A_Center + ')', 0)
		,case when @A_Level & 16 = 0 then @border
			when @A_Level & 16 != 0 then geography::STGeomFromText('LINESTRING(' + @A_Border + ')', 4326)
			end
		,case when @A_Level & 16 = 0 then geometry::STGeomFromText(@border.ToString(), 0)
			when @A_Level & 16 != 0 then geometry::STGeomFromText('LINESTRING(' + @A_Border + ')', 0)
			end
		,[dbo].[ToGuid](@A_ParentID)
		,@A_Level
		,LTRIM(RTRIM(@A_Name))
		,LTRIM(RTRIM(@A_Description))
		,@A_CreatedByUser
		,GETDATE()
		,@A_ReviewedByUser
		,@A_ReviewedOnDate
		,@A_Status
		)
    set @roweffect=@@ROWCOUNT + @roweffect;       
	if(@@ERROR != 0) begin rollback transaction save_address_add end	
	
			
	INSERT INTO [dbo].[History]
           ([H_ID]
           ,[H_AddressID]
           ,[H_Center]
           ,[H_CenterXY]
           ,[H_Border]
           ,[H_BorderXY]
           ,[H_ParentID]
           ,[H_Level]
           ,[H_Name]
           ,[H_Description]
           ,[H_CreatedByUser]
           ,[H_CreatedOnDate]
           --,[H_ModifiedOnDate]
           ,[H_Action]
           ,[H_ActionDetail]
           ,[H_Rate]
           ,[H_Status])
     VALUES (
		NewID()
		,@A_ID
		,geography::STGeomFromText('POINT(' + @A_Center + ')', 4326)
		,geometry::STGeomFromText('POINT(' + @A_Center + ')', 0)
		,case when @A_Level & 16 = 0 then @border
			when @A_Level & 16 != 0 then geography::STGeomFromText('LINESTRING(' + @A_Border + ')', 4326)
			end
		,case when @A_Level & 16 = 0 then (geometry::STGeomFromText(@border.ToString(), 0)).MakeValid()
			when @A_Level & 16 != 0 then geometry::STGeomFromText('LINESTRING(' + @A_Border + ')', 0)
			end
		,[dbo].[ToGuid](@A_ParentID)
		,@A_Level
		,LTRIM(RTRIM(@A_Name))
		,LTRIM(RTRIM(@A_Description))
		,@A_CreatedByUser
		,GETDATE()
		,'ADD'
		,N'thêm địa danh'
		,0
		,2
	 )
	 set @roweffect=@@ROWCOUNT + @roweffect;
	 if(@@ERROR != 0) begin rollback transaction save_address_add end
	 
	 			
	 commit transaction address_add

	 return @roweffect;
END

GO
/****** Object:  StoredProcedure [dbo].[Address_AddValidate]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Kiểm tra tính hợp lệ của đường bao
-- Kiểm tra tâm có nằm trong đường bao
-- Kiểm tra đường bao có nằm trong đường bao cha
-- Kiểm tra trùng với các đường bao cùng cấp, cung cha.
-- Lay ra cac dia danh co the trung
-- =============================================
CREATE PROCEDURE [dbo].[Address_AddValidate]
	-- Add the parameters for the stored procedure here
	@A_ID varchar(64) =''
	,@A_Center varchar(64) 
    ,@A_Border varchar(max) 
    ,@A_ParentID varchar(64) = '00000000-0000-0000-0000-000000000000' 
    ,@A_Level tinyint 
    ,@A_Name nvarchar(200)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @DuongBaoHopLe tinyint
			,@DiemNamTrongDuongBao tinyint
			,@DuongBaoNamTrongDuongBao tinyint
			,@TrungLenDuongBaoKhac tinyint
			,@Center geography
			,@Border geography;
	
	if(@A_Level != 16) 
	begin
		set @Center  = geography::STGeomFromText('POINT(' + @A_Center + ')', 4326);
		set @Border  = geography::STGeomFromText('POLYGON((' + @A_Border + '))', 4326);

		set @DuongBaoHopLe =  @Border.STIsValid() ; --=1 neu hop le, 0 neu khong hop le

		if (@DuongBaoHopLe = 0) 
		begin
			set @Border = @Border.MakeValid();
		end

		if (@Border.EnvelopeAngle() >= 90)
		begin
			set @Border= @Border.ReorientObject();
		end

		set @DiemNamTrongDuongBao = @Center.STIntersects(@Border); -- =1 neu diem do nam trong, =0 neu khong giao nhau


		declare @ParentBorderXY geometry, @ParentBorder geography, @BorderXY geometry = geometry::STGeomFromText(@Border.ToString(), 0);;

		if @A_ParentID = '00000000-0000-0000-0000-000000000000' begin
			set @DuongBaoNamTrongDuongBao = 1;

		end else begin
			select @ParentBorderXY = A_BorderXY, @ParentBorder = A_Border from  [Address] where A_ID = [Address].[dbo].ToGuid(@A_ParentID) and A_Status != 4;
		
			--set @DuongBaoNamTrongDuongBao = @BorderXY.MakeValid().STWithin(@ParentBorderXY.MakeValid());  -- =1 neu nam ben trong hoan toan, 0 neu khong phai
			set @DuongBaoNamTrongDuongBao = case when [Address].[dbo].[STCheckIntersectPercentBetweentTwoPolygons](@Border, @ParentBorder.MakeValid()) > 95 then 1 -- nam trong tuong doi
													else 0 end;
		end
		select @DuongBaoHopLe as DuongBaoHopLe, @DiemNamTrongDuongBao as DiemNamTrongDuongBao, @DuongBaoNamTrongDuongBao as DuongBaoNamTrongDuongBao

		--select * from [Address] where  LOWER(A_Name) like N'%' + LOWER(LTRIM(RTRIM(@A_Name))) + N'%'

		if (@A_ID = '') begin  -- validate khi tao moi moi dia chi
			select A_ID, A_Name,A_Description, A_CreatedByUser, A_CreatedOnDate, A_Status from [Address] where A_ParentID = [Address].[dbo].ToGuid(@A_ParentID) 
			and A_Status != 4
			and (LOWER(A_Name) like N'%' + LOWER(LTRIM(RTRIM(@A_Name))) + N'%' 
			or [Address].[dbo].[STCheckIntersectPercentBetweentTwoPolygons](A_Border, @Border) > 20 
			or [Address].[dbo].[STCheckIntersectPercentBetweentTwoPolygons](@Border, A_Border) > 20)
		end else
		begin
			select A_ID, A_Name,A_Description, A_CreatedByUser, A_CreatedOnDate, A_Status from [Address] where A_ParentID = [Address].[dbo].ToGuid(@A_ParentID) 
			and A_Status != 4
			and A_ID != [Address].[dbo].ToGuid(@A_ID) and (LOWER(A_Name) like N'%' + LOWER(LTRIM(RTRIM(@A_Name))) + N'%' 
			or [Address].[dbo].[STCheckIntersectPercentBetweentTwoPolygons](A_Border, @Border) > 20 
			or [Address].[dbo].[STCheckIntersectPercentBetweentTwoPolygons](@Border, A_Border) > 20)

		end
		-- Insert statements for procedure here
	end
	else begin
		set @Center  = geography::STGeomFromText('POINT(' + @A_Center + ')', 4326);
		set @Border  = geography::STGeomFromText('LINESTRING(' + @A_Border + ')', 4326);

		set @DuongBaoHopLe =  @Border.STIsValid() ; --=1 neu hop le, 0 neu khong hop le

		if (@DuongBaoHopLe = 0) 
		begin
			set @Border = @Border.MakeValid();
		end


		set @DiemNamTrongDuongBao =case when @Border.STDistance(@Center) > 10 then 0
										else 1 
										end ; -- =1 neu diem do nam trong, =0 neu khong giao nhau


		
		
		set @DuongBaoNamTrongDuongBao = 1;  -- =1 neu nam ben trong hoan toan, 0 neu khong phai

		select @DuongBaoHopLe as DuongBaoHopLe, @DiemNamTrongDuongBao as DiemNamTrongDuongBao, @DuongBaoNamTrongDuongBao as DuongBaoNamTrongDuongBao

		--select * from [Address] where  LOWER(A_Name) like N'%' + LOWER(LTRIM(RTRIM(@A_Name))) + N'%'
		if (@A_ID = '') begin -- validate khi tao moi moi dia chi
			select A_ID, A_Name,A_Description, A_CreatedByUser, A_CreatedOnDate, A_Status from [Address] where A_Level = 16 
			and A_Status != 4
			and (LOWER(A_Name) like N'%' + LOWER(LTRIM(RTRIM(@A_Name))) + N'%' 
			or [Address].[dbo].[STCheckIntersectPercentBetweentTwoPolygons](A_Border.STBuffer(15), @Border.STBuffer(15)) > 40 
			or [Address].[dbo].[STCheckIntersectPercentBetweentTwoPolygons](@Border.STBuffer(15), A_Border.STBuffer(15)) > 40)
		end
		else begin 
			select A_ID, A_Name,A_Description, A_CreatedByUser, A_CreatedOnDate, A_Status from [Address] where A_Level = 16 
			and A_Status != 4
			and A_ID != [Address].[dbo].ToGuid(@A_ID) and  (LOWER(A_Name) like N'%' + LOWER(LTRIM(RTRIM(@A_Name))) + N'%' 
			or [Address].[dbo].[STCheckIntersectPercentBetweentTwoPolygons](A_Border.STBuffer(15), @Border.STBuffer(15)) > 40 
			or [Address].[dbo].[STCheckIntersectPercentBetweentTwoPolygons](@Border.STBuffer(15), A_Border.STBuffer(15)) > 40)
		end
	end
END

GO
/****** Object:  StoredProcedure [dbo].[Address_CheckExists]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 08/06/2012
-- Description:	Kiểm tra tại vị trí đánh dấu đã có địa điểm nào chưa
-- =============================================
CREATE PROCEDURE [dbo].[Address_CheckExists] 
	-- Add the parameters for the stored procedure here
	@A_ParentID varchar(64)
	,@A_Level tinyint
	,@A_Center varchar(64) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @Center geography;
	set @Center  = geography::STGeomFromText('POINT(' + @A_Center + ')', 4326);
    -- Insert statements for procedure here
	if(@A_Level != 16) 
	begin
		select A_ID, A_Name, A_Level from [Address] where A_ParentID = @A_ParentID and A_Level = @A_Level and A_Status != 4
		and @Center.STIntersects(A_Border) = 1

	end else 
	begin
		select A_ID, A_Name, A_Level from [Address] where A_Level = @A_Level and A_Status != 4
		and  A_Border.STDistance(@Center) < 10
	end
END

GO
/****** Object:  StoredProcedure [dbo].[Address_Delete]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		DVH
-- Create date: 21/05/2012
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Address_Delete] 
	-- Add the parameters for the stored procedure here
	@A_ID varchar(64),
	@UserID varchar(128),
	@Reason nvarchar(1000)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @userRole tinyint, @H_Status tinyint, @roweffect int = 0;
	if exists (select 1 from [Address].dbo.[User] where U_User  = @UserID)
	begin
		select @userRole = U_Role  from [Address].dbo.[User] where U_User  = @UserID

		if(@userRole & 12 != 0)  --or exists(select 1 from History where H_AddressID = [Address].dbo.ToGuid(@A_ID) and H_CreatedByUser = @UserID and H_Status = 2))
		begin
			set @H_Status = 2 -- phien ban lich su dang duoc su dung
		end
		-- la user binh thuong
		else begin
			
			set @H_Status = 1 -- phien ban lich su chua duoc ap dung
		end

		if( @H_Status = 2) begin
			update [dbo].[History]
			set H_Status = 1
			where H_AddressID = [Address].dbo.ToGuid(@A_ID)
		end

		insert into History 
		(	[H_ID]
           ,[H_AddressID]
           ,[H_Center]
           ,[H_CenterXY]
           ,[H_Border]
           ,[H_BorderXY]
           ,[H_ParentID]
           ,[H_Level]
           ,[H_Name]
           ,[H_Description]
           ,[H_CreatedByUser]
           ,[H_CreatedOnDate]
           --,[H_ModifiedOnDate]
           ,[H_Action]
           ,[H_ActionDetail]
           ,[H_Rate]
           ,[H_Status])
		select newid(), A_ID, A_Center, A_CenterXY, A_Border,A_BorderXY, A_ParentID
		,A_Level, A_Name, A_Description, @UserID, getdate(), 'DELETE', @Reason, 0, @H_Status  from [Address] where A_ID = [Address].dbo.ToGuid(@A_ID)

		set @roweffect = @@ROWCOUNT + @roweffect;

		if(@userRole & 12 != 0) --or exists(select 1 from History where H_AddressID = [Address].dbo.ToGuid(@A_ID) and H_CreatedByUser = @UserID and H_Status = 2)) 
		begin
			UPDATE [dbo].[Address]
			   SET 
				 
				  [A_CreatedByUser] = @UserID
				  ,[A_CreatedOnDate] = getdate()
				  --,[A_ReviewedByUser] = @H_CreatedByUser
				  --,[A_ReviewedOnDate] = getdate()
				  ,[A_Status] = 4 -- danh dau xoa
			 WHERE A_ID = [Address].dbo.ToGuid(@A_ID)
			 set @roweffect = @@ROWCOUNT + @roweffect;
		end


	end

	return @roweffect
END

GO
/****** Object:  StoredProcedure [dbo].[Address_GetAddressOfLocation]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 03/07/2012
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Address_GetAddressOfLocation] 
	-- Add the parameters for the stored procedure here
	@A_Center varchar(64)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @tempTbl as AddressOfLocation ;
	insert @tempTbl select * from [dbo].[udfGetAddressOfLocation] (geography::STGeomFromText('POINT(' + @A_Center + ')', 4326), '00000000-0000-0000-0000-000000000000', 1)
    -- Insert statements for procedure here
	SELECT * from [dbo].[udfGetAddressStringOfLocation](@tempTbl,'','00000000-0000-0000-0000-000000000000')
END

GO
/****** Object:  StoredProcedure [dbo].[Address_GetDetailWithChildren]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 06.05.12
-- Description:	Lấy danh sách các địa chỉ theo id cha và chi tiết thông tin địa chỉ của id cha (ko bao gồm lịch sử)
-- =============================================
CREATE PROCEDURE [dbo].[Address_GetDetailWithChildren] 
	-- Add the parameters for the stored procedure here
	@AddressID varchar(64)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @g nvarchar(max), @level tinyint, @border geography;
    -- Insert statements for procedure here
	SELECT [A_ID]
      ,[dbo].[ToPointString]([A_Center].ToString()) as A_Center
	  --,@g = [A_Border].ToString()
      ,[A_ParentID]
      ,[A_Level]
      ,[A_Name]
      ,[A_Description]
	from dbo.Address where dbo.Address.A_ID = [dbo].[ToGuid](@AddressID)


	select  @border = A_Border, @level = A_Level from dbo.Address   where dbo.Address.A_ID = [dbo].[ToGuid](@AddressID) and A_Status != 4

	set @g= case when @level != 16 then [dbo].[ToPolygonString](@border.ToString())
				else [dbo].[ToLineString](@border.ToString())
				end;
	select part as LongLat  from [dbo].[SplitString](@g , ', ')

	if (@level & 7 != 0) 
	begin
		select [A_ID]
		  --,[A_ParentID]
		  ,[A_Level]
		  ,[A_Name]
		  ,[A_Description] from dbo.Address where A_ParentID = [dbo].[ToGuid](@AddressID) and A_Status != 4 order by A_Name asc
	end
	else begin
		select [A_ID]
		  --,[A_ParentID]
		  ,[A_Level]
		  ,[A_Name]
		  ,[A_Description] from dbo.Address where A_Level = 16 and  @border.STDistance(A_Border) <= 50 and A_Status != 4 order by A_Name asc
	end
END

GO
/****** Object:  StoredProcedure [dbo].[Address_GetDetailWithHistory]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 06.05.12
-- Description:	Lấy thông tin chi tiết của một địa chỉ đã bao gồm cả lịch sử
-- =============================================
CREATE PROCEDURE [dbo].[Address_GetDetailWithHistory] 
	-- Add the parameters for the stored procedure here
	@AddressID varchar(64),
	@UserID	varchar(128) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @userRole tinyint;
	select @userRole = U_Role from [Address].[dbo].[User] where U_User = @UserID
    -- Insert statements for procedure here
	SELECT [A_ID]
      ,[A_ParentID]
      ,[A_Level]
      ,[A_Name]
      ,[A_Description]
      ,[A_CreatedByUser]
      ,[A_CreatedOnDate]
      ,[A_ReviewedByUser]
      ,[A_ReviewedOnDate]
      ,[A_Status]
	from dbo.Address where dbo.Address.A_ID = [dbo].[ToGuid](@AddressID) and A_Status != 4

	select [H_ID]
      ,[H_AddressID]
      ,[H_ParentID]
      ,[H_Level]
      ,[H_Name]
      ,[H_Description]
      ,[H_CreatedByUser]
      ,[H_CreatedOnDate]
      ,[H_ModifiedOnDate]
      ,[H_Action]
      ,[H_ActionDetail]
      ,[H_Rate]
      ,[H_Status]
	  ,[H_IsRestore] = case when @userRole is null or @userRole & 3 != 0   then 0 -- khong co quyen restore
							when @userRole is not null and @userRole & 12 != 0   then 1 -- co quyen restore
							else -1 -- khong gi ca
						end
	  ,[H_IsOwner] = case when @UserID = [H_CreatedByUser] and  @userRole & 1 = 0  then 2 -- la nguoi tao ra ban ghi lich su
							when @UserID = [H_CreatedByUser] and  @userRole & 1 != 0  then 1 -- la nguoi tao ra ban ghi lich su nhung da bi khoa tai khoan
							else 0 -- khong la nguoi so huu
						end
	 from [dbo].[History] where [H_AddressID] = [dbo].[ToGuid](@AddressID) order by H_CreatedOnDate desc
END

GO
/****** Object:  StoredProcedure [dbo].[Address_GetNewest]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Address_GetNewest]
	-- Add the parameters for the stored procedure here
	@PageNumber int
	,@ItemPerPage int = 10
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	if (@PageNumber > 0) 
	begin 
    -- Insert statements for procedure here
		WITH #temp as
			(   
			select (ROW_NUMBER() over (order by [H_CreatedOnDate] desc)) as RowNum
				,[H_ID]
			  ,[H_AddressID]
			  --,[H_ParentID]
			  ,[H_Level]
			  ,[H_Name]
			  --,[H_Description]
			  ,[H_CreatedByUser]
			  ,[H_CreatedOnDate]
			  ,[H_ModifiedOnDate]
			  ,[H_Action]
			  ,[H_ActionDetail]
			  ,[H_Rate]
			  ,[H_Status]	 
			  from History as h1 where H_CreatedOnDate = (select MAX(H_CreatedOnDate) from History as h2 where h1.H_AddressID = h2.H_AddressID  group by H_AddressID)
			)

		select  #temp.*, [Address].A_Name  from #temp 
		inner join [Address] on #temp.H_AddressID = [Address].A_ID
		where RowNum between (@PageNumber-1)*@ItemPerPage+1 and (@PageNumber)*@ItemPerPage
	end
	else 
	begin
		select 
		[H_ID]
		,[H_AddressID]
		--,[H_ParentID]
		,[H_Level]
		,[H_Name]
		--,[H_Description]
		,[H_CreatedByUser]
		,[H_CreatedOnDate]
		,[H_ModifiedOnDate]
		,[H_Action]
		,[H_ActionDetail]
		,[H_Rate]
		,[H_Status]	 
		,[Address].A_Name
		from History as h1 inner join [Address] on h1.H_AddressID = [Address].A_ID  where H_CreatedOnDate = (select MAX(H_CreatedOnDate) from History as h2 where h1.H_AddressID = h2.H_AddressID  group by H_AddressID)

	end
END

GO
/****** Object:  StoredProcedure [dbo].[Address_RestoreFromHistory]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	Restore lịch sử đồng thời review luôn bản ghi đó. Admin, cộng tác viên khi xem lịch sử của địa chỉ, sẽ có nút Restore bên cạnh luôn. Có thể xem trong view or backend, tùy vào quyền mà hiện
-- =============================================
CREATE PROCEDURE [dbo].[Address_RestoreFromHistory] 
	-- Add the parameters for the stored procedure here
	@H_ID varchar(64),
	@UserID varchar(128)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @userRole tinyint, @roweffect int = 0;
	select @userRole = U_Role from [Address].[dbo].[User] where U_User = @UserID
    -- Insert statements for procedure here
	-- update history vao lich su
	if(@userRole & 12 != 0) begin -- quyen la admin or 
		update [Address]
		set 
			[A_Center] = History.H_Center
			,[A_CenterXY] = History.H_CenterXY
			,[A_Border] = History.H_Border
			,[A_BorderXY] = History.H_BorderXY
			,[A_ParentID] = History.H_ParentID
			,[A_Level] = History.H_Level
			,[A_Name] = History.H_Name
			,[A_Description] = History.H_Description
			,[A_CreatedByUser] = History.H_CreatedByUser
			,[A_CreatedOnDate] = History.H_CreatedOnDate
			,[A_ReviewedByUser] = @UserID
			,[A_ReviewedOnDate] = getdate()
			,[A_Status] = case when History.H_Action ='DELETE' then 4 -- danh dau xoa
						else 2 -- danh dau dia diem da duoc review
						end
			from History, [Address]
		where History.H_ID =[Address].dbo.ToGuid(@H_ID)  and [Address].A_ID = History.H_AddressID

		set @roweffect = @@ROWCOUNT  + @roweffect;

		-- update lai ban ghi lich su do thanh ban ghi hien tai

		update [dbo].[History]
			set H_Status = case when H_ID = [Address].dbo.ToGuid(@H_ID) then 2
							else 1
							end
			where H_AddressID in (select H_AddressID from [History] where H_ID = [Address].dbo.ToGuid(@H_ID))

		
	end

	return @roweffect
END

GO
/****** Object:  StoredProcedure [dbo].[Address_Review]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	Review va unreview địa chỉ
-- =============================================
CREATE PROCEDURE [dbo].[Address_Review] 
	-- Add the parameters for the stored procedure here
	@AddressID varchar(64)
	,@UserID varchar(128)
	,@A_Status tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @userRole tinyint, @roweffect int = 0;
	select @userRole = U_Role from [Address].[dbo].[User] where U_User = @UserID
    -- Insert statements for procedure here
	if(@userRole & 12 != 0) begin
		update Address
		set 
			A_ReviewedByUser = @UserID,
			A_ReviewedOnDate = getdate(),
			A_Status = @A_Status
		where A_ID = @AddressID

		set @roweffect = @@ROWCOUNT  + @roweffect;
	end

	return @roweffect
END

GO
/****** Object:  StoredProcedure [dbo].[History_AddAddress]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	User sửa một địa chỉ sẽ thêm bản ghi address vào bảng lịch sử nếu user là admin or cộng tác viên thì bản ghi này được tin tưởng và restore luôn vào địa chỉ chính thức đồng thời review luôn
-- Nếu user là người sở hữu và bản ghi hiện tại cũng là của user này thì cũng update luôn vào bảng địa chỉ, giữ nguyên trạng thái
-- =============================================
CREATE PROCEDURE [dbo].[History_AddAddress] 
	-- Add the parameters for the stored procedure here
	 
    @H_AddressID varchar(64) 
    ,@H_Center varchar(64)  

    ,@H_Border nvarchar(max) 

    ,@H_ParentID varchar(64) 
    ,@H_Level tinyint 
    ,@H_Name nvarchar(200) 
    ,@H_Description nvarchar(2000) 
    ,@H_CreatedByUser varchar(128)
	,@H_ActionDetail nvarchar(1000)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @userRole tinyint, @H_Status tinyint, @roweffect int = 0;
	if exists (select 1 from [Address].dbo.[User] where U_User  = @H_CreatedByUser)
	begin
		select @userRole = U_Role  from [Address].dbo.[User] where U_User  = @H_CreatedByUser

		-- user la reviewer thay doi status cua lich su sang dang duoc ap dung
		if(@userRole & 12 != 0 or exists(select 1 from History where H_AddressID = [Address].dbo.ToGuid(@H_AddressID) and H_CreatedByUser = @H_CreatedByUser and H_Status = 2)) begin
			set @H_Status = 2 -- phien ban lich su dang duoc su dung
		end
		-- la user binh thuong
		else begin
			
			set @H_Status = 1 -- phien ban lich su chua duoc ap dung
		end

		

		begin transaction history_add
		save transaction save_history_add

		declare @border geography;
		if(@H_Level != 16) begin
			set @border = geography::STGeomFromText('POLYGON((' + @H_Border + '))', 4326);
			if (@border.EnvelopeAngle() >= 90)
			begin
				set @border= @border.ReorientObject();
			end
		 end
		 else begin 
			set @border = geography::STGeomFromText('LINESTRING(' + @H_Border + ')', 4326);

		 end
		declare @editName nvarchar(200), @editDesc nvarchar(200), @editBorder nvarchar(200), @editCenter nvarchar(200);

		

		if( @H_Status = 2) begin
			update [dbo].[History]
			set H_Status = 1
			where H_AddressID = [Address].dbo.ToGuid(@H_AddressID)
		end

		select @editName = case when A_Name != LTRIM(RTRIM(@H_Name)) then N'sửa tên, ' else '' end
				,@editDesc = case when A_Description != LTRIM(RTRIM(@H_Description)) then N'sửa miêu tả, ' else '' end
				,@editBorder = case when A_Border.STEquals(@border) = 0 then N'sửa đường nét ngoài, ' else '' end
				,@editCenter = case when A_Center.STEquals(geography::STGeomFromText('POINT(' + @H_Center + ')', 4326)) = 0 then N'sửa tâm, ' else '' end
		 from [dbo].[Address] where A_ID = [Address].dbo.ToGuid(@H_AddressID)

		 if(@editName != '' or @editBorder != '' or @editCenter != '' or @editDesc != '') begin

		 set @H_ActionDetail = @editName  + @editDesc + @editCenter + @editBorder;

		INSERT INTO [dbo].[History]
           ([H_ID]
           ,[H_AddressID]
           ,[H_Center]
           ,[H_CenterXY]
           ,[H_Border]
           ,[H_BorderXY]
           ,[H_ParentID]
           ,[H_Level]
           ,[H_Name]
           ,[H_Description]
           ,[H_CreatedByUser]
           ,[H_CreatedOnDate]
           --,[H_ModifiedOnDate]
           ,[H_Action]
           ,[H_ActionDetail]
           ,[H_Rate]
           ,[H_Status])
		 VALUES
			   (
			   newid()
			   ,[Address].dbo.ToGuid(@H_AddressID)
			   ,geography::STGeomFromText('POINT(' + @H_Center + ')', 4326)
				,geometry::STGeomFromText('POINT(' + @H_Center + ')', 0)
				,case when @H_Level & 16 = 0 then @border
					when @H_Level & 16 != 0 then geography::STGeomFromText('LINESTRING(' + @H_Border + ')', 4326)
					end
				,case when @H_Level & 16 = 0 then (geometry::STGeomFromText(@border.ToString(), 0)).MakeValid()
					when @H_Level & 16 != 0 then geometry::STGeomFromText('LINESTRING(' + @H_Border + ')', 0)
					end
					,[Address].dbo.ToGuid(@H_ParentID)
					,@H_Level
					,LTRIM(RTRIM(@H_Name))
					,LTRIM(RTRIM(@H_Description))
					,@H_CreatedByUser
					,getdate()
					,'EDIT'
					,@H_ActionDetail
					,0
					,@H_Status
			   )
		set @roweffect = @@ROWCOUNT + @roweffect;		
		if(@@ERROR != 0) begin rollback transaction save_history_add end

		
		-- neu user la admin or reviewer thi restore ban ghi nay vao bang dia chi luong
		if(@userRole & 12 != 0 or exists(select 1 from History where H_AddressID = [Address].dbo.ToGuid(@H_AddressID) and H_CreatedByUser = @H_CreatedByUser and H_Status = 2)) 
		begin
			UPDATE [dbo].[Address]
			   SET 
				  [A_Center] = geography::STGeomFromText('POINT(' + @H_Center + ')', 4326)
				  ,[A_CenterXY] = geometry::STGeomFromText('POINT(' + @H_Center + ')', 0)
				  ,[A_Border] = case when @H_Level & 16 = 0 then @border
									when @H_Level & 16 != 0 then geography::STGeomFromText('LINESTRING(' + @H_Border + ')', 4326)
									end
				  ,[A_BorderXY] = case when @H_Level & 16 = 0 then geometry::STGeomFromText(@border.ToString(), 0)
									when @H_Level & 16 != 0 then geometry::STGeomFromText('LINESTRING(' + @H_Border + ')', 0)
									end
				  ,[A_ParentID] = [Address].dbo.ToGuid(@H_ParentID)
				  ,[A_Level] = @H_Level
				  ,[A_Name] = LTRIM(RTRIM(@H_Name))
				  ,[A_Description] =LTRIM(RTRIM(@H_Description))
				  ,[A_CreatedByUser] = @H_CreatedByUser
				  ,[A_CreatedOnDate] = getdate()
				  --,[A_ReviewedByUser] = @H_CreatedByUser
				  --,[A_ReviewedOnDate] = getdate()
				  --,[A_Status] = 2 
			 WHERE A_ID = [Address].dbo.ToGuid(@H_AddressID)
			 set @roweffect = @@ROWCOUNT + @roweffect;

			 if(@@ERROR != 0) begin rollback transaction save_history_add end

			 if(@userRole & 12 != 0) 
			 begin
				UPDATE [dbo].[Address]
				SET  [A_ReviewedByUser] = @H_CreatedByUser
					,[A_ReviewedOnDate] = getdate()
					,[A_Status] = 2 -- danh dau review cho ban ghi dia chi nay khi user thao tac la admin hoac reviewer
				WHERE A_ID = [Address].dbo.ToGuid(@H_AddressID)
				set @roweffect = @@ROWCOUNT + @roweffect;

				if(@@ERROR != 0) begin rollback transaction save_history_add end
			 end
		end
		
		end
		commit transaction address_add
	end
    -- Insert statements for procedure here

	return @roweffect
	
END

GO
/****** Object:  StoredProcedure [dbo].[History_GetAddressOfUser]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	Lấy các thao tác địa chỉ tương ứng với một user
-- =============================================
CREATE PROCEDURE [dbo].[History_GetAddressOfUser] 
	-- Add the parameters for the stored procedure here
	@UserID varchar(128)
	,@PageNumber int
	,@ItemPerPage int = 10
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	--Check exits user in address system
	if not exists (select 1 from [Address].[dbo].[User] where U_User = @UserID)
	begin
		insert into [Address].[dbo].[User] (U_User, U_CreatedOnDate, U_Role)
		values (@UserID, getdate(),2)
	end

	if (@PageNumber > 0) 
	begin 
    -- Insert statements for procedure here
		WITH #temp as
			(   
			select (ROW_NUMBER() over (order by [H_CreatedOnDate] desc)) as RowNum
				,[H_ID]
			  ,[H_AddressID]
			  --,[H_ParentID]
			  ,[H_Level]
			  ,[H_Name]
			  --,[H_Description]
			  ,[H_CreatedByUser]
			  ,[H_CreatedOnDate]
			  ,[H_ModifiedOnDate]
			  ,[H_Action]
			  ,[H_ActionDetail]
			  ,[H_Rate]
			  ,[H_Status]	 
			  from History where H_CreatedByUser = @UserID
			)

		select  *  from #temp inner join [Address] on #temp.H_AddressID = [Address].A_ID
		where RowNum between (@PageNumber-1)*@ItemPerPage+1 and (@PageNumber)*@ItemPerPage
	end
	else 
	begin
		select 
		[H_ID]
		,[H_AddressID]
		--,[H_ParentID]
		,[H_Level]
		,[H_Name]
		--,[H_Description]
		,[H_CreatedByUser]
		,[H_CreatedOnDate]
		,[H_ModifiedOnDate]
		,[H_Action]
		,[H_ActionDetail]
		,[H_Rate]
		,[H_Status]	 
		from History inner join [Address] on History.H_AddressID = [Address].A_ID where H_CreatedByUser = @UserID
	end
END

GO
/****** Object:  StoredProcedure [dbo].[History_GetDetail]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	Lấy thông tin chi tiết gồm đường bao, tâm của một địa chỉ trong lịch sử. User xem thông tin chi tiết của lịch sử trên bản đồ
-- =============================================
CREATE PROCEDURE [dbo].[History_GetDetail] 
	-- Add the parameters for the stored procedure here
	@H_ID varchar(64)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @g nvarchar(max);
    -- Insert statements for procedure here
	SELECT [H_ID]
		,[H_AddressID]
      ,[dbo].[ToPointString]([H_Center].ToString()) as H_Center
      ,[H_ParentID]
      ,[H_Level]
      ,[H_Name]
      ,[H_Description]
	  ,[H_CreatedByUser]
	  ,[H_CreatedOnDate]
	  ,[H_ModifiedOnDate]
	  ,[H_Action]
	  ,[H_ActionDetail]
	  ,[H_Rate]
	  ,[H_Status]
	from dbo.History where dbo.History.H_ID = [dbo].[ToGuid](@H_ID) 

	select @g= case when H_Level != 16 then [dbo].[ToPolygonString]([H_Border].ToString())
				else [dbo].[ToLineString]([H_Border].ToString())
				end
	 from dbo.History   where dbo.History.H_ID = [dbo].[ToGuid](@H_ID)

	select part as LongLat from [dbo].[SplitString](@g , ', ')
END

GO
/****** Object:  StoredProcedure [dbo].[History_Update]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	User tạo ra một lịch sử địa chỉ được quyền được quyền sửa bản ghi này. Nếu bản ghi chưa được áp dụng thì update bình thường, nếu bản ghi đag được áp dụng thì tùy vào quyền user:
--1. user bình thường: thêm thành một bản ghi nữa
--2. user admin: thì update sang địa chỉ luôn, va chuyen trang thai sang duoc ap dung
-- =============================================
CREATE PROCEDURE [dbo].[History_Update] 
	-- Add the parameters for the stored procedure here
	@H_ID varchar(64)
	,@H_AddressID varchar(64) 
    ,@H_Center varchar(64)  

    ,@H_Border nvarchar(max) 

    ,@H_ParentID varchar(64) 
    ,@H_Level tinyint 
    ,@H_Name nvarchar(200) 
    ,@H_Description nvarchar(2000) 
    ,@H_CreatedByUser varchar(128)
	,@H_ActionDetail nvarchar(1000)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @userRole tinyint, @H_Status tinyint, @roweffect int = 0;
	select @userRole = U_Role  from [Address].dbo.[User] where U_User  = @H_CreatedByUser
	select @H_Status = H_Status from History where H_ID = @H_ID


	if(@H_Status = 1 or (@userRole & 12 != 0 and @H_Status =2)) begin -- trang thai chua duoc ap dung
    UPDATE [dbo].[History]
	   SET
		  [H_Center] = geography::STGeomFromText('POINT(' + @H_Center + ')', 4326)
		  ,[H_CenterXY] = geometry::STGeomFromText('POINT(' + @H_Center + ')', 0)
		  ,[H_Border] = case when @H_Level & 16 = 0 then geography::STGeomFromText('POLYGON((' + @H_Border + '))', 4326)
					when @H_Level & 16 != 0 then geography::STGeomFromText('LINESTRING(' + @H_Border + ')', 4326)
					end
		  ,[H_BorderXY] = case when @H_Level & 16 = 0 then geometry::STGeomFromText('POLYGON((' + @H_Border + '))', 0)
					when @H_Level & 16 != 0 then geometry::STGeomFromText('LINESTRING(' + @H_Border + ')', 0)
					end
		  --,[H_ParentID] = dbo.ToGuid(@H_ParentID)
		  ,[H_Name] = @H_Name
		  ,[H_Description] = @H_Description
		  ,[H_ModifiedOnDate] = getdate()
		  ,H_Status = case when @userRole & 12 != 0 then 2
							when @userRole & 12 = 0 then 1
							end
	   WHERE H_ID = @H_ID and H_CreatedByUser = @H_CreatedByUser

	    set @roweffect = @@ROWCOUNT + @roweffect;

	   end 

	   if(@H_Status = 2)-- trang thai dang duoc ap dung
	   begin
	  
		if(@userRole & 12 != 0) -- neu use la admin thi update sang dia chi
		   begin
				UPDATE [dbo].[Address]
				   SET 
					  [A_Center] = geography::STGeomFromText('POINT(' + @H_Center + ')', 4326)
					  ,[A_CenterXY] = geometry::STGeomFromText('POINT(' + @H_Center + ')', 0)
					  ,[A_Border] = case when @H_Level & 16 = 0 then geography::STGeomFromText('POLYGON((' + @H_Border + '))', 4326)
										when @H_Level & 16 != 0 then geography::STGeomFromText('LINESTRING(' + @H_Border + ')', 4326)
										end
					  ,[A_BorderXY] = case when @H_Level & 16 = 0 then geometry::STGeomFromText('POLYGON((' + @H_Border + '))', 0)
										when @H_Level & 16 != 0 then geometry::STGeomFromText('LINESTRING(' + @H_Border + ')', 0)
										end
					  ,[A_ParentID] = dbo.ToGuid(@H_ParentID)
					  ,[A_Level] = @H_Level
					  ,[A_Name] = @H_Name
					  ,[A_Description] = @H_Description
					  ,[A_ReviewedByUser] = @H_CreatedByUser
					  ,[A_ReviewedOnDate] = getdate()
					  ,[A_Status] = 2
				 WHERE A_ID = @H_AddressID

				 set @roweffect = @@ROWCOUNT + @roweffect;
		   end
		   else begin
				INSERT INTO [dbo].[History]
				   ([H_ID]
				   ,[H_AddressID]
				   ,[H_Center]
				   ,[H_CenterXY]
				   ,[H_Border]
				   ,[H_BorderXY]
				   ,[H_ParentID]
				   ,[H_Level]
				   ,[H_Name]
				   ,[H_Description]
				   ,[H_CreatedByUser]
				   ,[H_CreatedOnDate]
				   --,[H_ModifiedOnDate]
				   ,[H_Action]
				   ,[H_ActionDetail]
				   ,[H_Rate]
				   ,[H_Status])
				 VALUES
					   (
					   newid()
					   ,dbo.ToGuid(@H_AddressID)
					   ,geography::STGeomFromText('POINT(' + @H_Center + ')', 4326)
						,geometry::STGeomFromText('POINT(' + @H_Center + ')', 0)
						,case when @H_Level & 16 = 0 then geography::STGeomFromText('POLYGON((' + @H_Border + '))', 4326)
							when @H_Level & 16 != 0 then geography::STGeomFromText('LINESTRING(' + @H_Border + ')', 4326)
							end
						,case when @H_Level & 16 = 0 then geometry::STGeomFromText('POLYGON((' + @H_Border + '))', 0)
							when @H_Level & 16 != 0 then geometry::STGeomFromText('LINESTRING(' + @H_Border + ')', 0)
							end
							,dbo.ToGuid(@H_ParentID)
							,@H_Level
							,@H_Name
							,@H_Description
							,@H_CreatedByUser
							,getdate()
							,'EDIT'
							,@H_ActionDetail
							,0
							,1 -- chua duoc ap dung
					   )
				set @roweffect = @@ROWCOUNT + @roweffect;
		   end
	 end

	 return @roweffect
END

GO
/****** Object:  StoredProcedure [dbo].[User_Add]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[User_Add] 
	-- Add the parameters for the stored procedure here
	@U_User varchar(128)
    ,@U_FullName nvarchar(500)
    ,@U_Birthday datetime2(7)
    ,@U_Gender bit
    ,@U_Role tinyint
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @roweffect int = 0;
    -- Insert statements for procedure here
	if not exists (select Top 1 * from [Address].dbo.[User])
	begin

		INSERT INTO [dbo].[User]
			   ([U_User]
			   ,[U_FullName]
			   ,[U_Birthday]
			   ,[U_Gender]
			   ,[U_CreatedOnDate]
			   ,[U_Role])
		 VALUES
			   (@U_User 
			   ,@U_FullName 
			   ,@U_Birthday 
			   ,@U_Gender 
			   ,getdate()
			   ,@U_Role )

			   set @roweffect = @@ROWCOUNT + @roweffect;

		return @roweffect;
	end
	else 
	begin
		update [dbo].[User]
		set U_FullName = @U_FullName,
			U_Birthday = @U_Birthday,
			U_Gender =@U_Gender,
			U_Role = @U_Role

		where U_User = @U_User
		 set @roweffect = @@ROWCOUNT + @roweffect;
	end

	return @roweffect;
END

GO
/****** Object:  StoredProcedure [dbo].[User_GetDetail]    Script Date: 8/20/2019 2:18:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		dvh
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[User_GetDetail] 
	-- Add the parameters for the stored procedure here
	@U_User varchar(128)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * from [User] where U_User = @U_User and U_Role != 1
END

GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'bảng này chứa địa giới hành chính để xuất sang các ứng dụng khác' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tâm của vùng địa giới' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_Center'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tâm ở hệ tọa độ decac' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_CenterXY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Đường biên bao ngoài một vùng địa giới hoặc là đường' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_Border'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'đường biên tương ứng trong hệ td decac' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_BorderXY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'id cha' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_ParentID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'cấp độ.1: quốc gia/đất nước, 2: tỉnh/thành phố, 4: quận/huyện/thị xã, 8: phường/xã/ thị trấn, 16: đường' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_Level'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tên của vùng địa giới' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_Name'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'các miêu tả khác như diện tích, dân số, ...chứa nội dung html' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_Description'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'user đầu tiên tạo' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_CreatedByUser'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ngày tạo' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_CreatedOnDate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Người review' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_ReviewedByUser'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ngày review, cũng là ngày admin và các cộng tác viên restore một bản ghi trong lịch sử' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_ReviewedOnDate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'trạng thái. 1: chưa được review, 2: đã được review . Cả 2 trạng thái đều public trên hệ thống địa chỉ, 4: Danh dau xoa se khong hien thi ra ngoai' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Address', @level2type=N'COLUMN',@level2name=N'A_Status'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Bảng này chứa các tính toán về đường biên để phục vụ việc phát hiện địa chỉ tự động' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AddressBorderExtension', @level2type=N'COLUMN',@level2name=N'AE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'id liên kết với bảng địa chỉ' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AddressBorderExtension', @level2type=N'COLUMN',@level2name=N'AE_AddressID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'trường geom mở rộng để tính toán vd như nội suy đường thành polygon...' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AddressBorderExtension', @level2type=N'COLUMN',@level2name=N'AE_Border'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'trường geog mở rộng' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AddressBorderExtension', @level2type=N'COLUMN',@level2name=N'AE_BorderXY'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'bảng này chứa thông tin về trung tâm kinh tế chính trị của các địa giới hành chính, một địa giới hành chính có thể có nhiều trung tâm' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'AddressCenterExtension', @level2type=N'COLUMN',@level2name=N'ACE_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Bảng này chứa lịch sử cập nhật địa chỉ' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'History', @level2type=N'COLUMN',@level2name=N'H_ID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'liên đến bản ghi địa chỉ được public lên bản đồ' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'History', @level2type=N'COLUMN',@level2name=N'H_AddressID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'chứa nội dung html' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'History', @level2type=N'COLUMN',@level2name=N'H_Description'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tên thao tác: 1: ADD, 2:  EDIT, 4: DELETE' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'History', @level2type=N'COLUMN',@level2name=N'H_Action'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Chi tiết thao tác: nếu sửa thì sửa gì, xóa thì vì sao xóa, ..' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'History', @level2type=N'COLUMN',@level2name=N'H_ActionDetail'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'điểm đánh giá, cái này có khi sẽ xây dựng sau, cần cơ chế rõ ràng, trách rác và sai lệnh' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'History', @level2type=N'COLUMN',@level2name=N'H_Rate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'có phải phiên bản hiện tại không, 1: chưa được áp dụng, 2: đang được áp dụng, 4: khoa khong cho sua' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'History', @level2type=N'COLUMN',@level2name=N'H_Status'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'usernam lấy bên login' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'User', @level2type=N'COLUMN',@level2name=N'U_User'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'tền đầy đủ lấy bên login' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'User', @level2type=N'COLUMN',@level2name=N'U_FullName'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ngày sinh lấy bên login' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'User', @level2type=N'COLUMN',@level2name=N'U_Birthday'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ngày user join vào hệ thống địa chỉ' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'User', @level2type=N'COLUMN',@level2name=N'U_CreatedOnDate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'quyền của user trong hệ thống. 1: disable, 2: user bình thường, 4: review, 8: super admin' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'User', @level2type=N'COLUMN',@level2name=N'U_Role'
GO
