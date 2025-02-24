using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ecomApi.Migrations
{
    public partial class newColumnAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
               name: "UserName",
               table: "AspNetUsers",
               type: "nvarchar(max)",
               nullable: false,
               defaultValue: "",
               oldClrType: typeof(int),
               oldType: "int",
               oldNullable: false);
        }
    }
}
