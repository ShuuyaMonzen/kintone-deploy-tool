﻿// <auto-generated />
using System;
using KintoneDeployTool.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace KintoneDeployTool.Migrations
{
    [DbContext(typeof(AppInnerDBContext))]
    [Migration("20220807131950_ADDMappingName")]
    partial class ADDMappingName
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "5.0.17");

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstDeployFromToInfo", b =>
                {
                    b.Property<int>("MstDeployFromToInfoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<int>("DeployFromMstKintoneAppID")
                        .HasColumnType("INTEGER");

                    b.Property<int>("DeployToMstKintoneAppID")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MstDeployPresetId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("TrnDeployPresetId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.HasKey("MstDeployFromToInfoId");

                    b.HasIndex("DeployFromMstKintoneAppID");

                    b.HasIndex("DeployToMstKintoneAppID");

                    b.HasIndex("TrnDeployPresetId");

                    b.ToTable("TrnDeployFromToInfo");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstDeployPreset", b =>
                {
                    b.Property<int>("MstDeployPresetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("LatestActionDateTime")
                        .HasColumnType("TEXT");

                    b.Property<int?>("MstKintoneAppMappingID")
                        .HasColumnType("INTEGER");

                    b.Property<string>("PresetName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.HasKey("MstDeployPresetId");

                    b.HasIndex("MstKintoneAppMappingID");

                    b.ToTable("TrnDeployPreset");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstKintoneApp", b =>
                {
                    b.Property<int>("MstKintoneAppID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ApiToken")
                        .HasColumnType("TEXT");

                    b.Property<int>("AppId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("AppName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MstKintoneEnviromentID")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("SpaceId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.HasKey("MstKintoneAppID");

                    b.HasIndex("MstKintoneEnviromentID");

                    b.ToTable("MstKintoneApp");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstKintoneAppMapping", b =>
                {
                    b.Property<int>("MstKintoneAppMappingID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("MstKintoneAppMappingName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("MstKintoneEnviromentID1")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MstKintoneEnviromentID2")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.HasKey("MstKintoneAppMappingID");

                    b.HasIndex("MstKintoneEnviromentID1");

                    b.HasIndex("MstKintoneEnviromentID2");

                    b.ToTable("MstKintoneAppMapping");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstKintoneAppMappingDetail", b =>
                {
                    b.Property<int>("MstKintoneAppMappingDetailID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<int>("MstKintoneAppID1")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MstKintoneAppID2")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MstKintoneAppMappingID")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.HasKey("MstKintoneAppMappingDetailID");

                    b.HasIndex("MstKintoneAppID1");

                    b.HasIndex("MstKintoneAppID2");

                    b.HasIndex("MstKintoneAppMappingID");

                    b.ToTable("MstKintoneAppMappingDetail");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstKintoneEnviroment", b =>
                {
                    b.Property<int>("MstKintoneEnviromentID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("EnviromentName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .HasColumnType("TEXT");

                    b.Property<string>("SubDomain")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserID")
                        .HasColumnType("TEXT");

                    b.HasKey("MstKintoneEnviromentID");

                    b.ToTable("MstKintoneEnviroment");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.TrnActionLog", b =>
                {
                    b.Property<int>("TrnActionLogId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("ActionDateTime")
                        .HasColumnType("TEXT");

                    b.Property<string>("ActionName")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("ErrorMessage")
                        .HasColumnType("TEXT");

                    b.Property<int>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.HasKey("TrnActionLogId");

                    b.ToTable("TrnActionLog");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstDeployFromToInfo", b =>
                {
                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstKintoneApp", "DeployFromMstKintoneApp")
                        .WithMany()
                        .HasForeignKey("DeployFromMstKintoneAppID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstKintoneApp", "DeployToMstKintoneApp")
                        .WithMany()
                        .HasForeignKey("DeployToMstKintoneAppID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstDeployPreset", "MstDeployPreset")
                        .WithMany("MstDeployFromToInfos")
                        .HasForeignKey("TrnDeployPresetId");

                    b.Navigation("DeployFromMstKintoneApp");

                    b.Navigation("DeployToMstKintoneApp");

                    b.Navigation("MstDeployPreset");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstDeployPreset", b =>
                {
                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstKintoneAppMapping", "MstKintoneAppMapping")
                        .WithMany()
                        .HasForeignKey("MstKintoneAppMappingID");

                    b.Navigation("MstKintoneAppMapping");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstKintoneApp", b =>
                {
                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstKintoneEnviroment", "MstKintoneEnviroment")
                        .WithMany("MstKintoneApps")
                        .HasForeignKey("MstKintoneEnviromentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MstKintoneEnviroment");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstKintoneAppMapping", b =>
                {
                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstKintoneEnviroment", "MstKintoneEnviroment1")
                        .WithMany()
                        .HasForeignKey("MstKintoneEnviromentID1")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstKintoneEnviroment", "MstKintoneEnviroment2")
                        .WithMany()
                        .HasForeignKey("MstKintoneEnviromentID2")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MstKintoneEnviroment1");

                    b.Navigation("MstKintoneEnviroment2");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstKintoneAppMappingDetail", b =>
                {
                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstKintoneApp", "MstKintoneApp1")
                        .WithMany()
                        .HasForeignKey("MstKintoneAppID1")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstKintoneApp", "MstKintoneApp2")
                        .WithMany()
                        .HasForeignKey("MstKintoneAppID2")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KintoneDeployTool.DataAccess.DomainModel.MstKintoneAppMapping", "MstKintoneAppMapping")
                        .WithMany("MstKintoneAppMappingDetails")
                        .HasForeignKey("MstKintoneAppMappingID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MstKintoneApp1");

                    b.Navigation("MstKintoneApp2");

                    b.Navigation("MstKintoneAppMapping");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstDeployPreset", b =>
                {
                    b.Navigation("MstDeployFromToInfos");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstKintoneAppMapping", b =>
                {
                    b.Navigation("MstKintoneAppMappingDetails");
                });

            modelBuilder.Entity("KintoneDeployTool.DataAccess.DomainModel.MstKintoneEnviroment", b =>
                {
                    b.Navigation("MstKintoneApps");
                });
#pragma warning restore 612, 618
        }
    }
}
