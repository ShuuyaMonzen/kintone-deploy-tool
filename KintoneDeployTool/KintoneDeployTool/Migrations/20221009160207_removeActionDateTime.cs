using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace KintoneDeployTool.Migrations
{
    public partial class removeActionDateTime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LatestActionDateTime",
                table: "TrnDeployPreset");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LatestActionDateTime",
                table: "TrnDeployPreset",
                type: "TEXT",
                nullable: true);
        }
    }
}
