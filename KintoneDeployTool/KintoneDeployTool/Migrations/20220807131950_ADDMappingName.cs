using Microsoft.EntityFrameworkCore.Migrations;

namespace KintoneDeployTool.Migrations
{
    public partial class ADDMappingName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MstKintoneAppMappingID",
                table: "TrnDeployPreset",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MstKintoneAppMappingName",
                table: "MstKintoneAppMapping",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_TrnDeployPreset_MstKintoneAppMappingID",
                table: "TrnDeployPreset",
                column: "MstKintoneAppMappingID");

            migrationBuilder.AddForeignKey(
                name: "FK_TrnDeployPreset_MstKintoneAppMapping_MstKintoneAppMappingID",
                table: "TrnDeployPreset",
                column: "MstKintoneAppMappingID",
                principalTable: "MstKintoneAppMapping",
                principalColumn: "MstKintoneAppMappingID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrnDeployPreset_MstKintoneAppMapping_MstKintoneAppMappingID",
                table: "TrnDeployPreset");

            migrationBuilder.DropIndex(
                name: "IX_TrnDeployPreset_MstKintoneAppMappingID",
                table: "TrnDeployPreset");

            migrationBuilder.DropColumn(
                name: "MstKintoneAppMappingID",
                table: "TrnDeployPreset");

            migrationBuilder.DropColumn(
                name: "MstKintoneAppMappingName",
                table: "MstKintoneAppMapping");
        }
    }
}
