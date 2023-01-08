using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace KintoneDeployTool.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MstKintoneEnviroment",
                columns: table => new
                {
                    MstKintoneEnviromentID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EnviromentName = table.Column<string>(type: "TEXT", nullable: false),
                    SubDomain = table.Column<string>(type: "TEXT", nullable: false),
                    UserID = table.Column<string>(type: "TEXT", nullable: true),
                    Password = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MstKintoneEnviroment", x => x.MstKintoneEnviromentID);
                });

            migrationBuilder.CreateTable(
                name: "TrnActionLog",
                columns: table => new
                {
                    TrnActionLogId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    ActionName = table.Column<string>(type: "TEXT", nullable: true),
                    ErrorMessage = table.Column<string>(type: "TEXT", nullable: true),
                    ActionDateTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrnActionLog", x => x.TrnActionLogId);
                });

            migrationBuilder.CreateTable(
                name: "TrnDeployPreset",
                columns: table => new
                {
                    MstDeployPresetId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PresetName = table.Column<string>(type: "TEXT", nullable: false),
                    LatestActionDateTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrnDeployPreset", x => x.MstDeployPresetId);
                });

            migrationBuilder.CreateTable(
                name: "MstKintoneApp",
                columns: table => new
                {
                    MstKintoneAppID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MstKintoneEnviromentID = table.Column<int>(type: "INTEGER", nullable: false),
                    AppId = table.Column<int>(type: "INTEGER", nullable: false),
                    SpaceId = table.Column<int>(type: "INTEGER", nullable: true),
                    AppName = table.Column<string>(type: "TEXT", nullable: false),
                    ApiToken = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MstKintoneApp", x => x.MstKintoneAppID);
                    table.ForeignKey(
                        name: "FK_MstKintoneApp_MstKintoneEnviroment_MstKintoneEnviromentID",
                        column: x => x.MstKintoneEnviromentID,
                        principalTable: "MstKintoneEnviroment",
                        principalColumn: "MstKintoneEnviromentID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MstKintoneAppMapping",
                columns: table => new
                {
                    MstKintoneAppMappingID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MstKintoneEnviromentID1 = table.Column<int>(type: "INTEGER", nullable: false),
                    MstKintoneEnviromentID2 = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MstKintoneAppMapping", x => x.MstKintoneAppMappingID);
                    table.ForeignKey(
                        name: "FK_MstKintoneAppMapping_MstKintoneEnviroment_MstKintoneEnviromentID1",
                        column: x => x.MstKintoneEnviromentID1,
                        principalTable: "MstKintoneEnviroment",
                        principalColumn: "MstKintoneEnviromentID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MstKintoneAppMapping_MstKintoneEnviroment_MstKintoneEnviromentID2",
                        column: x => x.MstKintoneEnviromentID2,
                        principalTable: "MstKintoneEnviroment",
                        principalColumn: "MstKintoneEnviromentID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrnDeployFromToInfo",
                columns: table => new
                {
                    MstDeployFromToInfoId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MstDeployPresetId = table.Column<int>(type: "INTEGER", nullable: false),
                    TrnDeployPresetId = table.Column<int>(type: "INTEGER", nullable: true),
                    DeployFromMstKintoneAppID = table.Column<int>(type: "INTEGER", nullable: false),
                    DeployToMstKintoneAppID = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrnDeployFromToInfo", x => x.MstDeployFromToInfoId);
                    table.ForeignKey(
                        name: "FK_TrnDeployFromToInfo_MstKintoneApp_DeployFromMstKintoneAppID",
                        column: x => x.DeployFromMstKintoneAppID,
                        principalTable: "MstKintoneApp",
                        principalColumn: "MstKintoneAppID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrnDeployFromToInfo_MstKintoneApp_DeployToMstKintoneAppID",
                        column: x => x.DeployToMstKintoneAppID,
                        principalTable: "MstKintoneApp",
                        principalColumn: "MstKintoneAppID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrnDeployFromToInfo_TrnDeployPreset_TrnDeployPresetId",
                        column: x => x.TrnDeployPresetId,
                        principalTable: "TrnDeployPreset",
                        principalColumn: "MstDeployPresetId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MstKintoneAppMappingDetail",
                columns: table => new
                {
                    MstKintoneAppMappingDetailID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MstKintoneAppMappingID = table.Column<int>(type: "INTEGER", nullable: false),
                    MstKintoneAppID1 = table.Column<int>(type: "INTEGER", nullable: false),
                    MstKintoneAppID2 = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MstKintoneAppMappingDetail", x => x.MstKintoneAppMappingDetailID);
                    table.ForeignKey(
                        name: "FK_MstKintoneAppMappingDetail_MstKintoneApp_MstKintoneAppID1",
                        column: x => x.MstKintoneAppID1,
                        principalTable: "MstKintoneApp",
                        principalColumn: "MstKintoneAppID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MstKintoneAppMappingDetail_MstKintoneApp_MstKintoneAppID2",
                        column: x => x.MstKintoneAppID2,
                        principalTable: "MstKintoneApp",
                        principalColumn: "MstKintoneAppID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MstKintoneAppMappingDetail_MstKintoneAppMapping_MstKintoneAppMappingID",
                        column: x => x.MstKintoneAppMappingID,
                        principalTable: "MstKintoneAppMapping",
                        principalColumn: "MstKintoneAppMappingID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MstKintoneApp_MstKintoneEnviromentID",
                table: "MstKintoneApp",
                column: "MstKintoneEnviromentID");

            migrationBuilder.CreateIndex(
                name: "IX_MstKintoneAppMapping_MstKintoneEnviromentID1",
                table: "MstKintoneAppMapping",
                column: "MstKintoneEnviromentID1");

            migrationBuilder.CreateIndex(
                name: "IX_MstKintoneAppMapping_MstKintoneEnviromentID2",
                table: "MstKintoneAppMapping",
                column: "MstKintoneEnviromentID2");

            migrationBuilder.CreateIndex(
                name: "IX_MstKintoneAppMappingDetail_MstKintoneAppID1",
                table: "MstKintoneAppMappingDetail",
                column: "MstKintoneAppID1");

            migrationBuilder.CreateIndex(
                name: "IX_MstKintoneAppMappingDetail_MstKintoneAppID2",
                table: "MstKintoneAppMappingDetail",
                column: "MstKintoneAppID2");

            migrationBuilder.CreateIndex(
                name: "IX_MstKintoneAppMappingDetail_MstKintoneAppMappingID",
                table: "MstKintoneAppMappingDetail",
                column: "MstKintoneAppMappingID");

            migrationBuilder.CreateIndex(
                name: "IX_TrnDeployFromToInfo_DeployFromMstKintoneAppID",
                table: "TrnDeployFromToInfo",
                column: "DeployFromMstKintoneAppID");

            migrationBuilder.CreateIndex(
                name: "IX_TrnDeployFromToInfo_DeployToMstKintoneAppID",
                table: "TrnDeployFromToInfo",
                column: "DeployToMstKintoneAppID");

            migrationBuilder.CreateIndex(
                name: "IX_TrnDeployFromToInfo_TrnDeployPresetId",
                table: "TrnDeployFromToInfo",
                column: "TrnDeployPresetId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MstKintoneAppMappingDetail");

            migrationBuilder.DropTable(
                name: "TrnActionLog");

            migrationBuilder.DropTable(
                name: "TrnDeployFromToInfo");

            migrationBuilder.DropTable(
                name: "MstKintoneAppMapping");

            migrationBuilder.DropTable(
                name: "MstKintoneApp");

            migrationBuilder.DropTable(
                name: "TrnDeployPreset");

            migrationBuilder.DropTable(
                name: "MstKintoneEnviroment");
        }
    }
}
