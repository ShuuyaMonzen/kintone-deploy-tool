using KintoneDeployTool.DataAccess.AutoSetter;
using KintoneDeployTool.DataAccess.DomainModel;
using KintoneDeployTool.Migrations;
using KintoneDeployTool.Utils.Transaction;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace KintoneDeployTool.DataAccess
{
    public class AppInnerDBContext : DbContext
    {

        public DbSet<MstKintoneEnviroment> MstKintoneEnviroment { get; internal set; }
        public DbSet<MstKintoneApp> MstKintoneApp { get; internal set; }
        public DbSet<TrnActionLog> TrnActionLog { get; internal set; }

        public DbSet<MstDeployPreset> MstDeployPreset { get; internal set; }
        public DbSet<MstDeployFromToInfo> MstDeployFromToInfo { get; internal set; }
        public DbSet<MstKintoneAppMapping> MstKintoneAppMapping { get; internal set; }
        public DbSet<MstKintoneAppMappingDetail> MstKintoneAppMappingDetail { get; internal set; }

        /// <summary>自動設定マネージャ</summary>
        public AutoSetterManager AutoSetterManager { get; set; }

        public AppInnerDBContext(AutoSetterManager autoSetterManager)
        {
            AutoSetterManager = autoSetterManager;
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {

            ChangeTracker.DetectChanges(); // Important!

            // 有効なトランザクションがあればそのトランザクションで動作し、なければ新しく作られる
            using var transaction = TransactionScopeBuilder.Create();
            SaveChanging();
            var result = base.SaveChangesAsync(cancellationToken);
            SaveChanged();

            transaction.Complete();
            return result;
        }

        /// <summary>
        /// 保存時の処理を行う。
        /// </summary>
        private void SaveChanging()
        {
            // 変更などあったレコードを取得
            var entryList = this.ChangeTracker
                .Entries()
                .Where(x =>
                    x.State == EntityState.Added ||
                    x.State == EntityState.Modified)
                .ToList();

            foreach (var entry in entryList)
            {
                AutoSetterManager.Set(entry);
            }
        }

        /// <summary>
        /// 保存後の処理を行う。
        /// </summary>
        private void SaveChanged()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string specialFolderPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            string folderName = "KintoneDeployTool";
            string dbFileName = "KintoneDeployTool.db";
            var dbFilePath = Path.Combine(specialFolderPath, folderName, dbFileName);

            CreateDBFile(dbFilePath);

            var connectionString = new SqliteConnectionStringBuilder
            {
                DataSource = dbFilePath,
                ForeignKeys = true
            }.ToString();
            var connection = new SqliteConnection(connectionString);
            connection.OpenAsync().GetAwaiter().GetResult();
            optionsBuilder.UseSqlite(connection);
            optionsBuilder.ConfigureWarnings(x => x.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.AmbientTransactionWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        private void CreateDBFile(string filePath)
        {
            // FileInfoのインスタンスを生成する
            var fileInfo = new FileInfo(filePath);
            // フォルダーが存在するかどうかを確認
            if (!fileInfo.Directory.Exists)
            {
                // フォルダーが存在しない場合は作成
                fileInfo.Directory.Create();
            }
            if (!File.Exists(filePath))
            {
                // ファイルを作成する
                using (File.Create(filePath))
                {
                    //何もしない
                }
            }
        }
    }
}
